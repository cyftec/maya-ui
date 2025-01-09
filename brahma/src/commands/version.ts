import path from "node:path";
import { config } from "../sample-app/karma";
import { $ } from "bun";

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
  const mayaV = config.packageJson.dependencies["@mufw/maya"];
  console.log(`brahma v${brahmaV}`);
  console.log(
    `\nWith base version of maya v${mayaV}.
Resetting version with 'brahma reset' resets maya version to ${mayaV}.
Check 'karma.ts' after resetting.`
  );
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
