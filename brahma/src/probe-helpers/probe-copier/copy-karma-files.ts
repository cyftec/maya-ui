import path from "node:path";
import type { AppMode } from "../probe/base-karma/types";
import { PROBE_PATH } from "./common";
import { copyFileOrDir } from "../../utils/node-methods";

export const copyBaseKarmaFiles = async (
  appType: AppMode,
  targetDir: string,
) => {
  const sourceKarmaDir = path.join(PROBE_PATH, "base-karma");
  const targetKarmaDir = path.join(targetDir, "_karma");

  console.log("Karma file synchronization completed!");

  try {
    await copyFileOrDir(sourceKarmaDir, targetKarmaDir);
    console.log(
      `Successfully copied karma files from '${appType}' app to ${targetDir}.`,
    );
  } catch (error) {
    console.error(`Error copying karma files from '${appType}' app:`, error);
    process.exit(1);
  }
};
