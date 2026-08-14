import path from "node:path";
import { fileURLToPath } from "node:url";
import type { Karma } from "../probe/base-karma/types";
import { getAppAssetsDirPath } from "../../utils/file-path-getters";
import {
  copyFileOrDir,
  createDirRecursively,
} from "../../utils/node-methods";

const getStylesheetProbePath = () =>
  fileURLToPath(import.meta.resolve("@cyftec/maya/nocss/probe"));

/**
 * Installs Maya's NoCSS stylesheet probe in the configured app assets directory.
 * The probe is overwritten deliberately when called from `brahma reset
 * --stylesheet`.
 */
export const copyStylesheetProbe = async (
  appRootPath: string,
  karma: Karma,
) => {
  const targetPath = path.join(
    getAppAssetsDirPath(appRootPath, karma),
    karma.brahma.build.buildableStylesheetFileName,
  );

  await createDirRecursively(path.dirname(targetPath));
  await copyFileOrDir(getStylesheetProbePath(), targetPath);
  console.log(`Stylesheet probe synchronized at '${targetPath}'.`);
};
