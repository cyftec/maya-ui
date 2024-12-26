export type RegeneratableFilesMap = {
  [f in string]: string;
};

export type KarmaConfig = {
  app: {
    appRootDirName: string;
    stagingDirName: string;
    publishDirName: string;
    srcPageFileName: `${string}.ts`;
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
