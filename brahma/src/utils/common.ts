import { pathToFileURL } from "node:url";
import type { Karma, KarmaConfigObject } from "../probe-helpers";
import { getKarmaPaths } from "./file-path-getters";
import { ValidateAndExitIf } from "./file-validations";
import { createDir, fileOrDirExists } from "./node-methods";

export const nonCachedImport = async (modulePath: string) => {
  const mpWithParam = `${pathToFileURL(modulePath).href}?imported=${Date.now()}`;
  return await import(mpWithParam);
};

export const createDirIfNotExist = async (dirPath: string) => {
  const dirAlreadyExists = await fileOrDirExists(dirPath);
  if (dirAlreadyExists) {
    console.log(`Directory '${dirPath}' already exists.`);
    return;
  }

  const dirName = dirPath.split("/").pop();
  if (!dirName) throw `Incorrect path for creating app.`;

  try {
    await createDir(dirPath);
  } catch (error) {
    console.log(dirPath);
    throw error;
  }
};

export const getFileNameFromPath = (path: string): string => {
  if (!path.includes("/")) throw "Not a valid file or directory path";
  return path.split("/").pop() as string;
};

export const getKarma = async (appRootPath: string): Promise<Karma> => {
  await ValidateAndExitIf.karmaFileMissing(appRootPath);
  const [karmaPath] = getKarmaPaths(appRootPath);
  const { karma } = (await nonCachedImport(karmaPath)) as KarmaConfigObject;
  ValidateAndExitIf.exportedKarmaMissing(karma);
  return karma;
};

// TODO: Revisit 'MAYA_DEV_MODE'
export const getCWD = () => {
  const cwd =
    process.env.MAYA_DEV_MODE === "1"
      ? process.env.INIT_CWD || process.cwd()
      : process.cwd();
  return cwd;
};
