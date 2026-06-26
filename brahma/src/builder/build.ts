import { exists, lstat, readdir, rm } from "node:fs/promises";
import {
  DS_STORE_REGEX,
  NO_HTML_ERROR,
  NO_JS_ERROR,
} from "../utils/constants.ts";
import {
  createDirIfNotExist,
  getAppViewPath,
  getBuildDirPath,
  getFileNameFromPath,
  nonCachedImport,
} from "../utils/common.ts";
import {
  buildHtmlFnDef,
  getBuildFileNames,
  getBuiltJsMethodName,
  isSrcPageFile,
  mountAndRunFnDef,
  zipAndDeleteDir,
} from "./build-helpers.ts";
import type { BunFile } from "bun";
import type { Karma } from "../probes/karma/karma-types.ts";
import { setupBuild } from "./build-setup.ts";

type BuildData = {
  appRootPath: string;
  karma: Karma;
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
    console.log(
      `\x1b[31m%s\x1b[0m`,
      `ERROR:`,
      `building html '${destHtmlPath}'\n`,
    );
    console.log(error);
    console.log(
      "\x1b[33m%s\x1b[0m",
      `If the above error is similar to "Can't find variable: <variable-name>" and the variable is one of the properties of window (or globalThis) object in a Browser environment, then it is occuring because 'build' phase of the app runs in a NODE environment. And in NODE environment, such variable might not be present in Node's 'globalThis' object.
      \nTry using element's 'onmount' event for such logic. The 'onmount' event only runs during 'mount' and 'run' phases of the app, which means, only in a Browser environment.
      \nExample, \n// ERROR: 'Can't find variable: location' \nm.Div({\n  children: location.href,\n}) \n\n// NO ERROR \nmDiv({\n  onmount: (thisEl) => (thisEl.innerText = location.href),\n  children: "",\n})`,
    );
    const skipToNextBuild = buildData.karma.brahma.build.skipErrorAndBuildNext;
    if (!skipToNextBuild) process.exit(1);
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
        buildData.karma,
      ),
    )}
    \n${
      !buildData.isProd && buildData.karma.brahma.serve.reloadPageOnFocus
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
    async (o) => await o.text(),
  )[0];
  if (!minifiedJsCode) {
    throw new Error(NO_JS_ERROR);
  }
  await Bun.write(destJsPath, minifiedJsCode);
};

const buildFile = async (srcFilePath: string, buildDirPath: string) => {
  if (DS_STORE_REGEX.test(srcFilePath)) {
    console.log(`Ignoring file: ${srcFilePath}`);
    return;
  }
  console.log(`Building file: ${srcFilePath}`);
  if (isSrcPageFile(srcFilePath, buildData.karma)) {
    const srcPagePath = srcFilePath;
    const { htmlFileName, jsFileName } = getBuildFileNames(
      srcFilePath,
      buildData.karma,
    );
    const destJsPath = `${buildDirPath}/${jsFileName}`;
    const destHtmlPath = `${buildDirPath}/${htmlFileName}`;
    await buildJsFile(destJsPath, srcPagePath);
    await buildHtmlFile(destHtmlPath, destJsPath);
    await sanitizeJsFile(destJsPath);
    if (buildData.isProd) await minifyJsFile(destJsPath);
    return;
  }

  const manifestFileName =
    buildData.karma.brahma.build.buildableManifestFileName;
  const appSrcPath = getAppViewPath(buildData.appRootPath, buildData.karma);
  let filePath: string;
  let fileData: string | BunFile;
  if (
    srcFilePath.endsWith(manifestFileName) &&
    srcFilePath.slice(0, -(manifestFileName.length + 1)) === appSrcPath
  ) {
    const { default: manifest } = await nonCachedImport(srcFilePath);
    filePath = `${buildDirPath}/manifest.json`;
    fileData = JSON.stringify(manifest, null, "\t");
  } else if (srcFilePath.endsWith(".ts")) {
    const fileName = getFileNameFromPath(srcFilePath);
    filePath = `${buildDirPath}/${fileName.slice(0, -3)}.js`;
    const jsBuild = await Bun.build({ entrypoints: [srcFilePath] });
    fileData = await jsBuild.outputs.map(async (o) => await o.text())[0];
  } else {
    const fileName = getFileNameFromPath(srcFilePath);
    filePath = `${buildDirPath}/${fileName}`;
    fileData = Bun.file(srcFilePath);
  }

  try {
    await Bun.write(filePath, fileData);
  } catch (error) {
    console.log(filePath);
    console.log(fileData);
    throw error;
  }
};

export const buildDir = async (
  dirPath: string,
  isAppViewDir: boolean = false,
): Promise<void> => {
  const buildDirPath = getBuildDirPath(
    buildData.appRootPath,
    dirPath,
    buildData.karma,
    buildData.isProd,
  );

  if (await exists(buildDirPath)) {
    console.log(`Deleting existing dir: ${buildDirPath}`);
    await rm(buildDirPath, { recursive: true });
  }
  console.log(`Building dir: ${buildDirPath}`);
  await createDirIfNotExist(buildDirPath);

  for (const file of await readdir(dirPath)) {
    if (file.startsWith(buildData.karma.brahma.build.ignoreDelimiter)) continue;

    const filePath = `${dirPath}/${file}`;
    const fileStats = await lstat(filePath);
    if (fileStats.isDirectory()) await buildDir(filePath);
    if (fileStats.isFile()) await buildFile(filePath, buildDirPath);
  }

  if (!(await readdir(buildDirPath)).length) {
    console.log(`Deleting empty built dir: ${buildDirPath}`);
    await rm(buildDirPath, { recursive: true });
  }

  if (
    isAppViewDir &&
    buildData.isProd &&
    buildData.karma.maya.appType === "ext"
  ) {
    await zipAndDeleteDir(buildDirPath, `${buildDirPath}.zip`);
  }
};

export const buildApp = async (
  appRootPath: string,
  karma: Karma,
  isProd: boolean,
): Promise<void> => {
  buildData.appRootPath = appRootPath;
  buildData.karma = karma;
  buildData.isProd = isProd;
  await setupBuild();
  const appViewPath = getAppViewPath(appRootPath, karma);
  return await buildDir(appViewPath, true);
};
