import { $ } from "bun";
import { exists, mkdir } from "node:fs/promises";
import type { Karma } from "../probe/karma-probe/karma-types.ts";
import { syncPackageJsonToKarma } from "../utils/karma-file-updaters.ts";
import { removeInstalledFiles } from "./uninstall.ts";
import { getCurrentBrahmaVersion } from "../brahma-version-getter.ts";
import { getCWD } from "../utils/common.ts";

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

const installPackages = async (appRootPath: string, karma: Karma) => {
  const packageJsonPath = `${appRootPath}/package.json`;
  const packageJsonBlob = karma.maya;

  if (!packageJsonBlob) {
    console.log(
      `ERROR: 'config' object does not contain any property named 'packageJson' in karma.ts file. Reset the karma file with the command 'brahma reset'.`,
    );
    process.exit(1);
  }
  await Bun.write(packageJsonPath, JSON.stringify(packageJsonBlob, null, "\t"));
  const currentBrahmaVersion = await getCurrentBrahmaVersion();
  const karmaBrahmaVersion = karma.brahma.version;
  if (currentBrahmaVersion !== karmaBrahmaVersion) {
    console.log(
      `CLI VERSION MISMATCH
          \nThe current brahma cli version - ${currentBrahmaVersion} does not match with brahma version declared in karma.ts file - ${karmaBrahmaVersion}.
          \nEither globally install the brahma cli version as mentioned in karma.ts file or update brahma version in karma ts.file with the value of current cli version.`,
    );
    process.exit(1);
  }
  await $`bun i`;
};

const installAllConfigsAndPackages = async (
  appRootPath: string,
  karma: Karma,
) => {
  console.log(`Removing previously installed files...`);
  await removeInstalledFiles(appRootPath, karma);
  console.log(`\nInstalling latest config and packages...`);
  await installPackages(appRootPath, karma);
  await installDotVsCodeDir(appRootPath, karma);
  await installGitIgnore(appRootPath, karma);
};

const installSpecificPackage = async (bunAddPackageArgs: string[]) => {
  const bunPackageAlias = bunAddPackageArgs.join(" ").trim();
  if (!bunPackageAlias) throw `Package name is empty.`;
  console.log(`Installing '${bunPackageAlias}' package...\n`);
  await $`${{ raw: `bun add ${bunPackageAlias}`.trim() }} `;
};

export const installPackageOrEverything = async (
  packageArgs: string[],
  karma: Karma,
) => {
  const cwd = getCWD();
  const packageJsonExist = await exists(`${cwd}/package.json`);

  if (!packageArgs.length || !packageJsonExist) {
    await installAllConfigsAndPackages(cwd, karma);
  }

  if (packageArgs.length) {
    await installSpecificPackage(packageArgs);
    await syncPackageJsonToKarma(cwd);
  }

  process.exit();
};
