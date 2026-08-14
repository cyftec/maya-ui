import {
  DS_STORE_REGEX,
  NO_HTML_ERROR,
  NO_JS_ERROR,
} from "../utils/constants.ts";
import {
  createDirIfNotExist,
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
import type { Karma } from "../probe-helpers/index.ts";
import { setupBuild } from "./build-setup.ts";
import {
  getAppViewPath,
  getBuildAssetsDirPath,
  getBuildDirPath,
} from "../utils/file-path-getters.ts";
import {
  createDirRecursively,
  fileOrDirExists,
  getPathStats,
  readDir,
  removeFileOrDir,
} from "../utils/node-methods.ts";
import path from "node:path";

type BuildData = {
  appRootPath: string;
  karma: Karma;
  isProd: boolean;
  deferredStylesheets: DeferredStylesheet[];
  runtime: BuildRuntime;
};

export type BuildRuntime = {
  build: typeof Bun.build;
  file: typeof Bun.file;
  write: typeof Bun.write;
};

const defaultBuildRuntime: BuildRuntime = {
  build: Bun.build,
  file: Bun.file,
  write: Bun.write,
};

type DeferredStylesheet = { sourcePath: string };

type NoCssStylesheetConfig = {
  overriddenBaseClasses?: Record<string, Record<string, string>>;
  overriddenMediaConstraints?: Record<string, Record<string, string>>;
  compoundClasses?: Record<string, string>;
};

type NoCssCompiler = {
  buildNoCssStylesheet: (
    usedClassNames: Iterable<string>,
    config: NoCssStylesheetConfig,
  ) => string;
  getUsedNoCssClassNames: () => Set<string>;
  resetNoCssBuildRegistry: () => void;
};

const noCssCompilerModule = "@cyftec/maya/nocss/compiler";
const getNoCssCompiler = async () =>
  (await import(noCssCompilerModule)) as NoCssCompiler;

const buildData: BuildData = {} as BuildData;

const buildHtmlFile = async (destHtmlPath: string, destJsPath: string) => {
  try {
    const buildJs = await buildData.runtime.file(destJsPath).text();
    const buildJsWithoutExports = buildJs.split("export {")[0];
    const appMethodName = getBuiltJsMethodName(
      getFileNameFromPath(destJsPath),
      buildData.karma,
    );
    const AsyncFunction = Object.getPrototypeOf(buildHtmlFile)
      .constructor as new (body: string) => () => Promise<string | undefined>;
    const buildPageHtml = new AsyncFunction(`
      ${buildJsWithoutExports}
      phase.start("build");
      idGen.resetIdCounter();
      const htmlPageNode = ${appMethodName}();
      return htmlPageNode?.outerHTML;
    `);
    const pageHtml = await buildPageHtml();
    if (!pageHtml) throw new Error(NO_HTML_ERROR);
    const html = `<!DOCTYPE html>\n${pageHtml}`;
    await buildData.runtime.write(destHtmlPath, html);
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

const buildCssFile = async (srcPath: string): Promise<string> => {
  const config = (await nonCachedImport(srcPath)) as NoCssStylesheetConfig;
  const compiler = await getNoCssCompiler();
  return compiler.buildNoCssStylesheet(
    compiler.getUsedNoCssClassNames(),
    config,
  );
};

const buildSourceTsFile = async (srcPath: string): Promise<Bun.BuildOutput> => {
  const tsConfigFilePath = `${buildData.appRootPath}/tsconfig.json`;
  const tsconfigExists = await buildData.runtime.file(tsConfigFilePath).exists();
  const jsBuild = await buildData.runtime.build({
    entrypoints: [srcPath],
    tsconfig: tsconfigExists ? tsConfigFilePath : undefined,
  });

  return jsBuild;
};

const buildJsFile = async (destJsPath: string, srcPagePath: string) => {
  const jsBuild = await buildSourceTsFile(srcPagePath);
  const js = await jsBuild.outputs.map(async (o) => await o.text())[0];
  if (!js) {
    console.log(jsBuild);
    throw new Error(NO_JS_ERROR);
  }
  const sanitizedJs = `
    ${js}
    ${buildHtmlFnDef}
  `;

  await buildData.runtime.write(destJsPath, sanitizedJs);
};

const sanitizeJsFile = async (destJsPath: string) => {
  const jsWithExports = await buildData.runtime.file(destJsPath).text();
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

  await buildData.runtime.write(destJsPath, sanitizedJs);
};

const minifyJsFile = async (destJsPath: string) => {
  const jsBuild = await buildData.runtime.build({
    entrypoints: [destJsPath], // already built (unminified) js file
    minify: true,
  });
  const minifiedJsCode = await jsBuild.outputs.map(
    async (o) => await o.text(),
  )[0];
  if (!minifiedJsCode) {
    throw new Error(NO_JS_ERROR);
  }
  await buildData.runtime.write(destJsPath, minifiedJsCode);
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

  const stylesheetFileName =
    buildData.karma.brahma.build.buildableStylesheetFileName;
  const manifestFileName =
    buildData.karma.brahma.build.buildableManifestFileName;
  const appSrcPath = getAppViewPath(buildData.appRootPath, buildData.karma);
  let filePath: string;
  let fileData: string | BunFile;

  if (getFileNameFromPath(srcFilePath) === stylesheetFileName) {
    buildData.deferredStylesheets.push({ sourcePath: srcFilePath });
    return;
  } else if (
    srcFilePath.endsWith(manifestFileName) &&
    srcFilePath.slice(0, -(manifestFileName.length + 1)) === appSrcPath
  ) {
    const { default: manifest } = await nonCachedImport(srcFilePath);
    filePath = `${buildDirPath}/manifest.json`;
    fileData = JSON.stringify(manifest, null, "\t");
  } else if (srcFilePath.endsWith(".ts")) {
    const fileName = getFileNameFromPath(srcFilePath);
    filePath = `${buildDirPath}/${fileName.slice(0, -3)}.js`;
    const jsBuild = await buildSourceTsFile(srcFilePath);
    const output = jsBuild.outputs[0];
    if (!output) throw new Error(NO_JS_ERROR);
    fileData = await output.text();
  } else {
    const fileName = getFileNameFromPath(srcFilePath);
    filePath = `${buildDirPath}/${fileName}`;
    fileData = buildData.runtime.file(srcFilePath);
  }

  try {
    await buildData.runtime.write(filePath, fileData);
  } catch (error) {
    console.log(filePath);
    console.log(fileData);
    throw error;
  }
};

export const buildDir = async (dirPath: string): Promise<void> => {
  const buildDirPath = getBuildDirPath(
    buildData.appRootPath,
    dirPath,
    buildData.karma,
    buildData.isProd,
  );

  if (await fileOrDirExists(buildDirPath)) {
    console.log(`Deleting existing dir: ${buildDirPath}`);
    await removeFileOrDir(buildDirPath);
  }
  console.log(`Building dir: ${buildDirPath}`);
  await createDirIfNotExist(buildDirPath);

  for (const file of await readDir(dirPath)) {
    if (file.startsWith(buildData.karma.brahma.build.ignoreDelimiter)) continue;

    const filePath = `${dirPath}/${file}`;
    const fileStats = await getPathStats(filePath);
    if (fileStats.isDirectory()) await buildDir(filePath);
    if (fileStats.isFile()) await buildFile(filePath, buildDirPath);
  }

  if (!(await readDir(buildDirPath)).length) {
    console.log(`Deleting empty built dir: ${buildDirPath}`);
    await removeFileOrDir(buildDirPath);
  }
};

const buildDeferredStylesheets = async () => {
  const stylesheets = buildData.deferredStylesheets;
  if (stylesheets.length > 1) {
    throw new Error(
      `Only one '${buildData.karma.brahma.build.buildableStylesheetFileName}' nocss configuration file is supported per app.`,
    );
  }

  const assetsDirPath = getBuildAssetsDirPath(
    buildData.appRootPath,
    buildData.karma,
    buildData.isProd,
  );
  await createDirRecursively(assetsDirPath);
  const stylesheetFileName =
    buildData.karma.brahma.build.buildableStylesheetFileName;
  const outputPath = path.join(
    assetsDirPath,
    `${stylesheetFileName.slice(0, -3)}.css`,
  );

  for (const stylesheet of stylesheets) {
    const css = await buildCssFile(stylesheet.sourcePath);
    await buildData.runtime.write(outputPath, css);
    const cssBuild = await buildData.runtime.build({
      entrypoints: [outputPath],
      minify: true,
    });
    const minifiedCss = await cssBuild.outputs[0]?.text();
    if (minifiedCss === undefined) {
      throw new Error(`Unable to minify CSS '${outputPath}'.`);
    }
    await buildData.runtime.write(outputPath, minifiedCss);
  }
};

export const buildApp = async (
  appRootPath: string,
  karma: Karma,
  isProd: boolean,
  runtime: BuildRuntime = defaultBuildRuntime,
): Promise<void> => {
  buildData.appRootPath = appRootPath;
  buildData.karma = karma;
  buildData.isProd = isProd;
  buildData.deferredStylesheets = [];
  buildData.runtime = runtime;
  await setupBuild();
  (await getNoCssCompiler()).resetNoCssBuildRegistry();
  const appViewPath = getAppViewPath(appRootPath, karma);
  await buildDir(appViewPath);
  await buildDeferredStylesheets();
  if (isProd && karma.maya.appType === "ext") {
    const buildDirPath = getBuildDirPath(appRootPath, appViewPath, karma, true);
    await zipAndDeleteDir(buildDirPath, `${buildDirPath}.zip`);
  }
};
