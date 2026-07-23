import type { Karma } from "../probe/karma-probe/types";
import path from "node:path";

export const getAppSrcPath = (appRootPath: string, karma: Karma): string => {
  return `${appRootPath}/${karma.brahma.build.appSrcDir}`;
};

export const getAppViewPath = (appRootPath: string, karma: Karma): string => {
  return `${appRootPath}/${karma.brahma.build.appViewDir}`;
};

export const getPackageJsonPath = (appRootPath: string): string => {
  return `${appRootPath}/package.json`;
};

export const getKarmaPaths = (appRootPath: string): [string, string] => {
  return [`${appRootPath}/_karma/karma.ts`, `${appRootPath}/_karma/types.ts`];
};

export const getBuildDirPath = (
  appRootPath: string,
  appSrcPath: string,
  karma: Karma,
  buildProd: boolean,
) => {
  const { stagingDir, publishDir } = karma.brahma.build;
  const buildDirNameOrPath = buildProd ? publishDir : stagingDir;
  const buildDirRootPath = path.join(appRootPath, buildDirNameOrPath);

  const appViewPath = getAppViewPath(appRootPath, karma);
  const subPath = appSrcPath.split(appViewPath)[1];

  const buildDirPath = path.join(buildDirRootPath, subPath);
  return buildDirPath;
};
