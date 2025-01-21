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
    publishDir: "prod",
    bunLockBFile: "bun.lockb",
    gitIgnoreFile: ".gitignore",
    dotVscodeDir: ".vscode",
    nodeModulesDir: "node_modules",
    packageJsonFile: "package.json",
  },
  buildable: {
    pageFile: "page.ts",
    manifestFile: "manifest.ts",
  },
};

// DO NOT CHANGE exported variable name
export const config: KarmaConfig = {
  brahma: {
    build: {
      stagingDirName: projectFileNames.generated.stagingDir,
      publishDirName: projectFileNames.generated.publishDir,
      buildablePageFileName: projectFileNames.buildable.pageFile,
      buildableManifestFileName: projectFileNames.buildable.manifestFile,
      ignoreDelimiter: "@",
    },
    localServer: {
      port: 3000,
      redirectOnStart: true,
      reloadPageOnFocus: false,
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
        [projectFileNames.generated.publishDir]: false,
        [projectFileNames.generated.bunLockBFile]: true,
        [projectFileNames.generated.gitIgnoreFile]: true,
        [projectFileNames.generated.dotVscodeDir]: true,
        [projectFileNames.generated.nodeModulesDir]: true,
        [projectFileNames.generated.packageJsonFile]: true,
      },
    },
  },
  git: {
    ignore: [
      projectFileNames.systemGenerated.dsStoreDir,
      projectFileNames.static.karmaTypesFile,
      projectFileNames.generated.bunLockBFile,
      projectFileNames.generated.dotVscodeDir,
      projectFileNames.generated.nodeModulesDir,
      projectFileNames.generated.packageJsonFile,
      `/${projectFileNames.generated.stagingDir}`,
      `/${projectFileNames.generated.publishDir}`,
    ],
  },
};
