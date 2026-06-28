import { $ } from "bun";
import { exists, mkdir } from "node:fs/promises";
import type { AppMode } from "../karma-probe/karma-types";

const createAppRootDir = async (appRootPath: string) => {
  console.log(`Creating app in '${appRootPath}' directory.`);
  if (await exists(appRootPath)) {
    console.log(`Directory '${appRootPath}' already exists.`);
    process.exit(1);
  }

  const appRootDirName = appRootPath.split("/").pop();
  if (!appRootDirName) throw `Incorrect path for creating app.`;
  await mkdir(appRootDirName);
};

const getCreateAppCommandArgs = (
  cmdArgs: string[],
): [appName: string, appMode?: AppMode] => {
  if (!cmdArgs.length || cmdArgs.length > 2) {
    throw `ERROR: Max 2 args required for 'brahma create'.\nRun 'brahma help' for usage guide.`;
  }

  if (cmdArgs.length === 2) {
    const appModes: AppMode[] = ["web", "ext", "pwa"];
    const [arg1, arg2] = cmdArgs;
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

  const appRootDirName = cmdArgs[0];
  if (appRootDirName.startsWith("--"))
    throw `ERROR: Incorrect app directory name.`;
  return [appRootDirName];
};

export const createApp = async (cmdArgs: string[]) => {
  const [appRootDirName, appMode] = getCreateAppCommandArgs(cmdArgs);

  const cwd = process.cwd();
  const appRootPath = `${cwd}/${appRootDirName}`;

  await createAppRootDir(appRootPath);
  await $`sample-maya app ${appMode || "web"} ${appRootPath}`;

  console.log(`'${appRootDirName}' directory created.`);
  console.log(`
  Run following commands to start dev:

  cd ${appRootDirName}
  brahma install
  brahma stage
  `);
  process.exit();
};
