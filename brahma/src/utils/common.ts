import { exists, mkdir } from "node:fs/promises";
import path from "node:path";
import type { Karma, KarmaConfigObject } from "../probes/karma/karma-types";
import { getKarmaPaths } from "./file-path-getters";
import { ValidateAppFileAndExitIf } from "./file-validations";

export const nonCachedImport = async (modulePath: string) => {
  const mpWithParam = `${modulePath}?imported=${Date.now()}`;
  return await import(mpWithParam);
};

export const createDirIfNotExist = async (appRootDirPath: string) => {
  if (await exists(appRootDirPath)) return;
  try {
    await mkdir(appRootDirPath);
  } catch (error) {
    console.log(appRootDirPath);
    throw error;
  }
};

export const getFileNameFromPath = (path: string): string => {
  if (!path.includes("/")) throw "Not a valid file or directory path";
  return path.split("/").pop() as string;
};

export const getKarma = async (appRootPath: string): Promise<Karma> => {
  ValidateAppFileAndExitIf.karmaFileMissing(appRootPath);
  const [karmaPath] = getKarmaPaths(appRootPath);
  const { karma } = (await nonCachedImport(karmaPath)) as KarmaConfigObject;
  ValidateAppFileAndExitIf.exportedKarmaMissing(karma);
  return karma;
};

export const getCurrentCliVersion = async () => {
  const thisProjectPackageJsonPath = path.resolve(
    __dirname,
    "../../package.json",
  );
  const packageJsonExist = await exists(thisProjectPackageJsonPath);
  if (!packageJsonExist) throw `'package.json' file is missing.`;
  const packageJsonText = await Bun.file(thisProjectPackageJsonPath).text();
  const currentCliVersion = packageJsonText
    .split(`"version"`)[1]
    .split(",")[0]
    .trim()
    .slice(1)
    .trim()
    .replaceAll(`"`, "");
  return currentCliVersion;
};

export const splitText = (
  text: string,
  splittersPath: string[],
): [preTextIncludingSplitter: string, postSplitterText: string] =>
  splittersPath.reduce(
    ([presPlitter, postSplitter], splitter) => {
      const [preText, postText] = postSplitter.split(splitter);
      return [presPlitter + preText + splitter, postText];
    },
    ["", text],
  );
