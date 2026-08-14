import { exists, lstat, readdir, rm, mkdir, cp } from "node:fs/promises";

export const getPathStats = async (fileOrDirPath: string) =>
  await lstat(fileOrDirPath);

export const fileOrDirExists = async (dirPath: string) => await exists(dirPath);

export const createDir = async (dirPath: string) => await mkdir(dirPath);

export const createDirRecursively = async (dirPath: string) =>
  await mkdir(dirPath, { recursive: true });

export const readDir = async (dirPath: string) => await readdir(dirPath);

export const removeFileOrDir = async (fileOrDirPath: string) =>
  await rm(fileOrDirPath, { recursive: true });

export const copyFileOrDir = async (
  sourceFileOrDirPath: string,
  targetFileOrDirPath: string,
) => await cp(sourceFileOrDirPath, targetFileOrDirPath, { recursive: true });
