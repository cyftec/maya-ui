import type { RegeneratableFilesMap, KarmaConfig } from "./karma-type.ts";

const APP_ROOT_DIRNAME = "dev";
const STAGING_DIRNAME = "stage";
const PUBLISH_DIRNAME = "prod";

const RG = {
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
  app: {
    appRootDirName: APP_ROOT_DIRNAME,
    stagingDirName: STAGING_DIRNAME,
    publishDirName: PUBLISH_DIRNAME,
    srcPageFileName: "main.ts",
  },
  packageJson: {
    dependencies: {
      "@maya/core": "link:@maya/core",
    },
  },
  git: {
    ignore: [
      ".DS_Store",
      RG.DOT_VSCODE_DIR,
      RG.DOT_ENV_FILE,
      RG.NODE_MODULES_DIR,
      RG.PACKAGE_JSON_FILE,
      STAGING_DIRNAME,
      PUBLISH_DIRNAME,
    ],
  },
  vscode: {
    settings: {
      "deno.enable": true,
      "files.exclude": {
        "karma-type.ts": false,
        [RG.BUN_LOCKB]: false,
        [RG.GIT_IGNORE]: false,
        [RG.DOT_VSCODE_DIR]: false,
        [RG.DOT_ENV_FILE]: false,
        [RG.NODE_MODULES_DIR]: false,
        [RG.PACKAGE_JSON_FILE]: false,
        [STAGING_DIRNAME]: false,
        [PUBLISH_DIRNAME]: false,
      },
    },
  },
};
