import path from "node:path";
import {
  transformWebKarmaToNonWebKarma,
  copyBaseKarmaFiles,
  copyStylesheetProbe,
  type AppMode,
  type KarmaResetMode,
} from "../probe-helpers";
import { getCWD, getKarma } from "../utils/common.ts";
import { getKarmaPaths } from "../utils/file-path-getters.ts";
import { fileOrDirExists, removeFileOrDir } from "../utils/node-methods.ts";

export const getResetMode = (cmdArgs: string[]): KarmaResetMode => {
  const resetModeSpecifier = cmdArgs.length ? cmdArgs[0] : "--soft";
  const resetMode = resetModeSpecifier.slice(2) as KarmaResetMode;
  if (
    !resetModeSpecifier.startsWith("--") ||
    !["soft", "hard"].includes(resetMode)
  ) {
    console.log(`ERROR: Bad reset mode specifier '${cmdArgs[0]}' provided.
    - valid reset modes are 'hard' and 'soft'
    - accepted specifier should be either --hard or --soft`);
    process.exit(1);
  }
  return resetMode;
};

export const resetApp = async (cmdArgs: string[]) => {
  const appRootPath = getCWD();

  if (cmdArgs.length === 1 && cmdArgs[0] === "--stylesheet") {
    console.log("Resetting stylesheet probe...");
    await copyStylesheetProbe(appRootPath, await getKarma(appRootPath));
    process.exit();
  }

  const resetMode = getResetMode(cmdArgs);
  let appMode: AppMode = "web";

  console.log(`Resetting 'karma.ts' file...`);

  const [karmaPath, karmaTypesPath] = getKarmaPaths(appRootPath);
  // fix karma if it exist or add new karma if it doesn't
  if (await fileOrDirExists(karmaPath)) {
    const karma = await getKarma(appRootPath);
    appMode = resetMode === "hard" ? "web" : karma.maya.appType;
    await removeFileOrDir(karmaPath);
  }
  if (await fileOrDirExists(karmaTypesPath)) {
    await removeFileOrDir(karmaTypesPath);
  }

  const appType: AppMode = appMode || "web";
  await copyBaseKarmaFiles(appType, appRootPath);
  if (appType !== "web") {
    const targetKarmaPath = path.join(appRootPath, "_karma", "karma.ts");
    await transformWebKarmaToNonWebKarma(appType, targetKarmaPath);
  }

  process.exit();
};
