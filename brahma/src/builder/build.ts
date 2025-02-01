import { exists, lstat, readdir, rm } from "node:fs/promises";
import {
  DS_STORE_REGEX,
  NO_HTML_ERROR,
  NO_JS_ERROR,
} from "../utils/constants.ts";
import {
  createDirIfNotExist,
  getAppSrcPath,
  getFileNameFromPath,
  nonCachedImport,
} from "../utils/common.ts";
import {
  buildHtmlFnDef,
  getBuildDirPath,
  getBuildFileNames,
  getBuiltJsMethodName,
  isSrcPageFile,
  mountAndRunFnDef,
  zipAndDeleteDir,
} from "./build-helpers.ts";
import type { BunFile } from "bun";
import type { KarmaConfig } from "../probes/karma/karma-types.ts";
import { setupBuild } from "./build-setup.ts";

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
    console.log(
      `\x1b[31m%s\x1b[0m`,
      `ERROR:`,
      `building html '${destHtmlPath}'\n`
    );
    console.log(error);
    console.log(
      "\x1b[33m%s\x1b[0m",
      `If the above error is similar to "Can't find variable: <variable-name>" and the variable is one of the properties of window (or globalThis) object in a Browser environment, then it is occuring because 'build' phase of the app runs in a NODE environment. And in NODE environment, such variable might not be present in Node's 'globalThis' object.
      \nTry using element's 'onmount' event for such logic. The 'onmount' event only runs during 'mount' and 'run' phases of the app, which means, only in a Browser environment.
      \nExample, \n// ERROR: 'Can't find variable: location' \nm.Div({\n  children: location.href,\n}) \n\n// NO ERROR \nmDiv({\n  onmount: (thisEl) => (thisEl.innerText = location.href),\n  children: "",\n})`
    );
    const skipToNextBuild = buildData.config.brahma.build.skipErrorAndBuildNext;
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
  if (DS_STORE_REGEX.test(srcFilePath)) {
    console.log(`Ignoring file: ${srcFilePath}`);
    return;
  }
  console.log(`Building file: ${srcFilePath}`);
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

  const manifestFileName =
    buildData.config.brahma.build.buildableManifestFileName;
  const appSrcPath = getAppSrcPath(buildData.appRootPath, buildData.config);
  let filePath: string;
  let fileData: string | BunFile;
  if (
    srcFilePath.endsWith(manifestFileName) &&
    srcFilePath.slice(0, -(manifestFileName.length + 1)) === appSrcPath
  ) {
    const { default: manifest } = await nonCachedImport(srcFilePath);
    filePath = `${destDirPath}/manifest.json`;
    fileData = JSON.stringify(manifest, null, "\t");
  } else if (srcFilePath.endsWith(".ts")) {
    const fileName = getFileNameFromPath(srcFilePath);
    filePath = `${destDirPath}/${fileName.slice(0, -3)}.js`;
    const jsBuild = await Bun.build({ entrypoints: [srcFilePath] });
    fileData = await jsBuild.outputs.map(async (o) => await o.text())[0];
  } else {
    const fileName = getFileNameFromPath(srcFilePath);
    filePath = `${destDirPath}/${fileName}`;
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
  srcDirPath: string,
  isRootDir: boolean = false
): Promise<void> => {
  const destDirPath = getBuildDirPath(
    buildData.appRootPath,
    srcDirPath,
    buildData.config,
    buildData.isProd
  );

  if (await exists(destDirPath)) {
    console.log(`Deleting existing dir: ${destDirPath}`);
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

  if (isRootDir && buildData.isProd && buildData.config.maya?.mode === "ext") {
    await zipAndDeleteDir(destDirPath, `${destDirPath}.zip`);
  }
};

export const buildApp = async (
  appRootPath: string,
  config: KarmaConfig,
  isProd: boolean
): Promise<void> => {
  if (!appRootPath || !config) throw `App root path or config is missing.`;
  buildData.appRootPath = appRootPath;
  buildData.config = config;
  buildData.isProd = isProd;
  await setupBuild();
  const sourcePath = getAppSrcPath(appRootPath, config);
  return await buildDir(sourcePath, true);
};
