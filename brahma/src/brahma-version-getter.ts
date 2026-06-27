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

export const getCurrentBrahmaVersion = async () => {
  const brahmaPackageJsonPath = path.resolve(__dirname, "../package.json");
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
