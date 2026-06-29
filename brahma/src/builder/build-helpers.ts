import { rm } from "node:fs/promises";
import type { Karma } from "../probe/karma-probe/karma-types";
import {
  DEST_HTML_DEFAULT_FILE_NAME,
  DEST_HTML_FILE_EXT,
  DEST_JS_DEFAULT_FILE_NAME,
  DEST_JS_FILE_EXT,
} from "../utils/constants";
import { zipTheFolder } from "../utils/zip-the-folder";

export const isSrcPageFile = (srcPagePath: string, karma: Karma) =>
  srcPagePath.endsWith(karma.brahma.build.buildablePageFileName);

export const getBuiltJsMethodName = (filename: string, karma: Karma) => {
  const words = filename.replace("-", ".").split(".");
  words.pop();
  return (
    words
      .map((w, i) =>
        i === words.length - 1 && w === DEST_JS_DEFAULT_FILE_NAME
          ? karma.brahma.build.buildablePageFileName.slice(0, -3)
          : w,
      )
      .join("_") + "_default"
  );
};

export const getBuildFileNames = (srcPagePath: string, karma: Karma) => {
  const pathWithoutFileName = srcPagePath.split(
    karma.brahma.build.buildablePageFileName,
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
  buildZipFilePath: `${string}.zip`,
) => {
  console.log(`Archiving dir: ${srcDirPath}`);
  await zipTheFolder(srcDirPath, buildZipFilePath);
  console.log(`Archive zip file generated: ${buildZipFilePath}`);
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
