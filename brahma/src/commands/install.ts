import { $ } from "bun";
import { exists, mkdir } from "node:fs/promises";
import { syncPackageJsonToKarma } from "../common/file-syncer.ts";
import type {
  KarmaConfig,
  RegeneratableFilesMap,
} from "../sample-app/karma-types.ts";
import { removeInstalledFiles } from "./uninstall.ts";

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
  await $`bun i`;
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

const installSpecificPackage = async (bunAddPackageArgs: string[]) => {
  const bunPackageAlias = bunAddPackageArgs.join(" ").trim();
  if (!bunPackageAlias) throw `Package name is empty.`;
  console.log(`Installing '${bunPackageAlias}' package...\n`);
  await $`${{ raw: `bun add ${bunPackageAlias}`.trim() }} `;
};

export const installPackageOrEverything = async (
  packageArgs: string[],
  karmaConfig: KarmaConfig,
  regeneratableFiles: RegeneratableFilesMap
) => {
  const cwd = process.cwd();
  const packageJsonExist = await exists(`${cwd}/package.json`);

  if (!packageArgs.length || !packageJsonExist) {
    await installAllConfigsAndPackages(cwd, karmaConfig, regeneratableFiles);
  }

  if (packageArgs.length) {
    await installSpecificPackage(packageArgs);
    await syncPackageJsonToKarma(cwd);
  }

  process.exit();
};
