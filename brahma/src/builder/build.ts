import type { KarmaConfig } from "../example/karma-type.ts";
import {
  DEST_HTML_DEFAULT_FILE_NAME,
  DEST_HTML_FILE_EXT,
  DEST_JS_DEFAULT_FILE_NAME,
  DEST_JS_FILE_EXT,
  NO_HTML_ERROR,
  NO_JS_ERROR,
} from "../common/constants.ts";
import {
  createDirIfNotExist,
  getExportedPageMethodName,
  getFileNameFromPath,
} from "../common/utils.ts";
import { exists, readdir, rm, lstat } from "node:fs/promises";
import { buildStaticHtml, runScriptText } from "@maya/core/utils";

let projectRootPath: string;
let karmaConfig: KarmaConfig;
let buildForProd: boolean = false;
let jsdom: any;

const getAppRootPath = () => {
  if (!projectRootPath || !karmaConfig)
    throw `Project root path or config is not set.`;

  return `${projectRootPath}/${karmaConfig.app.appRootDirName}`;
};

const getBuildRootPath = () => {
  if (!projectRootPath || !karmaConfig)
    throw `Project root path or config is not set.`;

  const { stagingDirName, publishDirName } = karmaConfig.app;
  return `${projectRootPath}/${buildForProd ? publishDirName : stagingDirName}`;
};

const getBuildDirPath = (srcDirPath: string) => {
  const subPath = srcDirPath.split(getAppRootPath())[1];
  return `${getBuildRootPath()}${subPath}`;
};

const isSrcPageFile = (srcPagePath: string) =>
  srcPagePath.endsWith(karmaConfig.app.srcPageFileName);

const getBuildFileNames = (srcPagePath: string) => {
  const pathWithoutFileName = srcPagePath.split(
    karmaConfig.app.srcPageFileName
  )[0];
  const isPrefixed = pathWithoutFileName.endsWith(".");
  const prefixName = isPrefixed
    ? (pathWithoutFileName.split("/").pop() as string)
    : "";
  const htmlFileName =
    (isPrefixed ? prefixName.slice(0, -1) : DEST_HTML_DEFAULT_FILE_NAME) +
    DEST_HTML_FILE_EXT;
  const jsFileName = prefixName + DEST_JS_DEFAULT_FILE_NAME + DEST_JS_FILE_EXT;
  return { htmlFileName, jsFileName };
};

const buildHtml = async (destHtmlPath: string, srcScriptPath: string) => {
  try {
    const { default: page } = await import(srcScriptPath);
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

  await Bun.write(destJsPath, js);
};

const updateJs = async (destJsPath: string) => {
  const jsWithExport = await Bun.file(destJsPath).text();
  const sanitizedJs =
    jsWithExport.split("export {")[0] +
    "\n" +
    runScriptText(
      getExportedPageMethodName(getFileNameFromPath(destJsPath) as string)
    );
  await Bun.write(destJsPath, sanitizedJs);
};

const buildFile = async (parentDirPath: string, fileName: string) => {
  const srcFilePath = `${parentDirPath}/${fileName}`;
  const destDirPath = getBuildDirPath(parentDirPath);
  if (isSrcPageFile(srcFilePath)) {
    const srcPagePath = srcFilePath;
    const { htmlFileName, jsFileName } = getBuildFileNames(srcPagePath);
    const destJsPath = `${destDirPath}/${jsFileName}`;
    const destHtmlPath = `${destDirPath}/${htmlFileName}`;
    await buildJs(destJsPath, srcPagePath);
    await buildHtml(destHtmlPath, destJsPath);
    await updateJs(destJsPath);
    return;
  }

  if (srcFilePath.endsWith(".ts")) return;

  const fileText = await Bun.file(srcFilePath).text();
  const filePath = `${destDirPath}/${fileName}`;
  await Bun.write(filePath, fileText);
};

export const build = async (
  srcDirPath: string,
  projectRootAbsolutePath: string,
  config: KarmaConfig,
  isProd?: boolean
) => {
  if (!jsdom) {
    const { JSDOM } = await import("jsdom");
    jsdom = new JSDOM("", { url: "https://localhost/" });
    globalThis.document = jsdom.window.document;
    globalThis.MutationObserver = jsdom.window.MutationObserver;
  }

  projectRootPath = projectRootAbsolutePath;
  karmaConfig = config;
  buildForProd = !!isProd;

  const destDirPath = getBuildDirPath(srcDirPath);

  if (await exists(destDirPath)) {
    await rm(destDirPath, { recursive: true });
  }

  try {
    await createDirIfNotExist(destDirPath);
  } catch (error) {
    console.log(error);
    console.log(
      `The page directory is corrupted. Delete build directory and rebuild the project.`
    );
    return;
  }

  for (const file of await readdir(srcDirPath)) {
    if (file.startsWith("@")) continue;

    const fileStats = await lstat(`${srcDirPath}/${file}`);
    if (fileStats.isDirectory()) {
      await build(file, projectRootAbsolutePath, config, isProd);
    }
    if (fileStats.isFile()) await buildFile(srcDirPath, file);
  }
};
