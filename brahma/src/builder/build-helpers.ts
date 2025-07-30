import { rm } from "node:fs/promises";
import type { KarmaConfig } from "../probes/karma/karma-types";
import {
  DEST_HTML_DEFAULT_FILE_NAME,
  DEST_HTML_FILE_EXT,
  DEST_JS_DEFAULT_FILE_NAME,
  DEST_JS_FILE_EXT,
} from "../utils/constants";
import { zipTheFolder } from "../utils/zip-the-folder";

export const isSrcPageFile = (srcPagePath: string, karmaConfig: KarmaConfig) =>
  srcPagePath.endsWith(karmaConfig.brahma.build.buildablePageFileName);

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
          ? karmaConfig.brahma.build.buildablePageFileName.slice(0, -3)
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
  const { brahma } = karmaConfig;
  const { stagingDirName, publishDirName } = brahma.build;
  const mayaSrcPath = `${appRootPath}/${brahma.build.mayaSrcDir}`;
  const buildRootPath = `${appRootPath}/${
    buildProd ? publishDirName : stagingDirName
  }`;
  const subPath = srcDirPath.split(mayaSrcPath)[1];

  const buildDirPath = `${buildRootPath}${subPath}`;
  return buildDirPath;
};

export const getBuildFileNames = (
  srcPagePath: string,
  karmaConfig: KarmaConfig
) => {
  const pathWithoutFileName = srcPagePath.split(
    karmaConfig.brahma.build.buildablePageFileName
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

export const zipAndDeleteDir = async (
  srcDirPath: string,
  destZipFilePath: `${string}.zip`
) => {
  console.log(`Archiving dir: ${srcDirPath}`);
  await zipTheFolder(srcDirPath, destZipFilePath);
  console.log(`Archive zip file generated: ${destZipFilePath}`);
  console.log(`Deleting archived dir: ${srcDirPath}`);
  await rm(srcDirPath, { recursive: true });
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
