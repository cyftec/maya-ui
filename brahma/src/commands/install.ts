import { $ } from "bun";
import { mkdir } from "node:fs/promises";
import type {
  KarmaConfig,
  RegeneratableFilesMap,
} from "../example/karma-types.ts";
import { removeInstalledFiles } from "./uninstall.ts";
import { NO_ARG_PROVIDED } from "../common/constants.ts";

const installDotVsCodeDir = async (
  appRootPath: string,
  karmaConfig: KarmaConfig
) => {
  const dotVsCodePath = `${appRootPath}/.vscode`;
  await mkdir(dotVsCodePath);
  const settingsPath = `${dotVsCodePath}/settings.json`;
  await Bun.write(
    settingsPath,
    JSON.stringify(karmaConfig.vscode.settings, null, "\t")
  );
};

const installGitIgnore = async (
  appRootPath: string,
  karmaConfig: KarmaConfig
) => {
  const gitIgnorePath = `${appRootPath}/.gitignore`;
  const gitIgnoreText = karmaConfig.git.ignore.join("\n");
  await Bun.write(gitIgnorePath, gitIgnoreText);
};

const installPackages = async (
  appRootPath: string,
  karmaConfig: KarmaConfig
) => {
  const packageJsonPath = `${appRootPath}/package.json`;
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
  appRootPath: string,
  karmaConfig: KarmaConfig,
  regeneratableFiles: RegeneratableFilesMap
) => {
  console.log(`Removing previously installed files...`);
  await removeInstalledFiles(appRootPath, regeneratableFiles);
  console.log(`\nInstalling latest config and packages...`);
  await installDotVsCodeDir(appRootPath, karmaConfig);
  await installGitIgnore(appRootPath, karmaConfig);
  await installPackages(appRootPath, karmaConfig);
};

const installSpecificPackage = async (bunPackageAlias: string) => {
  if (!bunPackageAlias) throw `Package name is empty.`;
  console.log(`Installing '${bunPackageAlias}' package`);
};

export const installApp = async (
  bunPackageAlias: string,
  karmaConfig: KarmaConfig,
  regeneratableFiles: RegeneratableFilesMap
) => {
  const cwd = process.cwd();
  try {
    if (bunPackageAlias === NO_ARG_PROVIDED) {
      await installAllConfigsAndPackages(cwd, karmaConfig, regeneratableFiles);
    } else {
      await installSpecificPackage(bunPackageAlias);
    }
  } catch (error) {
    console.log(error);
    process.exit(1);
  }

  process.exit();
};
