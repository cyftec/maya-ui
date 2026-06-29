import { $ } from "bun";
import { getCWD, getKarma } from "../utils/common";
import { getCurrentBrahmaVersion } from "../brahma-version-getter";

const showVersionOnly = async () => {
  const brahmaV = await getCurrentBrahmaVersion();
  const cwd = getCWD();
  let currentMayaV: string = "";
  try {
    const karma = await getKarma(cwd);
    currentMayaV = karma.maya.dependencies["@cyftec/maya"];
  } catch (error) {}
  console.log(`brahma - ${brahmaV}`);
  console.log(`maya   - ${currentMayaV || "(Not a Maya app directory)"}`);
};

export const showVersion = async (cmdArgs: string[]) => {
  if (!cmdArgs.length) {
    await showVersionOnly();
    process.exit();
  }

  const [leadingText, versionToShift] = cmdArgs[0].split("--v=");
  if (!leadingText && versionToShift) {
    console.log(`Shifting to '@cyftec/brahma@${versionToShift}'`);
    try {
      await $`${{
        raw: `bun add -g @cyftec/brahma@${versionToShift}`.trim(),
      }} `;
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
