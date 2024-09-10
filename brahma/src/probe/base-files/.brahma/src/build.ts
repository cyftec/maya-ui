import { generateStaticHtml } from "@ckzero/maya/web";
import bun from "bun";
import { exists, lstat, readdir, rmdir } from "fs/promises";

let buildSrcDir: string;
let buildDestDir: string;

const SRC_HTML_FILENAME = "page.ts";
const SRC_JS_FILENAME = "main.ts";
const DEST_HTML_FILENAME = "index.html";
const DEST_JS_FILENAME = "main.js";

const NO_HTML_ERROR = "no html";
const NO_JS_ERROR = "no js";

export const getJoinedPath = (rootDir: string, relativePath: string) =>
  `${rootDir}/${relativePath}`.replace("//", "/");

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
  const pageHtml = generateStaticHtml(page);
  const html = `<!DOCTYPE html>\n${pageHtml}`;
  if (!html) throw new Error(NO_HTML_ERROR);

  await bun.write(destHtmlPath, html);
};

const buildJs = async (
  srcJsPath: string,
  destJsPath: string,
  destDirPath: string
) => {
  const jsBuild = await bun.build({
    entrypoints: [srcJsPath],
    outdir: destDirPath,
    splitting: true,
  });
  const js = await jsBuild.outputs.map(async (o) => await o.text())[0];
  if (!js) {
    console.log(jsBuild);
    throw new Error(NO_JS_ERROR);
  }

  await bun.write(destJsPath, js);
};

const buildFiles = async (relativePath: string, fileNames: string[]) => {
  const srcDirPath = getJoinedPath(buildSrcDir, relativePath);
  const destDirPath = getJoinedPath(buildDestDir, relativePath);

  const fileExtRegex = /(?:\.([^.]+))?$/;
  for await (const fileName of fileNames) {
    if (fileName === SRC_HTML_FILENAME) {
      const srcHtmlPath = getJoinedPath(srcDirPath, SRC_HTML_FILENAME);
      const destHtmlPath = getJoinedPath(destDirPath, DEST_HTML_FILENAME);
      await buildHtml(srcHtmlPath, destHtmlPath);
      continue;
    }

    if (fileName === SRC_JS_FILENAME) {
      const srcJsPath = getJoinedPath(srcDirPath, SRC_JS_FILENAME);
      const destJsPath = getJoinedPath(destDirPath, DEST_JS_FILENAME);
      await buildJs(srcJsPath, destJsPath, destDirPath);
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
