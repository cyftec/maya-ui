import { exists, rm } from "node:fs/promises";
import type { RegeneratableFilesMap } from "../example/karma-type";

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

export const uninstallApp = async (
  projectRootDirPath: string,
  regeneratableFiles: RegeneratableFilesMap
) => {
  console.log(`Removing installed config and packages...`);

  try {
    console.log(Object.values(regeneratableFiles));
    await removeInstalledFiles(projectRootDirPath, regeneratableFiles);
  } catch (error) {
    console.log(error);
    process.exit(1);
  }

  process.exit();
};
