export type Karma = {
  config: KarmaConfig;
  regeneratables: RegeneratableFilesMap;
};

export type RegeneratableFilesMap = {
  [f in string]: string;
};

export type KarmaConfig = {
  brahma: {
    build: {
      sourceDirName: string;
      stagingDirName: string;
      publishDirName: string;
      // file or dir name prefixed with below delimiter gets ignored during build
      ignoreDelimiter: string;
      srcPageFileName: `${string}.ts`;
      srcManifestFileName: `${string}.ts`;
    };
    localServer: {
      port: number;
      redirectOnStage: boolean;
      reloadPageOnFocus: boolean;
      serveDirectory: string;
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
