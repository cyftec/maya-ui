export type AppMode = "web" | "ext" | "pwa";
export type KarmaResetMode = "soft" | "hard";

type FileNamesMap = { [f in string]: string };
export type ProjectFileNames = {
  systemGenerated: FileNamesMap;
  static: FileNamesMap;
  generated: FileNamesMap;
  built: FileNamesMap;
};

export type Karma = {
  config: KarmaConfig;
  projectFileNames: ProjectFileNames;
};

export type KarmaConfig = {
  brahma: {
    build: {
      stagingDirName: string;
      publishDirName: string;
      // file or dir name prefixed with below delimiter gets ignored during build
      ignoreDelimiter: string;
      buildablePageFileName: string;
      buildableManifestFileName: string;
      skipErrorAndBuildNext: boolean;
    };
    localServer: {
      port: number;
      redirectOnStart: boolean;
      reloadPageOnFocus: boolean;
      // Serving directory path excluding parent directory path
      serveDirectory: string;
      // Directories other than source directory, on which change should trigger rebuild
      otherWatchDirs: string[];
    };
  };
  maya: {
    mode: AppMode;
    sourceDirName: string;
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
