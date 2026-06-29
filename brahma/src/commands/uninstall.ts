import { $ } from "bun";
import { exists, rm } from "node:fs/promises";
import { syncPackageJsonToKarma } from "../utils/karma-file-updaters";
import type { Karma } from "../probe/karma-probe/karma-types";
import { getCWD } from "../utils/common";

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

const uninstallSpecificPackage = async (bunRemovePackageArgs: string[]) => {
  const bunPackageAlias = bunRemovePackageArgs.join(" ").trim();
  if (!bunPackageAlias)
    throw `Package name is incorrect. Provided - '${bunPackageAlias}'`;
  console.log(`Uninstalling '${bunPackageAlias}' package...\n`);
  await $`${{ raw: `bun remove ${bunPackageAlias}`.trim() }} `;
};

export const uninstallPackageOrEverything = async (
  packageArgs: string[],
  karma: Karma,
) => {
  const cwd = getCWD();

  if (!packageArgs.length) await uninstallAllConfigsAndPackages(cwd, karma);
  else {
    await uninstallSpecificPackage(packageArgs);
    await syncPackageJsonToKarma(cwd);
  }

  process.exit();
};
