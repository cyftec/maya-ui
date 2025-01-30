import { $ } from "bun";
import path from "node:path";
import { NPM_DEPS } from "../utils/constants";
import { nonCachedImport } from "../utils/common";
import type { Karma } from "../probes/karma/karma-types";

const getPackageVersion = (packageJsonText: string) =>
  packageJsonText
    .split(`"version"`)[1]
    .split(",")[0]
    .trim()
    .slice(1)
    .trim()
    .replaceAll(`"`, "");

const showVersionOnly = async (cliRootPath: string) => {
  const packageJsonPath = `${cliRootPath}/package.json`;
  const brahmaPackageJsonText = await Bun.file(packageJsonPath).text();
  const brahmaV = getPackageVersion(brahmaPackageJsonText);
  const baseMayaV = NPM_DEPS.MAYA["@mufw/maya"];
  let currentMayaV: string = "";
  try {
    const karmaPath = `${process.cwd()}/karma.ts`;
    const karma = (await nonCachedImport(karmaPath)) as Karma;
    currentMayaV =
      karma?.config?.maya?.packageJson?.dependencies?.["@mufw/maya"];
  } catch (error) {}

  if (!currentMayaV) {
    console.log(`brahma - v${brahmaV}`);
  }
  if (currentMayaV && currentMayaV === baseMayaV) {
    console.log(`brahma - v${brahmaV}`);
    console.log(`maya   - v${currentMayaV}`);
  }
  if (currentMayaV && currentMayaV !== baseMayaV) {
    console.log(`brahma         - v${brahmaV}`);
    console.log(`maya (current) - v${currentMayaV}`);
    console.log(`maya (base)    - v${baseMayaV}`);
    console.log(
      `\nResetting karma with 'brahma reset' resets current maya version to base version ${baseMayaV}. \nCheck 'karma.ts' after resetting.`
    );
  }
};

export const showVersion = async (cmdArgs: string[]) => {
  const cliRootPath = path.resolve(__dirname, "../../");
  if (!cmdArgs.length) {
    await showVersionOnly(cliRootPath);
    process.exit();
  }

  const [leadingText, versionToShift] = cmdArgs[0].split("--v=");
  if (!leadingText && versionToShift) {
    console.log(`Shifting to '@mufw/brahma@${versionToShift}'`);
    try {
      await $`${{
        raw: `bun add -g @mufw/brahma@${versionToShift}`.trim(),
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
