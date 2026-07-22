import { exists, rm } from "node:fs/promises";
import { syncPackageJsonToKarma } from "../utils/karma-file-updaters";
import type { Karma } from "../probe/karma-probe/karma-types";
import { getCWD } from "../utils/common";
import {
  runShellCommand,
  type CommandRunner,
} from "../utils/command-runner";

export const removeInstalledFiles = async (
  appRootPath: string,
  karma: Karma,
) => {
  const files = Object.values(karma.brahma.build.disposable);
  for (const file of files) {
    const filePath = `${appRootPath}/${file}`;
    if (await exists(filePath)) {
      console.log(`deleting: ${filePath}`);
      await rm(filePath, { recursive: true });
    }
  }
};

const uninstallAllConfigsAndPackages = async (
  appRootPath: string,
  karma: Karma,
) => {
  console.log(`Removing installed config and packages...`);
  console.log(Object.values(karma.brahma.build.disposable));
  await removeInstalledFiles(appRootPath, karma);
};

const uninstallSpecificPackage = async (
  bunRemovePackageArgs: string[],
  appRootPath: string,
  runCommand: CommandRunner,
) => {
  const bunPackageAlias = bunRemovePackageArgs.join(" ").trim();
  if (!bunPackageAlias)
    throw `Package name is incorrect. Provided - '${bunPackageAlias}'`;
  console.log(`Uninstalling '${bunPackageAlias}' package...\n`);
  await runCommand(`bun remove ${bunPackageAlias}`, appRootPath);
};

export const uninstallPackageOrEverything = async (
  packageArgs: string[],
  karma: Karma,
  runCommand: CommandRunner = runShellCommand,
) => {
  const cwd = getCWD();

  if (!packageArgs.length) await uninstallAllConfigsAndPackages(cwd, karma);
  else {
    await uninstallSpecificPackage(packageArgs, cwd, runCommand);
    await syncPackageJsonToKarma(cwd);
  }

  process.exit();
};
