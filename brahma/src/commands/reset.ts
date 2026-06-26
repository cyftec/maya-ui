import { cp, exists, rm } from "node:fs/promises";
import path from "node:path";
import type { AppMode, KarmaResetMode } from "../probes/karma/karma-types.ts";
import { getKarma, getKarmaPaths } from "../utils/common.ts";
import { NPM_DEPS } from "../utils/constants.ts";
import { updateObjectPropInFile } from "../utils/file-section-updater.ts";
import { addPackageDepToKarma } from "../utils/karma-file-updaters.ts";

export const resetApp = async (cmdArgs: string[]) => {
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

  const appRootPath = process.cwd();
  console.log(`Resetting 'karma.ts' file...`);

  let appMode: AppMode | undefined = undefined;
  try {
    const karma = await getKarma(appRootPath);
    appMode = karma.maya.appType;
  } catch (error) {
    // While resetting karma file showing same error about missing or corrupted
    // karma file is redundant and pointless
  }

  try {
    const relativeProbeKarmaPath = "../probes/karma";
    const [karmaPath, karmaTypesPath] = getKarmaPaths(appRootPath);
    if (await exists(karmaPath)) {
      await rm(karmaPath);
    }
    if (await exists(karmaTypesPath)) {
      await rm(karmaTypesPath);
    }
    const probeKarmaPath = path.resolve(__dirname, relativeProbeKarmaPath);
    await cp(probeKarmaPath, appRootPath, { recursive: true });
    await addPackageDepToKarma(appRootPath, NPM_DEPS.MAYA);
    if (resetMode === "hard" || !appMode) process.exit();

    if (appMode)
      await updateObjectPropInFile(
        karmaPath,
        ["karma:", "maya:", "appType:"],
        "web",
        appMode,
      );

    if (appMode === "ext") {
      await addPackageDepToKarma(appRootPath, NPM_DEPS.CHROME);
    }
    if (appMode === "pwa") {
      await addPackageDepToKarma(appRootPath, NPM_DEPS.PWA);
    }
  } catch (error) {
    console.log(error);
    process.exit(1);
  }

  process.exit();
};
