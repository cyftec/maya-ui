import { buildStaticHtml } from "@maya/core";
import bun from "bun";
import { exists, lstat, readdir, rmdir } from "fs/promises";

let buildSrcDir: string;
let buildDestDir: string;

const SRC_FILENAME = "main.ts";
const DEST_HTML_DEFAULT_FILENAME = "index";
const DEST_JS_DEFAULT_FILENAME = "main";
const DEST_HTML_FILE_EXT = ".html";
const DEST_JS_FILE_EXT = ".js";

const NO_HTML_ERROR = "no html";
const NO_JS_ERROR = "no js";

const runScriptText = `
var runScript = (page) => {
  mountUnmountObserver.observe(document.body, {
    childList: true,
    subtree: true
  });
  setTimeout(() => {
    if (window)
      window.isDomAccessPhase = true;
    idGen.resetIdCounter();
    page();
    idGen.resetIdCounter();
    if (window)
      window.isDomAccessPhase = false;
  });
};
runScript(page);`;

export const getJoinedPath = (rootDir: string, relativePath: string) =>
  `${rootDir}/${relativePath}`.replace("//", "/");

const isMainFile = (fileName: string) => fileName.split(SRC_FILENAME)[1] === "";

const getDestFileNames = (fileName: string) => {
  if (!isMainFile(fileName)) throw new Error(`Not main file: ${fileName}`);

  const name = fileName.split(SRC_FILENAME)[0];
  const isPrefixed = name.endsWith(".");
  const destHtmlFileName =
    (isPrefixed ? name.slice(0, -1) : DEST_HTML_DEFAULT_FILENAME) +
    DEST_HTML_FILE_EXT;
  const destJsFileName =
    (isPrefixed ? name : "") + DEST_JS_DEFAULT_FILENAME + DEST_JS_FILE_EXT;
  return { destHtmlFileName, destJsFileName };
};

const getFileAndDirNames = async (
  currentRelativePath: string
): Promise<{ fileNames: string[]; dirNames: string[] }> => {
  const currentFullPath = getJoinedPath(buildSrcDir, currentRelativePath);
  const childFilesOrDirs = await readdir(currentFullPath);
  const fileNames: string[] = [];
  const dirNames: string[] = [];

  for await (const childFileOrDir of childFilesOrDirs) {
    if (childFileOrDir.charAt(0) === "@") continue;

    const childFullPath = getJoinedPath(currentFullPath, childFileOrDir);
    const childFileIsDir = (await lstat(childFullPath)).isDirectory();

    if (childFileIsDir) dirNames.push(childFileOrDir);
    else fileNames.push(childFileOrDir);
  }

  return { fileNames, dirNames };
};

const buildHtml = async (srcHtmlPath: string, destHtmlPath: string) => {
  const { page } = await import(srcHtmlPath);
  const pageHtml = buildStaticHtml(page);
  const html = `<!DOCTYPE html>\n${pageHtml}`;
  if (!html) throw new Error(NO_HTML_ERROR);

  await bun.write(destHtmlPath, html);
};

const buildJs = async (srcJsPath: string, destJsPath: string) => {
  const jsBuild = await bun.build({
    entrypoints: [srcJsPath],
  });
  const js = await jsBuild.outputs.map(async (o) => await o.text())[0];
  if (!js) {
    console.log(jsBuild);
    throw new Error(NO_JS_ERROR);
  }
  const jsScript = js.split("export {")[0] + "\n" + runScriptText;

  await bun.write(destJsPath, jsScript);
};

const buildFiles = async (relativePath: string, fileNames: string[]) => {
  const srcDirPath = getJoinedPath(buildSrcDir, relativePath);
  const destDirPath = getJoinedPath(buildDestDir, relativePath);

  const fileExtRegex = /(?:\.([^.]+))?$/;
  for await (const fileName of fileNames) {
    if (isMainFile(fileName)) {
      const { destHtmlFileName, destJsFileName } = getDestFileNames(fileName);
      // if (relativePath === "/living-room")
      //   throw JSON.stringify(destHtmlFileName);
      const srcPath = getJoinedPath(srcDirPath, fileName);
      const destHtmlPath = getJoinedPath(destDirPath, destHtmlFileName);
      const destJsPath = getJoinedPath(destDirPath, destJsFileName);
      await buildHtml(srcPath, destHtmlPath);
      await buildJs(srcPath, destJsPath);
      continue;
    }

    const fileExtension = fileExtRegex.exec(fileName)?.[1];
    if (fileExtension === "ts") continue;

    const srcFilePath = getJoinedPath(srcDirPath, fileName);
    const destFilePath = getJoinedPath(destDirPath, fileName);

    const srcFile = bun.file(srcFilePath);
    await bun.write(destFilePath, srcFile);
  }
};

const buildDir = async (currentRelativePath: string) => {
  const { fileNames, dirNames } = await getFileAndDirNames(currentRelativePath);

  await buildFiles(currentRelativePath, fileNames);

  for await (const dirName of dirNames) {
    const childDirRelativePath = getJoinedPath(currentRelativePath, dirName);
    // throw JSON.stringify(childDirRelativePath);
    buildDir(childDirRelativePath);
  }
};

export const buildApp = async (
  buildSrcDirectory: string,
  buildDestDirectory: string
) => {
  buildSrcDir = buildSrcDirectory;
  buildDestDir = buildDestDirectory;
  const destExists = await exists(buildDestDir);
  if (destExists) {
    await rmdir(buildDestDir, { recursive: true });
    const stillExists = await exists(buildDestDir);
    if (stillExists) throw new Error(`Failed to remove ${buildDestDir}`);
  }
  await buildDir("");
};
