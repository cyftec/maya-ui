import {
  DEST_HTML_DEFAULT_FILE_NAME,
  DEST_HTML_FILE_EXT,
  DEST_JS_DEFAULT_FILE_NAME,
  DEST_JS_FILE_EXT,
} from "../common/constants";
import type { KarmaConfig } from "../sample-app/karma-types";

export const isSrcPageFile = (srcPagePath: string, karmaConfig: KarmaConfig) =>
  srcPagePath.endsWith(karmaConfig.brahma.build.srcPageFileName);

export const getBuiltJsMethodName = (
  filename: string,
  karmaConfig: KarmaConfig
) => {
  const words = filename.replace("-", ".").split(".");
  words.pop();
  return (
    words
      .map((w, i) =>
        i === words.length - 1 && w === DEST_JS_DEFAULT_FILE_NAME
          ? karmaConfig.brahma.build.srcPageFileName.slice(0, -3)
          : w
      )
      .join("_") + "_default"
  );
};

export const getBuildDirPath = (
  appRootPath: string,
  srcDirPath: string,
  karmaConfig: KarmaConfig,
  buildProd: boolean
) => {
  const { sourceDirName, stagingDirName, publishDirName } =
    karmaConfig.brahma.build;
  const srcRootPath = `${appRootPath}/${sourceDirName}`;
  const buildRootPath = `${appRootPath}/${
    buildProd ? publishDirName : stagingDirName
  }`;
  const subPath = srcDirPath.split(srcRootPath)[1];

  const buildDirPath = `${buildRootPath}${subPath}`;
  return buildDirPath;
};

export const getBuildFileNames = (
  srcPagePath: string,
  karmaConfig: KarmaConfig
) => {
  const pathWithoutFileName = srcPagePath.split(
    karmaConfig.brahma.build.srcPageFileName
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

export const buildHtmlFnDef = `
export const buildPageHtml = (page) => {
  phase.start("build"); 
  idGen.resetIdCounter();
  const htmlPageNode = page();
  return htmlPageNode?.outerHTML;
}`;

export const mountAndRunFnDef = (appMethodName: string) => `
const mountAndRun = () => {
    phase.start("mount");
    idGen.resetIdCounter();
    ${appMethodName}();
    phase.start("run")
};

mountAndRun();`;
