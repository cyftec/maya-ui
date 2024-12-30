import type { RegeneratableFilesMap, KarmaConfig } from "./karma-types.ts";

const APP_ROOT_DIRNAME = "dev";

const RG = {
  STAGING_DIRNAME: "stage",
  PUBLISH_DIRNAME: "prod",
  BUN_LOCKB: "bun.lockb",
  GIT_IGNORE: ".gitignore",
  DOT_VSCODE_DIR: ".vscode",
  DOT_ENV_FILE: ".env",
  NODE_MODULES_DIR: "node_modules",
  PACKAGE_JSON_FILE: "package.json",
};

// DO NOT CHANGE exported variable name
export const regeneratables: RegeneratableFilesMap = RG;

// DO NOT CHANGE exported variable name
export const config: KarmaConfig = {
  brahma: {
    build: {
      sourceDirName: APP_ROOT_DIRNAME,
      stagingDirName: RG.STAGING_DIRNAME,
      publishDirName: RG.PUBLISH_DIRNAME,
      srcPageFileName: "page.ts",
      ignoreDelimiter: "@",
    },
    localServer: {
      port: 3000,
      redirectOnStage: false,
      reloadPageOnFocus: true,
    },
  },
  packageJson: {
    dependencies: {
      "@mufw/maya": "0.1.1",
    },
  },
  git: {
    ignore: [
      ".DS_Store",
      RG.DOT_VSCODE_DIR,
      RG.DOT_ENV_FILE,
      RG.NODE_MODULES_DIR,
      RG.PACKAGE_JSON_FILE,
      RG.STAGING_DIRNAME,
      RG.PUBLISH_DIRNAME,
    ],
  },
  vscode: {
    settings: {
      "deno.enable": false,
      "files.exclude": {
        "karma-types.ts": true,
        [RG.BUN_LOCKB]: true,
        [RG.GIT_IGNORE]: true,
        [RG.DOT_VSCODE_DIR]: true,
        [RG.DOT_ENV_FILE]: true,
        [RG.NODE_MODULES_DIR]: true,
        [RG.PACKAGE_JSON_FILE]: true,
        [RG.STAGING_DIRNAME]: false,
        [RG.PUBLISH_DIRNAME]: false,
      },
    },
  },
};
