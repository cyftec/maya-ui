import { $ } from "bun";
import { exists, rm } from "node:fs/promises";
import type { RegeneratableFilesMap } from "../example/karma-types";
import { NO_ARG_PROVIDED } from "../common/constants";

export const removeInstalledFiles = async (
  appRootPath: string,
  regeneratableFiles: RegeneratableFilesMap
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
  regeneratableFiles: RegeneratableFilesMap
) => {
  console.log(`Removing installed config and packages...`);
  console.log(Object.values(regeneratableFiles));
  await removeInstalledFiles(appRootPath, regeneratableFiles);
};

const uninstallSpecificPackage = async (bunPackageAlias: string) => {
  if (!bunPackageAlias)
    throw `Package name is incorrect. Provided - '${bunPackageAlias}'`;
  console.log(`Uninstalling '${bunPackageAlias}' package...\n`);
  await $`bun remove ${bunPackageAlias}`;
  process.exit();
};

export const uninstallApp = async (
  bunPackageAlias: string,
  regeneratableFiles: RegeneratableFilesMap
) => {
  const cwd = process.cwd();
  try {
    if (bunPackageAlias === NO_ARG_PROVIDED) {
      await uninstallAllConfigsAndPackages(cwd, regeneratableFiles);
    } else {
      await uninstallSpecificPackage(bunPackageAlias);
    }
  } catch (error) {
    console.log(error);
    process.exit(1);
  }

  process.exit();
};
