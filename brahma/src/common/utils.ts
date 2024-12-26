import type {
  RegeneratableFilesMap,
  KarmaConfig,
} from "../example/karma-type.ts";
import { readdir, mkdir, exists, lstat } from "node:fs/promises";

export const getExportedPageMethodName = (filename: string) => {
  const words = filename.replace("-", ".").split(".");
  words.pop();
  return words.join("_") + "_default";
};

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

export const getKarma = async (
  dirPath: string
): Promise<
  | {
      config: KarmaConfig;
      regeneratables: RegeneratableFilesMap;
    }
  | undefined
> => {
  if (!(await hasKarmaConfigFile(dirPath))) return;
  return await import(`${dirPath}/karma.ts`);
};

export const isMayaAppDir = async (dirPath: string): Promise<boolean> => {
  const karma = await getKarma(dirPath);
  if (!karma) return false;
  const { config } = karma;
  const files = await readdir(dirPath);
  for (const file of files) {
    const fileStats = await lstat(`${dirPath}/${file}`);
    if (file === config.app.appRootDirName && fileStats.isDirectory())
      return true;
  }

  return false;
};
