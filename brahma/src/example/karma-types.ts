export type Karma = {
  config: KarmaConfig;
  regeneratables: RegeneratableFilesMap;
};

export type RegeneratableFilesMap = {
  [f in string]: string;
};

export type KarmaConfig = {
  app: {
    ignoreDelimiter: string;
    sourceDirName: string;
    stagingDirName: string;
    publishDirName: string;
    srcPageFileName: `${string}.ts`;
    localServer: {
      port: number;
      redirectOnStage: boolean;
      reloadPageOnFocus: boolean;
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
