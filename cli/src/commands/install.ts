import { $ } from "bun";
import { mkdir } from "node:fs/promises";
import type {
  KarmaConfig,
  RegeneratableFilesMap,
} from "../example/karma-type.ts";
import { removeInstalledFiles } from "./uninstall.ts";

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

export const installApp = async (
  projectRootDirPath: string,
  karmaConfig: KarmaConfig,
  regeneratableFiles: RegeneratableFilesMap
) => {
  try {
    console.log(`Removing previously installed files...`);
    await removeInstalledFiles(projectRootDirPath, regeneratableFiles);
    console.log(`\nInstalling latest config and packages...`);
    await installDotVsCodeDir(projectRootDirPath, karmaConfig);
    await installGitIgnore(projectRootDirPath, karmaConfig);
    await installPackages(projectRootDirPath, karmaConfig);
  } catch (error) {
    console.log(error);
    process.exit(1);
  }

  process.exit();
};
