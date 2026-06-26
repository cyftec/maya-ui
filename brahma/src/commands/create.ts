import { cp, exists, mkdir } from "node:fs/promises";
import path from "node:path";
import type { AppMode } from "../probes/karma/karma-types";
import { NPM_DEPS } from "../utils/constants";
import { addPackageDepToKarma } from "../utils/karma-file-updaters";

const relativeProbesPath = "../probes";

const handleAppDirPath = async (appRootPath: string) => {
  if (await exists(appRootPath)) {
    console.log(`Directory '${appRootPath}' already exists.`);
    process.exit(1);
  } else {
    console.log(`Creating app in '${appRootPath}' directory.`);
  }
  const appRootDirName = appRootPath.split("/").pop();
  if (!appRootDirName) throw `Incorrect path for creating app.`;
  await mkdir(appRootDirName);
};

const copyProbe = async (relativeSrcPath: string, appRootPath: string) => {
  const srcPath = path.resolve(__dirname, relativeSrcPath);
  await cp(srcPath, appRootPath, { recursive: true });
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
  const appSrcPath = `${appRootPath}/dev`;

  await handleAppDirPath(appRootPath);
  await copyProbe(`${relativeProbesPath}/karma`, appRootPath);
  await addPackageDepToKarma(appRootPath, NPM_DEPS.MAYA);

  if (appMode === "ext") {
    await copyProbe(`${relativeProbesPath}/apps/ext`, appSrcPath);
    await addPackageDepToKarma(appRootPath, NPM_DEPS.CHROME);
  } else if (appMode === "pwa") {
    await copyProbe(`${relativeProbesPath}/apps/pwa`, appSrcPath);
    await addPackageDepToKarma(appRootPath, NPM_DEPS.PWA);
  } else {
    await copyProbe(`${relativeProbesPath}/apps/web`, appSrcPath);
  }

  console.log(`'${appRootDirName}' directory created.`);
  console.log(`
  Run following commands to start dev:

  cd ${appRootDirName}
  brahma install
  brahma stage
  `);
  process.exit();
};
