import { exists, mkdir } from "node:fs/promises";
import type { Karma } from "../probe/karma-probe/types.ts";
import { getCWD } from "../utils/common.ts";
import {
  runShellCommand,
  type CommandRunner,
} from "../utils/command-runner.ts";
import { syncPackageJsonToKarma } from "../utils/karma-file-updaters.ts";
import { removeInstalledFiles } from "./uninstall.ts";

const installDotVsCodeDir = async (appRootPath: string, karma: Karma) => {
  const dotVsCodePath = `${appRootPath}/.vscode`;
  await mkdir(dotVsCodePath);
  const settingsPath = `${dotVsCodePath}/settings.json`;
  await Bun.write(
    settingsPath,
    JSON.stringify(karma.vscode.settings, null, "\t"),
  );
};

const installGitIgnore = async (appRootPath: string, karma: Karma) => {
  const gitIgnorePath = `${appRootPath}/.gitignore`;
  const gitIgnoreText = karma.git.ignore.join("\n");
  await Bun.write(gitIgnorePath, gitIgnoreText);
};

const installPackages = async (
  appRootPath: string,
  karma: Karma,
  runCommand: CommandRunner,
) => {
  const packageJsonPath = `${appRootPath}/package.json`;
  const packageJsonObject = karma.maya;

  if (!packageJsonObject) {
    console.log(
      `ERROR: 'config' object does not contain any property named 'packageJson' in karma.ts file. Reset the karma file with the command 'brahma reset'.`,
    );
    process.exit(1);
  }
  await Bun.write(
    packageJsonPath,
    JSON.stringify(packageJsonObject, null, "\t"),
  );
  await runCommand("bun i", appRootPath);
};

const installAllConfigsAndPackages = async (
  appRootPath: string,
  karma: Karma,
  runCommand: CommandRunner,
) => {
  console.log(`Removing previously installed files...`);
  await removeInstalledFiles(appRootPath, karma);
  console.log(`\nInstalling latest config and packages...`);
  await installPackages(appRootPath, karma, runCommand);
  await installDotVsCodeDir(appRootPath, karma);
  await installGitIgnore(appRootPath, karma);
};

const installSpecificPackage = async (
  bunAddPackageArgs: string[],
  appRootPath: string,
  runCommand: CommandRunner,
) => {
  const bunPackageAlias = bunAddPackageArgs.join(" ").trim();
  if (!bunPackageAlias) throw `Package name is empty.`;
  console.log(`Installing '${bunPackageAlias}' package...\n`);
  await runCommand(`bun add ${bunPackageAlias}`, appRootPath);
};

export const installPackageOrEverything = async (
  packageArgs: string[],
  karma: Karma,
  runCommand: CommandRunner = runShellCommand,
) => {
  const cwd = getCWD();
  const packageJsonExist = await exists(`${cwd}/package.json`);

  if (!packageArgs.length || !packageJsonExist) {
    await installAllConfigsAndPackages(cwd, karma, runCommand);
  }

  if (packageArgs.length) {
    await installSpecificPackage(packageArgs, cwd, runCommand);
    await syncPackageJsonToKarma(cwd);
  }

  process.exit();
};
