export const APP_NAME = "maya-super-app";
export const APP_SRC_DIRNAME = "app";
export const STAGING_DIRNAME = "stage";
export const PUBLISH_DIRNAME = "public";
const TS_GLOBALS_FILENAME = "global.d.ts";
const LIVE_SERVER_PORT = 5555;

const config = {
  npm: {
    appname: APP_NAME,
    packages: ["@maya/core::file:/home/ck/Desktop/cyfer/packages/maya/core"],
  },
  brahma: {
    srcDir: APP_SRC_DIRNAME,
    stagingDir: STAGING_DIRNAME,
    publishDir: PUBLISH_DIRNAME,
  },
  git: {
    ignore: [
      "node_modules",
      ".brahma",
      ".vscode",
      ".env",
      ".DS_Store",
      `${STAGING_DIRNAME}`,
    ],
  },
  vscode: {
    "editor.formatOnSave": true,
    "editor.formatOnPaste": true,
    "files.exclude": {
      node_modules: true,
      ".vscode": true,
      ".brahma": false,
      ".gitignore": true,
      "tsconfig.json": true,
      [TS_GLOBALS_FILENAME]: true,
      [STAGING_DIRNAME]: false,
      [PUBLISH_DIRNAME]: false,
    },
    "liveServer.settings.root": `/${STAGING_DIRNAME}`,
    "liveServer.settings.port": LIVE_SERVER_PORT,
    "emeraldwalk.runonsave": {
      commands: [
        {
          match: "karma.mjs",
          isAsync: false,
          cmd: "brahma install",
        },
        {
          match: ".*",
          isAsync: false,
          cmd: "brahma stage",
        },
      ],
    },
  },
  tsconfig: {
    compilerOptions: {
      lib: ["ESNext", "DOM"],
      target: "ESNext",
      module: "ESNext",
      moduleDetection: "force",
      allowJs: true,
      moduleResolution: "bundler",
      allowImportingTsExtensions: true,
      verbatimModuleSyntax: true,
      noEmit: true,
      strict: true,
      skipLibCheck: true,
      noFallthroughCasesInSwitch: true,
      noUnusedLocals: true,
      noUnusedParameters: true,
      noPropertyAccessFromIndexSignature: true,
      rootDirs: ["./", `../${APP_SRC_DIRNAME}`],
      baseUrl: "../",
    },
    include: [`../${APP_SRC_DIRNAME}/**/*.ts`, `${TS_GLOBALS_FILENAME}`],
  },
};

export default config;
