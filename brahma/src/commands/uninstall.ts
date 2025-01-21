import { $ } from "bun";
import { exists, rm } from "node:fs/promises";
import { syncPackageJsonToKarma } from "../utils/karma-file-updaters";
import type { ProjectFileNames } from "../probes/karma/karma-types";

export const removeInstalledFiles = async (
  appRootPath: string,
  regeneratableFiles: ProjectFileNames["generated"]
) => {
  const files = Object.values(regeneratableFiles);
  for (const file of files) {
    const filePath = `${appRootPath}/${file}`;
    const fileExists = await exists(filePath);
    if (fileExists) console.log(`deleting: ${filePath}`);
    if (fileExists) await rm(filePath, { recursive: true });
  }
};

const uninstallAllConfigsAndPackages = async (
  appRootPath: string,
  regeneratableFiles: ProjectFileNames["generated"]
) => {
  console.log(`Removing installed config and packages...`);
  console.log(Object.values(regeneratableFiles));
  await removeInstalledFiles(appRootPath, regeneratableFiles);
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
  regeneratableFiles: ProjectFileNames["generated"]
) => {
  const cwd = process.cwd();

  if (!packageArgs.length)
    await uninstallAllConfigsAndPackages(cwd, regeneratableFiles);
  else {
    await uninstallSpecificPackage(packageArgs);
    await syncPackageJsonToKarma(cwd);
  }

  process.exit();
};
