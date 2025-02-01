import chokidar, { type Matcher } from "chokidar";
import { onProcessSigInt } from "./process-helpers";
import type { Stats } from "node:fs";

export const watchFileChange = (
  watchableDirPath: string | string[],
  ignorePaths: Matcher | Matcher[] | undefined,
  onFileChange: (path: string, stats?: Stats | undefined) => void
) => {
  const watcher = chokidar
    .watch(watchableDirPath, {
      ignored: ignorePaths,
    })
    .on("change", onFileChange);
  console.log(`Watching changes in "${watchableDirPath}"`);

  const onExit = () => {
    console.log(`Closing watcher in '${watchableDirPath}'...`);
    watcher.close();
  };

  process.on("exit", onExit);
  onProcessSigInt();
};
