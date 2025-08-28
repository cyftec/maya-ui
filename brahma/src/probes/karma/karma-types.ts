export type AppMode = "web" | "ext" | "pwa";
export type KarmaResetMode = "soft" | "hard";

type FileNamesMap = Record<string, string>;
export type ProjectFileNames = {
  buildable: {
    mayaSrcDir: string;
    pageFile: `${string}.ts`;
    manifestFile: `${string}.ts`;
  } & FileNamesMap;
  static: {
    sourceDir: string;
    karmaTypesFile: "karma-types.ts";
  } & FileNamesMap;
  systemGenerated: {
    dsStoreDir: ".DS_Store";
  } & FileNamesMap;
  generated: {
    stagingDir: string;
    publishDir: string;
    bunLockFile: "bun.lock";
    bunLockBFile: "bun.lockb";
    gitIgnoreFile: ".gitignore";
    dotVscodeDir: ".vscode";
    nodeModulesDir: "node_modules";
    packageJsonFile: "package.json";
  } & FileNamesMap;
};

export type Karma = {
  config: KarmaConfig;
  projectFileNames: ProjectFileNames;
};

export type KarmaConfig = {
  brahma: {
    version: string;
    build: {
      mode: AppMode;
      skipErrorAndBuildNext: boolean;
      /**
       * file or dir name prefixed with below delimiter gets ignored during build
       */
      ignoreDelimiter: string;
      sourceDirName: string;
      mayaSrcDir: string;
      buildablePageFileName: string;
      buildableManifestFileName: string;
      stagingDirName: string;
      publishDirName: string;
    };
    serve: {
      port: number;
      redirectOnStart: boolean;
      reloadPageOnFocus: boolean;
      /**
       * Path of app source directory which should be watched for any changes
       */
      watchDir: string;
      /**
       * Path of built html app directory, which should be served by local server
       */
      serveDir: string;
    };
  };
  packageJson: {
    name?: string;
    version?: string;
    description?: string;
    author?: string;
    license?: string;
    type?: "module";
    devDependencies?: {
      [dd in string]: string;
    };
    dependencies: {
      [d in string]: string;
    };
  };
  git: {
    ignore: string[];
  };
  vscode: {
    settings: {
      "deno.enable": boolean;
      "files.exclude": {
        [x in string]: boolean;
      };
    };
  };
};
