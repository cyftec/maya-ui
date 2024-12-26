import { exists, rm } from "node:fs/promises";
import type { RegeneratableFilesMap } from "../example/karma-type";
import { NO_ARG_PROVIDED } from "../common/constants";

export const removeInstalledFiles = async (
  projectRootDirPath: string,
  regeneratableFiles: RegeneratableFilesMap
) => {
  const files = Object.values(regeneratableFiles);
  for (const file of files) {
    const filePath = `${projectRootDirPath}/${file}`;
    const fileExists = await exists(filePath);
    if (fileExists) console.log(`deleting: ${filePath}`);
    if (fileExists) await rm(filePath, { recursive: true });
  }
};

const uninstallAllConfigsAndPackages = async (
  projectRootDirPath: string,
  regeneratableFiles: RegeneratableFilesMap
) => {
  console.log(`Removing installed config and packages...`);
  console.log(Object.values(regeneratableFiles));
  await removeInstalledFiles(projectRootDirPath, regeneratableFiles);
};

const uninstallSpecificPackage = async (bunPackageAlias: string) => {
  if (!bunPackageAlias)
    throw `Package name is incorrect. Provided - '${bunPackageAlias}'`;
  console.log(`Uninstalling '${bunPackageAlias}' package`);
};

export const uninstallApp = async (
  bunPackageAlias: string,
  projectRootDirPath: string,
  regeneratableFiles: RegeneratableFilesMap
) => {
  try {
    if (bunPackageAlias === NO_ARG_PROVIDED) {
      await uninstallAllConfigsAndPackages(
        projectRootDirPath,
        regeneratableFiles
      );
    } else {
      await uninstallSpecificPackage(bunPackageAlias);
    }
  } catch (error) {
    console.log(error);
    process.exit(1);
  }

  process.exit();
};
