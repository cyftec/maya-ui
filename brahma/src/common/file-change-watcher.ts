import chokidar from "chokidar";
import { onProcessSigInt } from "./process-helpers";

export const watchFileChange = (
  watchableDirPath: string,
  onFileChange: (path: string) => void
) => {
  const watcher = chokidar.watch(watchableDirPath).on("change", onFileChange);
  console.log(`Watching changes in "${watchableDirPath}"`);

  const onExit = () => {
    console.log(`Closing watcher in '${watchableDirPath}'...`);
    watcher.close();
  };

  process.on("exit", onExit);
  onProcessSigInt();
};
