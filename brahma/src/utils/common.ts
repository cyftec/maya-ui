import { exists, lstat, mkdir, readdir } from "node:fs/promises";
import type { Karma, KarmaConfig } from "../probes/karma/karma-types";

export const nonCachedImport = async (modulePath: string) => {
  const mpWithParam = `${modulePath}?imported=${Date.now()}`;
  return await import(mpWithParam);
};

export const createDirIfNotExist = async (dirPath: string) => {
  if (await exists(dirPath)) return;
  try {
    await mkdir(dirPath);
  } catch (error) {
    console.log(dirPath);
    throw error;
  }
};

export const getFileNameFromPath = (path: string) => {
  if (!path.includes("/")) throw "Not a valid file or directory path";
  return path.split("/").pop() as string;
};

export const hasKarmaConfigFile = async (dirPath: string): Promise<boolean> =>
  (await readdir(dirPath)).includes("karma.ts");

export const getKarma = async (dirPath: string): Promise<Karma | undefined> => {
  if (!(await hasKarmaConfigFile(dirPath))) return;
  return await import(`${dirPath}/karma.ts`);
};

export const getAppSrcPath = (appRootPath: string, config: KarmaConfig) => {
  return `${appRootPath}/${config.maya.sourceDirName}`;
};

export const validateMayaAppDir = async (
  dirPath: string
): Promise<{
  karmaMissing: boolean;
  karmaCorrupted: boolean;
  srcDirMissing: boolean;
}> => {
  const validState = {
    karmaMissing: false,
    karmaCorrupted: false,
    srcDirMissing: false,
  };
  const karma = await getKarma(dirPath);
  if (!karma) {
    return { ...validState, karmaMissing: true };
  }
  const {
    config,
    projectFileNames: { generated: regeneratableFiles },
  } = karma;
  if (!config || !regeneratableFiles) {
    return { ...validState, karmaCorrupted: true };
  }
  const files = await readdir(dirPath);
  for (const file of files) {
    const fileStats = await lstat(`${dirPath}/${file}`);
    if (file === config.maya.sourceDirName && fileStats.isDirectory())
      return validState;
  }

  return { ...validState, srcDirMissing: true };
};

export const splitText = (
  text: string,
  splittersPath: string[]
): [preTextIncludingSplitter: string, postSplitterText: string] =>
  splittersPath.reduce(
    ([presPlitter, postSplitter], splitter) => {
      const [preText, postText] = postSplitter.split(splitter);
      return [presPlitter + preText + splitter, postText];
    },
    ["", text]
  );
