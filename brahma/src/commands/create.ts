import {
  copyApp,
  copyBaseKarmaFiles,
  copyStylesheetProbe,
  type AppMode,
} from "../probe-helpers";
import { getCWD, getKarma } from "../utils/common";
import { transformWebKarmaToNonWebKarma } from "../probe-helpers/karma-transformer";
import path from "node:path";
import { createDir, fileOrDirExists } from "../utils/node-methods";

export const createAppRootDir = async (appRootPath: string) => {
  console.log(`Creating app in '${appRootPath}' directory.`);
  if (await fileOrDirExists(appRootPath)) {
    console.log(`Directory '${appRootPath}' already exists.`);
    process.exit(1);
  }

  const appRootDirName = appRootPath.split("/").pop();
  if (!appRootDirName) throw `Incorrect path for creating app.`;
  await createDir(appRootPath);
};

export const getCreateAppCommandArgs = (
  cmdArgs: string[],
): [appName: string, appMode?: AppMode] => {
  if (!cmdArgs.length || cmdArgs.length > 2) {
    throw `ERROR: Max 2 args required for 'brahma create'.\nRun 'brahma help' for usage guide.`;
  }

  if (cmdArgs.length === 2) {
    const appModes: AppMode[] = ["web", "ext", "pwa"];
    const arg1 = cmdArgs[0]!;
    const arg2 = cmdArgs[1]!;
    if (
      (arg1.startsWith("--") && arg2.startsWith("--")) ||
      (!arg1.startsWith("--") && !arg2.startsWith("--"))
    ) {
      throw `ERROR: Bad input for creating app directory.\nRun 'brahma help' for usage guide.`;
    }

    const appRootDirName = arg2.startsWith("--") ? arg1 : arg2;
    const appModeArg = arg1 === appRootDirName ? arg2 : arg1;
    const appMode = appModeArg.slice(2, appModeArg.length) as AppMode;

    if (!appModes.includes(appMode)) {
      throw `ERROR: Incorrect app mode provided.\nRun 'brahma help' for usage guide.`;
    }

    return [appRootDirName, appMode];
  }

  const appRootDirName = cmdArgs[0]!;
  if (appRootDirName.startsWith("--"))
    throw `ERROR: Incorrect app directory name.`;
  return [appRootDirName];
};

export const createApp = async (cmdArgs: string[]) => {
  const [appRootDirName, appMode] = getCreateAppCommandArgs(cmdArgs);
  const appType: AppMode = appMode || "web";
  const cwd = getCWD();
  const appRootPath = `${cwd}/${appRootDirName}`;

  await createAppRootDir(appRootPath);
  await copyApp(appType, appRootPath);
  await copyBaseKarmaFiles(appType, appRootPath);
  if (appType !== "web") {
    const targetKarmaPath = path.join(appRootPath, "_karma", "karma.ts");
    await transformWebKarmaToNonWebKarma(appType, targetKarmaPath);
  }
  await copyStylesheetProbe(appRootPath, await getKarma(appRootPath));

  console.log(`'${appRootDirName}' directory created.`);
  console.log(`
  Run following commands to start dev:

  cd ${appRootDirName}
  brahma install
  brahma stage
  `);
  process.exit();
};
