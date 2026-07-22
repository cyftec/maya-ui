import { buildApp } from "../builder";
import { DS_STORE_REGEX } from "../utils/constants.ts";
import { watchFileChange } from "../utils/file-change-watcher.ts";
import { runLocalServer } from "../utils/local-server.ts";
import { startStdinListener } from "../utils/stdin-listener.ts";
import { getCWD, getKarma } from "../utils/common.ts";
import type { Karma } from "../probe/karma-probe/karma-types.ts";

const DEBOUNCE_TIME_IN_MS = 500;
let lastTimestamp: number = 0;
let busyBuildingApp = false;

type StageDependencies = {
  buildApp: typeof buildApp;
  watchFileChange: typeof watchFileChange;
  runLocalServer: typeof runLocalServer;
  startStdinListener: typeof startStdinListener;
  getCWD: typeof getCWD;
  getKarma: typeof getKarma;
  exit: typeof process.exit;
};

const defaultDependencies: StageDependencies = {
  buildApp,
  watchFileChange,
  runLocalServer,
  startStdinListener,
  getCWD,
  getKarma,
  exit: process.exit,
};

const onFileModification = (callback: () => Promise<void>) => {
  lastTimestamp = new Date().getTime();
  setTimeout(async () => {
    const newTimestamp = new Date().getTime();
    if (newTimestamp - lastTimestamp < DEBOUNCE_TIME_IN_MS) {
      return;
    }
    await callback();
  }, DEBOUNCE_TIME_IN_MS);
};

const buildAppWithPerf = async (
  appRootDir: string,
  karma: Karma,
  build: typeof buildApp,
) => {
  const start = performance.now();
  await build(appRootDir, karma, false);
  const finish = performance.now();
  console.log(`Build done in ${(finish - start).toFixed(0)} ms.\n`);
};

export const stageApp = async (
  dependencies: StageDependencies = defaultDependencies,
) => {
  const cwd = dependencies.getCWD();
  console.log(`Staging app files and starting dev server...\n`);
  const karma = await dependencies.getKarma(cwd);
  if (!karma) return false;
  const watchDirPath = `${cwd}/${karma.brahma.serve.watchDir}`;
  const serveDirPath = `${cwd}/${karma.brahma.serve.serveDir}`;
  const watchIgnorePaths = [DS_STORE_REGEX];
  const serverPort = karma.brahma.serve.port;

  await buildAppWithPerf(cwd, karma, dependencies.buildApp);
  dependencies.watchFileChange(watchDirPath, watchIgnorePaths, (path) => {
    if (busyBuildingApp) return;
    onFileModification(async () => {
      busyBuildingApp = true;
      console.log(`Change detected: ${path}`);
      await buildAppWithPerf(cwd, karma, dependencies.buildApp);
      busyBuildingApp = false;
    });
  });
  dependencies.runLocalServer(
    serverPort,
    serveDirPath,
    karma.brahma.serve.redirectOnStart,
  );

  setTimeout(() => {
    console.log(`Press 'q' and then Enter to quit.`);
    dependencies.startStdinListener(async () => {
      console.log(`Quitting on user input.`);
      dependencies.exit();
    });
  }, 0);
};
