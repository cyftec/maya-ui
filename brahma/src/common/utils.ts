import { exists, lstat, mkdir, readdir } from "node:fs/promises";
import type { Karma } from "../sample-app/karma-types";

export const nonCachedImport = (modulePath: string) =>
  import(modulePath, { with: { type: `${Date.now()}` } });

export const createDirIfNotExist = async (dirPath: string) => {
  if (await exists(dirPath)) return;
  await mkdir(dirPath);
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
  const { config, regeneratables } = karma;
  if (!config || !regeneratables) {
    return { ...validState, karmaCorrupted: true };
  }
  const files = await readdir(dirPath);
  for (const file of files) {
    const fileStats = await lstat(`${dirPath}/${file}`);
    if (file === config.brahma.build.sourceDirName && fileStats.isDirectory())
      return validState;
  }

  return { ...validState, srcDirMissing: true };
};
