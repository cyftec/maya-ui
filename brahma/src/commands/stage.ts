import { buildApp } from "../builder/build.ts";
import { getKarma } from "../common/utils.ts";
import type { KarmaConfig } from "../example/karma-types.ts";
import chokidar, { type FSWatcher } from "chokidar";

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
  let watcher: FSWatcher;
  const cwd = process.cwd();
  console.log(`Staging app files and starting dev server...\n`);
  const karma = await getKarma(cwd);
  if (!karma) return false;
  const { config } = karma;

  await tryBuild(cwd, config);

  const sourceDirPath = `${cwd}/${config.app.sourceDirName}`;

  watcher = chokidar.watch(sourceDirPath).on("change", () => {
    if (busyBuildingApp) return;
    onFileModification(async () => {
      busyBuildingApp = true;
      await tryBuild(cwd, config);
      busyBuildingApp = false;
    });
  });

  process.on("SIGINT", () => {
    // close watcher when Ctrl-C is pressed
    console.log("\nClosing stage and dev server...");
    watcher?.close();
    process.exit(0);
  });
};
