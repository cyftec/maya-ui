import { exists, lstat, readdir, rm } from "node:fs/promises";
import { NO_HTML_ERROR, NO_JS_ERROR } from "../common/constants.ts";
import {
  createDirIfNotExist,
  getFileNameFromPath,
  nonCachedImport,
} from "../common/utils.ts";
import type { KarmaConfig } from "../sample-app/karma-types.ts";
import {
  buildHtmlFnDef,
  getBuildDirPath,
  getBuildFileNames,
  getBuiltJsMethodName,
  isSrcPageFile,
  mountAndRunFnDef,
} from "./build-helpers.ts";

type BuildData = {
  appRootPath: string;
  config: KarmaConfig;
  isProd: boolean;
};

const buildData: BuildData = {} as BuildData;

const buildHtmlFile = async (destHtmlPath: string, destJsPath: string) => {
  try {
    const { default: page, buildPageHtml } = await nonCachedImport(destJsPath);
    const pageHtml = buildPageHtml(page);
    const html = `<!DOCTYPE html>\n${pageHtml}`;
    if (!html) throw new Error(NO_HTML_ERROR);
    await Bun.write(destHtmlPath, html);
  } catch (error) {
    console.log(error);
    console.log(destHtmlPath);
  }
};

const buildJsFile = async (destJsPath: string, srcPagePath: string) => {
  const jsBuild = await Bun.build({
    entrypoints: [srcPagePath],
  });
  const js = await jsBuild.outputs.map(async (o) => await o.text())[0];
  if (!js) {
    console.log(jsBuild);
    throw new Error(NO_JS_ERROR);
  }
  const sanitizedJs = `
    ${js}
    ${buildHtmlFnDef}
  `;

  await Bun.write(destJsPath, sanitizedJs);
};

const sanitizeJsFile = async (destJsPath: string) => {
  const jsWithExports = await Bun.file(destJsPath).text();
  if (!jsWithExports) {
    throw new Error(NO_JS_ERROR);
  }
  const sanitizedJs = `
    ${jsWithExports.split("export {")[0]}
    ${mountAndRunFnDef(
      getBuiltJsMethodName(
        getFileNameFromPath(destJsPath) as string,
        buildData.config
      )
    )}
    \n${
      !buildData.isProd && buildData.config.brahma.localServer.reloadPageOnFocus
        ? "window.onfocus = () => location.reload();"
        : ""
    }
  `;

  await Bun.write(destJsPath, sanitizedJs);
};

const minifyJsFile = async (destJsPath: string) => {
  const jsBuild = await Bun.build({
    entrypoints: [destJsPath],
    minify: true,
  });
  const minifiedJsCode = await jsBuild.outputs.map(
    async (o) => await o.text()
  )[0];
  if (!minifiedJsCode) {
    throw new Error(NO_JS_ERROR);
  }
  await Bun.write(destJsPath, minifiedJsCode);
};

const buildFile = async (srcFilePath: string, destDirPath: string) => {
  if (isSrcPageFile(srcFilePath, buildData.config)) {
    const srcPagePath = srcFilePath;
    const { htmlFileName, jsFileName } = getBuildFileNames(
      srcFilePath,
      buildData.config
    );
    const destJsPath = `${destDirPath}/${jsFileName}`;
    const destHtmlPath = `${destDirPath}/${htmlFileName}`;
    await buildJsFile(destJsPath, srcPagePath);
    await buildHtmlFile(destHtmlPath, destJsPath);
    await sanitizeJsFile(destJsPath);
    if (buildData.isProd) await minifyJsFile(destJsPath);
    return;
  }

  if (srcFilePath.endsWith(".ts")) return;

  const fileData = Bun.file(srcFilePath);
  const fileName = getFileNameFromPath(srcFilePath);
  const filePath = `${destDirPath}/${fileName}`;
  await Bun.write(filePath, fileData);
};

export const buildDir = async (srcDirPath: string): Promise<void> => {
  const destDirPath = getBuildDirPath(
    buildData.appRootPath,
    srcDirPath,
    buildData.config,
    buildData.isProd
  );

  if (await exists(destDirPath)) {
    console.log(`Deleing built dir: ${destDirPath}`);
    await rm(destDirPath, { recursive: true });
  }
  console.log(`Building dir: ${destDirPath}`);
  await createDirIfNotExist(destDirPath);

  for (const file of await readdir(srcDirPath)) {
    if (file.startsWith(buildData.config.brahma.build.ignoreDelimiter))
      continue;

    const filePath = `${srcDirPath}/${file}`;
    const fileStats = await lstat(filePath);
    if (fileStats.isDirectory()) await buildDir(filePath);
    if (fileStats.isFile()) await buildFile(filePath, destDirPath);
  }

  if (!(await readdir(destDirPath)).length) {
    console.log(`Deleting empty built dir: ${destDirPath}`);
    await rm(destDirPath, { recursive: true });
  }
};

export const setupBuild = async (newBuildData: BuildData) => {
  buildData.appRootPath = newBuildData.appRootPath;
  buildData.config = newBuildData.config;
  buildData.isProd = newBuildData.isProd;

  if (!globalThis.document || globalThis.MutationObserver) {
    const { JSDOM } = await import("jsdom");
    const jsdom = new JSDOM("", { url: "https://localhost/" });
    globalThis.window = jsdom.window as unknown as Window & typeof globalThis;
    globalThis.document = jsdom.window.document;
    globalThis.MutationObserver = jsdom.window.MutationObserver;
  }
};

export const buildApp = async (
  appRootPath: string,
  config: KarmaConfig,
  isProd: boolean
): Promise<void> => {
  if (!appRootPath || !config) throw `App root path or config is missing.`;
  await setupBuild({ appRootPath, config, isProd });
  const sourcePath = `${appRootPath}/${config.brahma.build.sourceDirName}`;
  return await buildDir(sourcePath);
};
