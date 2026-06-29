/**
 * DO
 * NOT
 * MOVE
 * THIS
 * FILE
 * ANYWHERE
 * FROM
 * CURRENT
 * SRC
 * DIRECTORY
 *
 * It should always be in path
 * brahma/src/brahma-verison-getter.ts
 *
 */

import { exists } from "node:fs/promises";
import path from "node:path";

export const getBrahmaRootPath = () => path.resolve(__dirname, "../");

export const getBrahmaPackageJsonPath = () =>
  path.resolve(getBrahmaRootPath(), "package.json");

export const getCurrentBrahmaVersion = async () => {
  const brahmaPackageJsonPath = getBrahmaPackageJsonPath();
  const brahmaPackageJsonExist = await exists(brahmaPackageJsonPath);
  if (!brahmaPackageJsonExist) {
    console.error(`'package.json' file is missing in brahma project.`);
    process.exit(1);
  }
  const packageJsonText = await Bun.file(brahmaPackageJsonPath).text();
  const currentBrahmaVersion = packageJsonText
    .split(`"version"`)[1]
    .split(",")[0]
    .trim()
    .slice(1)
    .trim()
    .replaceAll(`"`, "");

  if (!currentBrahmaVersion) {
    console.error(
      `Unable to fetch version from package.json file in brahma project.`,
    );
    process.exit(1);
  }

  return currentBrahmaVersion;
};
