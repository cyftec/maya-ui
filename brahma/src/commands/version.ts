import { exists } from "node:fs/promises";
import { getCWD, nonCachedImport } from "../utils/common";
import { runShellCommand, type CommandRunner } from "../utils/command-runner";
import { getKarmaPaths } from "../utils/file-path-getters";
import { getCurrentBrahmaVersion } from "../brahma-version-getter";
import type { KarmaConfigObject } from "../probe/karma-probe/types";

export const showVersionOnly = async () => {
  const brahmaV = await getCurrentBrahmaVersion();
  const cwd = getCWD();
  let currentMayaV: string = "";
  try {
    const [karmaPath] = getKarmaPaths(cwd);
    if (await exists(karmaPath)) {
      const { karma } = (await nonCachedImport(karmaPath)) as KarmaConfigObject;
      currentMayaV = karma?.maya?.dependencies?.["@cyftec/maya"] || "";
    }
  } catch (error) {}
  console.log(`brahma - ${brahmaV}`);
  console.log(`maya   - ${currentMayaV || "(Not a Maya app directory)"}`);
};

export const showVersion = async (
  cmdArgs: string[],
  runCommand: CommandRunner = runShellCommand,
) => {
  if (!cmdArgs.length) {
    await showVersionOnly();
    process.exit();
  }

  const [leadingText, versionToShift] = cmdArgs[0].split("--v=");
  if (!leadingText && versionToShift) {
    console.log(`Shifting to '@cyftec/brahma@${versionToShift}'`);
    try {
      await runCommand(`bun add -g @cyftec/brahma@${versionToShift}`);
    } catch (error) {
      process.exit(1);
    }
    process.exit();
  } else {
    console.log(`Bad input. Correct usage is as below.\n
      - brahma v --v=<version>
      - brahma v --v=latest
      - brahma version --v=<version>
      - brahma version --v=latest
      `);
    process.exit(1);
  }
};
