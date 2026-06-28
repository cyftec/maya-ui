import { $ } from "bun";
import { exists, rm } from "node:fs/promises";
import type { AppMode, KarmaResetMode } from "../karma-probe/karma-types.ts";
import { getKarma } from "../utils/common.ts";
import { getKarmaPaths } from "../utils/file-path-getters.ts";

const getResetMode = (cmdArgs: string[]): KarmaResetMode => {
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
  const resetMode = getResetMode(cmdArgs);
  const appRootPath = process.cwd();
  let appMode: AppMode = "web";

  console.log(`Resetting 'karma.ts' file...`);

  const [karmaPath, karmaTypesPath] = getKarmaPaths(appRootPath);
  // fix karma if it exist or add new karma if it doesn't
  if (await exists(karmaPath)) {
    const karma = await getKarma(appRootPath);
    appMode = resetMode === "hard" ? "web" : karma.maya.appType;
    await rm(karmaPath);
  }
  if (await exists(karmaTypesPath)) {
    await rm(karmaTypesPath);
  }
  await $`sample-maya karma ${appMode || "web"} ${appRootPath}`;

  process.exit();
};
