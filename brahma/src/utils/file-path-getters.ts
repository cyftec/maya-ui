import type { Karma } from "../probe-helpers";
import path from "node:path";

export const getAppSrcPath = (appRootPath: string, karma: Karma): string => {
  return `${appRootPath}/${karma.brahma.build.appSrcDir}`;
};

export const getAppViewPath = (appRootPath: string, karma: Karma): string => {
  return `${appRootPath}/${karma.brahma.build.appViewDir}`;
};

const getAssetsDirName = (karma: Karma) => {
  const { assetsDirName } = karma.brahma.build;
  if (
    !assetsDirName ||
    assetsDirName === "." ||
    assetsDirName === ".." ||
    /[\\/]/.test(assetsDirName)
  ) {
    throw new Error(
      "karma.brahma.build.assetsDirName must be a single directory name.",
    );
  }
  return assetsDirName;
};

export const getAppAssetsDirPath = (appRootPath: string, karma: Karma) =>
  path.join(getAppViewPath(appRootPath, karma), getAssetsDirName(karma));

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
  const subPath = path.relative(appViewPath, appSrcPath);
  if (subPath.startsWith("..") || path.isAbsolute(subPath)) {
    throw new Error(`Source path '${appSrcPath}' is outside the app view.`);
  }

  const buildDirPath = path.join(buildDirRootPath, subPath);
  return buildDirPath;
};

export const getBuildAssetsDirPath = (
  appRootPath: string,
  karma: Karma,
  buildProd: boolean,
) => {
  return path.join(
    getBuildDirPath(
      appRootPath,
      getAppViewPath(appRootPath, karma),
      karma,
      buildProd,
    ),
    getAssetsDirName(karma),
  );
};
