import { exists, mkdir } from "node:fs/promises";
import type { Karma, KarmaConfigObject } from "../karma-probe/karma-types";
import { getKarmaPaths } from "./file-path-getters";
import { ValidateAndExitIf } from "./file-validations";

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
  ValidateAndExitIf.karmaFileMissing(appRootPath);
  const [karmaPath] = getKarmaPaths(appRootPath);
  const { karma } = (await nonCachedImport(karmaPath)) as KarmaConfigObject;
  ValidateAndExitIf.exportedKarmaMissing(karma);
  return karma;
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
