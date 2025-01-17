import { buildApp } from "../builder";
import { DS_STORE_REGEX } from "../utils/constants.ts";
import { watchFileChange } from "../utils/file-change-watcher.ts";
import { runLocalServer } from "../utils/local-server.ts";
import { startStdinListener } from "../utils/stdin-listener.ts";
import { getKarma } from "../utils/common.ts";
import type { KarmaConfig } from "../sample-app/karma-types.ts";

const DEBOUNCE_TIME_IN_MS = 500;
let lastTimestamp: number = 0;
let busyBuildingApp = false;

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

const buildSrcDir = async (srcDir: string, config: KarmaConfig) => {
  const start = performance.now();
  await buildApp(srcDir, config, false);
  const finish = performance.now();
  console.log(`Build done in ${(finish - start).toFixed(0)} ms.\n`);
};

export const stageApp = async () => {
  const cwd = process.cwd();
  console.log(`Staging app files and starting dev server...\n`);
  const karma = await getKarma(cwd);
  if (!karma) return false;
  const { config } = karma;
  const sourceDirPath = `${cwd}/${config.brahma.build.sourceDirName}`;
  const stagingDirPath = `${cwd}/${config.brahma.localServer.serveDirectory}`;
  const watchIgnorePaths = [DS_STORE_REGEX];
  const serverPort = config.brahma.localServer.port;

  await buildSrcDir(cwd, config);
  watchFileChange(sourceDirPath, watchIgnorePaths, (path) => {
    if (busyBuildingApp) return;
    onFileModification(async () => {
      busyBuildingApp = true;
      console.log(`Change detected: ${path}`);
      await buildSrcDir(cwd, config);
      busyBuildingApp = false;
    });
  });
  runLocalServer(
    serverPort,
    stagingDirPath,
    config.brahma.localServer.redirectOnStage
  );

  setTimeout(() => {
    console.log(`Press 'q' and then Enter to quit.`);
    startStdinListener(async () => {
      console.log(`Quitting on user input.`);
      process.exit();
    });
  }, 0);
};
