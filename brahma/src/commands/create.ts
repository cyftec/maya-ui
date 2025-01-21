import { exists, mkdir, cp } from "node:fs/promises";
import path from "node:path";
import type { AppType } from "../probes/karma/karma-types";
import { NPM_DEPS } from "../utils/constants";
import { addPackageDepToKarma } from "../utils/karma-file-updaters";

const relativeProbesPath = "../probes";

const handleAppDirPath = async (destAppPath: string) => {
  if (await exists(destAppPath)) {
    console.log(`Directory '${destAppPath}' already exists.`);
    process.exit(1);
  } else {
    console.log(`Creating app in '${destAppPath}' directory.`);
  }
  const appDirName = destAppPath.split("/").pop();
  if (!appDirName) throw `Incorrect path for creating app.`;
  await mkdir(appDirName);
};

const copyProbe = async (relativeSrcPath: string, destAppPath: string) => {
  const srcPath = path.resolve(__dirname, relativeSrcPath);
  await cp(srcPath, destAppPath, { recursive: true });
};

const getAppInfoArgs = (
  cmdArgs: string[]
): [appName: string, appMode?: AppType] => {
  if (!cmdArgs.length || cmdArgs.length > 2) {
    throw `ERROR: Max 2 args required for 'brahma create'.\nRun 'brahma help' for usage guide.`;
  }

  if (cmdArgs.length === 2) {
    const appModes: AppType[] = ["web", "ext", "pwa"];
    const [arg1, arg2] = cmdArgs;
    if (
      (arg1.startsWith("--") && arg2.startsWith("--")) ||
      (!arg1.startsWith("--") && !arg2.startsWith("--"))
    ) {
      throw `ERROR: Bad input for creating app directory.\nRun 'brahma help' for usage guide.`;
    }

    const dirName = arg2.startsWith("--") ? arg1 : arg2;
    const appModeArg = arg1 === dirName ? arg2 : arg1;
    const appMode = appModeArg.slice(2, appModeArg.length) as AppType;

    if (!appModes.includes(appMode)) {
      throw `ERROR: Incorrect app mode provided.\nRun 'brahma help' for usage guide.`;
    }

    return [dirName, appMode];
  }

  const dirName = cmdArgs[0];
  if (dirName.startsWith("--")) throw `ERROR: Incorrect app directory name.`;
  return [dirName];
};

export const createApp = async (cmdArgs: string[]) => {
  const [appDirName, appMode] = getAppInfoArgs(cmdArgs);

  const cwd = process.cwd();
  const destAppPath = `${cwd}/${appDirName}`;
  const destAppSrcPath = `${cwd}/${appDirName}/dev`;
  const karmaPath = `${cwd}/${appDirName}/karma.ts`;

  await handleAppDirPath(destAppPath);
  await copyProbe(`${relativeProbesPath}/karma`, destAppPath);
  await addPackageDepToKarma(karmaPath, NPM_DEPS.MAYA);

  if (appMode === "ext") {
    await copyProbe(`${relativeProbesPath}/apps/ext`, destAppSrcPath);
    await addPackageDepToKarma(karmaPath, NPM_DEPS.CHROME);
  } else if (appMode === "pwa") {
    await copyProbe(`${relativeProbesPath}/apps/pwa`, destAppSrcPath);
    await addPackageDepToKarma(karmaPath, NPM_DEPS.PWA);
  } else {
    await copyProbe(`${relativeProbesPath}/apps/web`, destAppSrcPath);
  }

  console.log(`'${appDirName}' directory created.`);
  console.log(`
  Run following commands to start dev:

  cd ${appDirName}
  brahma install
  brahma stage
  `);
  process.exit();
};
