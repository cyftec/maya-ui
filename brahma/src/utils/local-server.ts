import browserSync from "browser-sync";
import { onProcessSigInt } from "./process-helpers";

const server = browserSync.create();

type LocalServer = Pick<typeof server, "init" | "exit">;
type ProcessControl = Pick<NodeJS.Process, "on" | "exit">;

export const runLocalServer = (
  port: number,
  serveDir: string,
  openOnStart: boolean,
  localServer: LocalServer = server,
  controlledProcess: ProcessControl = process,
) => {
  localServer.init({
    port: port,
    server: serveDir,
    open: openOnStart,
    ui: false,
    logLevel: "silent",
  });

  const onExit = () => {
    console.log(`Closing local server at port: ${port}...`);
    localServer.exit();
  };

  controlledProcess.on("exit", onExit);
  onProcessSigInt(controlledProcess);
};
