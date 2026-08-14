import { buildApp } from "../builder";
import { getCWD, getKarma } from "../utils/common.ts";
import { DS_STORE_REGEX } from "../utils/constants.ts";
import { debouncer } from "../utils/debouncer.ts";
import { watchFileChange } from "../utils/file-change-watcher.ts";
import { runLocalServer } from "../utils/local-server.ts";
import { startStdinListener } from "../utils/stdin-listener.ts";

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

export const stageApp = async (
  dependencies: StageDependencies = defaultDependencies,
) => {
  const cwd = dependencies.getCWD();
  const karma = await dependencies.getKarma(cwd);
  if (!karma) {
    console.error(`Karma file not found`);
    return false;
  }
  console.log(`Staging app files and starting dev server...\n`);
  const watchDirPath = `${cwd}/${karma.brahma.serve.watchDir}`;
  const serveDirPath = `${cwd}/${karma.brahma.serve.serveDir}`;
  const watchIgnorePaths = [DS_STORE_REGEX];
  const serverPort = karma.brahma.serve.port;

  await dependencies.buildApp(cwd, karma, false);
  const debouncedAppBuilder = debouncer(
    async (path: string) => {
      console.log(`Change detected in: ${path}`);
      await dependencies.buildApp(cwd, karma, false);
    },
    1000,
    true,
  );

  dependencies.watchFileChange(
    watchDirPath,
    watchIgnorePaths,
    debouncedAppBuilder,
  );
  dependencies.runLocalServer(
    serverPort,
    serveDirPath,
    karma.brahma.serve.redirectOnStart,
  );

  setTimeout(() => {
    console.log(`Press 'q' to quit.`);
    dependencies.startStdinListener(async () => {
      console.log(`Quitting on user input.`);
      dependencies.exit();
    });
  }, 0);
};
