import { exists, readdir } from "node:fs/promises";
import type { Karma } from "../karma-probe/karma-types";
import {
  getAppSrcPath,
  getAppViewPath,
  getKarmaPaths,
  getPackageJsonPath,
} from "./file-path-getters";

export const ValidateAndExitIf = {
  karmaFileMissing: async (appRootDirPath: string) => {
    const [karmaFilePath] = getKarmaPaths(appRootDirPath);
    if (!(await exists(karmaFilePath))) {
      console.log(`No karma.ts found in directory - '${appRootDirPath}'`);
      console.log(
        `If this is a valid Maya app directory and karma.ts file is MISSING, run 'brahma init' for initializing new 'karma.ts' file.`,
      );
      process.exit(1);
    }
  },
  exportedKarmaMissing: (karma: Karma) => {
    if (!karma) {
      console.log(
        `Corrupt 'karma.ts' file. No exported 'karma' variable found in 'karma.ts'.`,
      );
      console.log(
        `If this is a valid Maya app directory and karma.ts file is CORRUPTED, run 'brahma init' for initializing new 'karma.ts' file.`,
      );
      process.exit(1);
    }
  },
  appSrcDirMissing: async (appRootDirPath: string, karma: Karma) => {
    const appSrcDirPath = getAppSrcPath(appRootDirPath, karma);
    if (!(await exists(appSrcDirPath))) {
      const files = await readdir(appRootDirPath);
      console.log(
        `ERROR: App source directory '${karma.brahma.build.appSrcDir}' is either missing or have a different name.`,
      );
      console.log(`\nList of files in current directory:`);
      console.log(files);
      process.exit(1);
    }
  },
  appViewDirMissing: async (appRootDirPath: string, karma: Karma) => {
    const appViewDirPath = getAppViewPath(appRootDirPath, karma);
    if (!(await exists(appViewDirPath))) {
      console.log(
        `ERROR: Buildable app view source directory '${karma.brahma.build.appViewDir}' is either missing or have a different path or name.`,
      );
      console.log(`Check 'karma.brahma.build.appViewDir' in 'karma.ts' file.`);
      process.exit(1);
    }
  },
  packageJsonMissing: async (appRootDirPath: string) => {
    const packageJsonPath = getPackageJsonPath(appRootDirPath);
    if (!(await exists(packageJsonPath))) {
      console.log(`ERROR: App not installed. 'package.json' file is missing.`);
      console.log(`Run 'brahma install' command to install app first.`);
      process.exit(1);
    }
  },
};
