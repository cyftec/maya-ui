import { $ } from "bun";
import { mkdir } from "node:fs/promises";
import type {
  KarmaConfig,
  RegeneratableFilesMap,
} from "../example/karma-type.ts";
import { removeInstalledFiles } from "./uninstall.ts";
import { NO_ARG_PROVIDED } from "../common/constants.ts";

const installDotVsCodeDir = async (
  projectRootDirPath: string,
  karmaConfig: KarmaConfig
) => {
  const dotVsCodePath = `${projectRootDirPath}/.vscode`;
  await mkdir(dotVsCodePath);
  const settingsPath = `${dotVsCodePath}/settings.json`;
  await Bun.write(
    settingsPath,
    JSON.stringify(karmaConfig.vscode.settings, null, "\t")
  );
};

const installGitIgnore = async (
  projectRootDirPath: string,
  karmaConfig: KarmaConfig
) => {
  const gitIgnorePath = `${projectRootDirPath}/.gitignore`;
  const gitIgnoreText = karmaConfig.git.ignore.join("\n");
  await Bun.write(gitIgnorePath, gitIgnoreText);
};

const installPackages = async (
  projectRootDirPath: string,
  karmaConfig: KarmaConfig
) => {
  const packageJsonPath = `${projectRootDirPath}/package.json`;
  await Bun.write(
    packageJsonPath,
    JSON.stringify(karmaConfig.packageJson, null, "\t")
  );
  try {
    await $`bun i`;
  } catch (error) {
    console.log(process.cwd());
    console.log(error);
    process.exit(1);
  }
};

const installAllConfigsAndPackages = async (
  projectRootDirPath: string,
  karmaConfig: KarmaConfig,
  regeneratableFiles: RegeneratableFilesMap
) => {
  console.log(`Removing previously installed files...`);
  await removeInstalledFiles(projectRootDirPath, regeneratableFiles);
  console.log(`\nInstalling latest config and packages...`);
  await installDotVsCodeDir(projectRootDirPath, karmaConfig);
  await installGitIgnore(projectRootDirPath, karmaConfig);
  await installPackages(projectRootDirPath, karmaConfig);
};

const installSpecificPackage = async (bunPackageAlias: string) => {
  if (!bunPackageAlias) throw `Package name is empty.`;
  console.log(`Installing '${bunPackageAlias}' package`);
};

export const installApp = async (
  bunPackageAlias: string,
  projectRootDirPath: string,
  karmaConfig: KarmaConfig,
  regeneratableFiles: RegeneratableFilesMap
) => {
  try {
    if (bunPackageAlias === NO_ARG_PROVIDED) {
      await installAllConfigsAndPackages(
        projectRootDirPath,
        karmaConfig,
        regeneratableFiles
      );
    } else {
      await installSpecificPackage(bunPackageAlias);
    }
  } catch (error) {
    console.log(error);
    process.exit(1);
  }

  process.exit();
};
