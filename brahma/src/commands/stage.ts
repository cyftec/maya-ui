import chokidar from "chokidar";
import liveServer from "live-server";
import { buildApp } from "../builder/build.ts";
import { getKarma } from "../common/utils.ts";
import type { KarmaConfig } from "../example/karma-types.ts";

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

const tryBuild = async (srcDir: string, config: KarmaConfig) => {
  try {
    const start = performance.now();
    await buildApp(srcDir, config, false);
    const finish = performance.now();
    console.log(`Build done in ${(finish - start).toFixed(0)} ms.\n`);
  } catch (error) {
    console.log(error);
    process.exit(1);
  }
};

export const stageApp = async () => {
  const cwd = process.cwd();
  console.log(`Staging app files and starting dev server...\n`);
  const karma = await getKarma(cwd);
  if (!karma) return false;
  const { config } = karma;
  const sourceDirPath = `${cwd}/${config.app.sourceDirName}`;
  const stagingDirPath = `${cwd}/${config.app.stagingDirName}`;

  await tryBuild(cwd, config);

  const watcher = chokidar.watch(sourceDirPath).on("change", () => {
    if (busyBuildingApp) return;
    onFileModification(async () => {
      busyBuildingApp = true;
      await tryBuild(cwd, config);
      busyBuildingApp = false;
    });
  });
  console.log(`Watching changes in staging directory:\n${stagingDirPath}`);

  const serverPort = config.app.localServer.port;
  liveServer.start({
    port: serverPort,
    host: "0.0.0.0",
    root: stagingDirPath,
    open: config.app.localServer.redirectOnStage,
    wait: 1000,
    logLevel: 2,
  });
  console.log(`\nLocal Server started on http://localhost:${serverPort}`);

  process.on("SIGINT", () => {
    console.log("\nClosing file watcher...");
    watcher.close();
    console.log(`\nClosing local dev server at port: ${serverPort}...`);
    liveServer.shutdown();
    process.exit(0);
  });
};
