import chokidar, { type Matcher } from "chokidar";
import { onProcessSigInt } from "./process-helpers";
import type { Stats } from "node:fs";

type ProcessControl = Pick<NodeJS.Process, "on" | "exit">;

export const watchFileChange = (
  watchableDirPath: string,
  ignorePaths: Matcher | Matcher[] | undefined,
  onFileChange: (path: string, stats?: Stats | undefined) => void,
  controlledProcess: ProcessControl = process,
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

  controlledProcess.on("exit", onExit);
  onProcessSigInt(controlledProcess);
  return watcher;
};
