import { existsSync } from "node:fs";
import { mkdir } from "node:fs/promises";
import path from "node:path";
import { fileURLToPath } from "url";

export const getPath = (relativePath) => {
  const currentFilePath = fileURLToPath(import.meta.url);
  const __dirname = path.dirname(currentFilePath);
  const fullPath = path.join(__dirname, relativePath);

  return fullPath;
};

export const createDirIfNotExists = async (appName) => {
  if (existsSync(appName)) {
    throw new Error(`Directory '${appName}' already exists.`);
  }
  if (typeof appName !== "string" || appName === "") {
    throw new Error(`Invalid directory name - '${appName}'`);
  }
  await mkdir(appName);
};
