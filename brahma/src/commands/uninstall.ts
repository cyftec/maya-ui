import { $ } from "bun";
import { exists, rm } from "node:fs/promises";
import { syncPackageJsonToKarma } from "../utils/karma-file-updaters";
import type { Karma } from "../probes/karma/karma-types";

export const removeInstalledFiles = async (
  appRootPath: string,
  karma: Karma,
) => {
  const files = Object.values(karma.brahma.build.disposable);
  for (const file of files) {
    const filePath = `${appRootPath}/${file}`;
    const fileExists = await exists(filePath);
    if (fileExists) console.log(`deleting: ${filePath}`);
    if (fileExists) await rm(filePath, { recursive: true });
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
  const cwd = process.cwd();

  if (!packageArgs.length) await uninstallAllConfigsAndPackages(cwd, karma);
  else {
    await uninstallSpecificPackage(packageArgs);
    await syncPackageJsonToKarma(cwd);
  }

  process.exit();
};
