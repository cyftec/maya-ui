import type { Karma } from "../probes/karma/karma-types";

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
  return [`${appRootPath}/karma.ts`, `${appRootPath}/karma-types.ts`];
};

export const getBuildDirPath = (
  appRootPath: string,
  appSrcPath: string,
  karma: Karma,
  buildProd: boolean,
) => {
  const { stagingDirName, publishDirName } = karma.brahma.build;
  const buildDirName = buildProd ? publishDirName : stagingDirName;
  const buildDirRootPath = `${appRootPath}/${buildDirName}`;

  const appViewPath = getAppViewPath(appRootPath, karma);
  const subPath = appSrcPath.split(appViewPath)[1];

  const buildDirPath = `${buildDirRootPath}${subPath}`;
  return buildDirPath;
};
