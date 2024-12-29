import { buildStaticHtml, runScriptText } from "@mufw/maya/utils";
import { exists, lstat, readdir, rm } from "node:fs/promises";
import { NO_HTML_ERROR, NO_JS_ERROR } from "../common/constants.ts";
import {
  createDirIfNotExist,
  getFileNameFromPath,
  nonCachedImport,
} from "../common/utils.ts";
import type { KarmaConfig } from "../example/karma-types.ts";
import {
  getBuildDirPath,
  getBuildFileNames,
  getBuiltJsMethodName,
  isSrcPageFile,
} from "./build-helpers.ts";

type BuildData = {
  appRootPath: string;
  config: KarmaConfig;
  isProd: boolean;
};

const buildData: BuildData = {} as BuildData;

const buildHtml = async (destHtmlPath: string, srcPagePath: string) => {
  try {
    const { default: page } = await nonCachedImport(srcPagePath);
    const pageHtml = buildStaticHtml(page);
    const html = `<!DOCTYPE html>\n${pageHtml}`;
    if (!html) throw new Error(NO_HTML_ERROR);
    await Bun.write(destHtmlPath, html);
  } catch (error) {
    console.log(error);
    console.log(destHtmlPath);
  }
};

const buildJs = async (destJsPath: string, srcPagePath: string) => {
  const jsBuild = await Bun.build({
    entrypoints: [srcPagePath],
  });
  const js = await jsBuild.outputs.map(async (o) => await o.text())[0];
  if (!js) {
    console.log(jsBuild);
    throw new Error(NO_JS_ERROR);
  }
  const sanitizedJs = `${js.split("export {")[0]}
    \n${runScriptText(
      getBuiltJsMethodName(
        getFileNameFromPath(destJsPath) as string,
        buildData.config
      )
    )}
    \n${
      !buildData.isProd && buildData.config.app.localServer.reloadPageOnFocus
        ? "window.onfocus = () => location.reload();"
        : ""
    }`;

  await Bun.write(destJsPath, sanitizedJs);
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
    await buildHtml(destHtmlPath, srcPagePath);
    await buildJs(destJsPath, srcPagePath);
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
  console.log(`Building dir: ${destDirPath}`);

  if (await exists(destDirPath)) {
    console.log(`Deleing build dir: ${destDirPath}`);
    await rm(destDirPath, { recursive: true });
  }
  await createDirIfNotExist(destDirPath);

  for (const file of await readdir(srcDirPath)) {
    if (file.startsWith(buildData.config.app.ignoreDelimiter)) continue;

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
  const sourcePath = `${appRootPath}/${config.app.sourceDirName}`;
  return await buildDir(sourcePath);
};
