import { cp, exists, rm } from "node:fs/promises";
import path from "node:path";
import { getKarma } from "../utils/common.ts";
import { NPM_DEPS } from "../utils/constants.ts";
import { updateObjectPropInFile } from "../utils/file-section-updater.ts";
import { addPackageDepToKarma } from "../utils/karma-file-updaters.ts";
import type { AppMode, KarmaResetMode } from "../probes/karma/karma-types.ts";

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

  const cwd = process.cwd();
  console.log(`Resetting 'karma.ts' file...`);

  try {
    const karma = await getKarma(cwd);
    if (!karma) {
      console.log(`ERROR: 'karma.ts' file is missing in current directory.
  - 'brahma reset' is used when 'karma.ts' file exists but is corrupted.`);
      process.exit(1);
    }
    // older versions of karma.ts might not have latest config structure
    // thus, '?' in 'karma.config.maya?.mode'
    const appMode = karma.config?.maya?.mode as AppMode | undefined;
    const relativeKarmaPath = "../probes/karma";
    const karmaPath = `${cwd}/karma.ts`;
    const karmaTypesPath = `${cwd}/karma-types.ts`;
    if (await exists(karmaPath)) {
      await rm(karmaPath);
    }
    if (await exists(karmaTypesPath)) {
      await rm(karmaTypesPath);
    }
    const baseKarmaPath = path.resolve(__dirname, relativeKarmaPath);
    await cp(baseKarmaPath, cwd, { recursive: true });
    await addPackageDepToKarma(karmaPath, NPM_DEPS.MAYA);
    if (resetMode === "hard" || !appMode) process.exit();

    await updateObjectPropInFile(
      karmaPath,
      ["config:", "maya:", "mode:"],
      "web",
      appMode
    );

    if (appMode === "ext") {
      await addPackageDepToKarma(karmaPath, NPM_DEPS.CHROME);
    }
    if (appMode === "pwa") {
      await addPackageDepToKarma(karmaPath, NPM_DEPS.PWA);
    }
  } catch (error) {
    console.log(error);
    process.exit(1);
  }

  process.exit();
};
