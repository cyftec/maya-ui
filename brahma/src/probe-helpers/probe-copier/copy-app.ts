import path from "node:path";
import { copyFileOrDir } from "../../utils/node-methods";
import type { AppMode } from "../probe/base-karma/types";
import { PROBE_PATH } from "./common";

export const copyApp = async (appType: AppMode, targetDir: string) => {
  const sourceDir = path.join(PROBE_PATH, "apps", appType);

  try {
    await copyFileOrDir(sourceDir, targetDir);
    console.log(`Successfully copied '${appType}' app to ${targetDir}.`);
  } catch (error) {
    console.error(`Error copying '${appType}' app:`, error);
    process.exit(1);
  }
};
