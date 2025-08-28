import { exists, mkdir, readdir } from "node:fs/promises";
import path from "node:path";
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

export const getCurrentCliVersion = async () => {
  const thisProjectPackageJsonPath = path.resolve(
    __dirname,
    "../../package.json"
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

export const getMayaAppSrcPath = (appRootPath: string, config: KarmaConfig) => {
  return `${appRootPath}/${config.brahma.build.mayaSrcDir}`;
};

type MayaAppValidStates = {
  karmaMissing: boolean;
  karmaCorrupted: boolean;
  srcDirMissing: boolean;
  mayaSrcDirMissing: boolean;
};
export const validateMayaAppDir = async (
  dirPath: string
): Promise<MayaAppValidStates> => {
  const validState: MayaAppValidStates = {
    karmaMissing: false,
    karmaCorrupted: false,
    srcDirMissing: false,
    mayaSrcDirMissing: false,
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

  const sourceDirExists = await exists(
    `${dirPath}/${config.brahma.build.sourceDirName}`
  );
  if (!sourceDirExists) return { ...validState, srcDirMissing: true };

  const mayaSrcDirExists = await exists(
    `${dirPath}/${config.brahma.build.mayaSrcDir}`
  );
  if (!mayaSrcDirExists) return { ...validState, mayaSrcDirMissing: true };

  return validState;
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
