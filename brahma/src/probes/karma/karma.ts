import type { KarmaConfig, ProjectFileNames } from "./karma-types.ts";

// DO NOT CHANGE exported variable name
export const projectFileNames: ProjectFileNames = {
  systemGenerated: {
    dsStoreDir: ".DS_Store",
  },
  static: {
    sourceDir: "dev",
    karmaTypesFile: "karma-types.ts",
  },
  generated: {
    stagingDir: "stage",
    bunLockFile: "bun.lock",
    bunLockBFile: "bun.lockb",
    gitIgnoreFile: ".gitignore",
    dotVscodeDir: ".vscode",
    nodeModulesDir: "node_modules",
    packageJsonFile: "package.json",
  },
  built: {
    publishDir: "prod",
    pageFile: "page.ts",
    manifestFile: "manifest.ts",
  },
};

// DO NOT CHANGE exported variable name
export const config: KarmaConfig = {
  brahma: {
    build: {
      stagingDirName: projectFileNames.generated.stagingDir,
      publishDirName: projectFileNames.built.publishDir,
      buildablePageFileName: projectFileNames.built.pageFile,
      buildableManifestFileName: projectFileNames.built.manifestFile,
      ignoreDelimiter: "@",
      skipErrorAndBuildNext: false,
    },
    localServer: {
      port: 3000,
      redirectOnStart: true,
      reloadPageOnFocus: false,
      otherWatchDirs: [],
      serveDirectory: `${projectFileNames.generated.stagingDir}`,
    },
  },
  maya: {
    mode: "web",
    sourceDirName: projectFileNames.static.sourceDir,
    packageJson: {
      dependencies: {},
    },
  },
  vscode: {
    settings: {
      "deno.enable": false,
      "files.exclude": {
        [projectFileNames.static.karmaTypesFile]: true,
        [projectFileNames.generated.stagingDir]: false,
        [projectFileNames.generated.bunLockFile]: true,
        [projectFileNames.generated.bunLockBFile]: true,
        [projectFileNames.generated.gitIgnoreFile]: true,
        [projectFileNames.generated.dotVscodeDir]: true,
        [projectFileNames.generated.nodeModulesDir]: true,
        [projectFileNames.generated.packageJsonFile]: true,
        [projectFileNames.built.publishDir]: false,
      },
    },
  },
  git: {
    ignore: [
      projectFileNames.systemGenerated.dsStoreDir,
      projectFileNames.static.karmaTypesFile,
      projectFileNames.generated.bunLockFile,
      projectFileNames.generated.bunLockBFile,
      projectFileNames.generated.dotVscodeDir,
      projectFileNames.generated.nodeModulesDir,
      projectFileNames.generated.packageJsonFile,
      `/${projectFileNames.generated.stagingDir}`,
    ],
  },
};
