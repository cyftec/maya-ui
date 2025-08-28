import { $ } from "bun";
import { exists, mkdir } from "node:fs/promises";
import type {
  KarmaConfig,
  ProjectFileNames,
} from "../probes/karma/karma-types.ts";
import { getCurrentCliVersion, getKarma } from "../utils/common.ts";
import { syncPackageJsonToKarma } from "../utils/karma-file-updaters.ts";
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
  const packageJsonBlob = karmaConfig.packageJson;

  if (!packageJsonBlob) {
    console.log(
      `ERROR: 'config' object does not contain any property named 'packageJson' in karma.ts file. Reset the karma file with the command 'brahma reset'.`
    );
    process.exit(1);
  }
  await Bun.write(packageJsonPath, JSON.stringify(packageJsonBlob, null, "\t"));

  const karma = await getKarma(appRootPath);
  const currentCliVersion = await getCurrentCliVersion();
  const karmaCliVersion = karma?.config.brahma.version;
  if (!currentCliVersion) {
    console.log(`No version found in package.json`);
    process.exit(1);
  }
  if (!karmaCliVersion) {
    console.log(
      `'karma.ts' file is missing or it does not have brahma version. Reset the karma file with the command 'brahma reset'.`
    );
    process.exit(1);
  }
  if (currentCliVersion !== karmaCliVersion) {
    console.log(
      `CLI VERSION MISMATCH
          \nThe current brahma cli version does not match with brahma version declared in karma.ts file.
          \nEither globally install the brahma cli version as mentioned in karma.ts file or update brahma version in karma ts.file with the value of current cli version.`
    );
    process.exit(1);
  }
  await $`bun i`;
};

const installAllConfigsAndPackages = async (
  appRootPath: string,
  karmaConfig: KarmaConfig,
  regeneratableFiles: ProjectFileNames["generated"]
) => {
  console.log(`Removing previously installed files...`);
  await removeInstalledFiles(appRootPath, regeneratableFiles);
  console.log(`\nInstalling latest config and packages...`);
  await installPackages(appRootPath, karmaConfig);
  await installDotVsCodeDir(appRootPath, karmaConfig);
  await installGitIgnore(appRootPath, karmaConfig);
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
  regeneratableFiles: ProjectFileNames["generated"]
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
