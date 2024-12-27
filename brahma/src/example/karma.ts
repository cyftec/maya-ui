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
  app: {
    sourceDirName: APP_ROOT_DIRNAME,
    stagingDirName: RG.STAGING_DIRNAME,
    publishDirName: RG.PUBLISH_DIRNAME,
    srcPageFileName: "page.ts",
    // file or dir name prefixed with below delimiter gets ignores during build
    ignoreDelimiter: "@",
  },
  packageJson: {
    dependencies: {
      maya: "link:maya",
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
        "karma-types.ts": false,
        [RG.BUN_LOCKB]: false,
        [RG.GIT_IGNORE]: false,
        [RG.DOT_VSCODE_DIR]: false,
        [RG.DOT_ENV_FILE]: false,
        [RG.NODE_MODULES_DIR]: false,
        [RG.PACKAGE_JSON_FILE]: false,
        [RG.STAGING_DIRNAME]: false,
        [RG.PUBLISH_DIRNAME]: false,
      },
    },
  },
};
