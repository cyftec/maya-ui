import liveServer from "live-server";
import { onProcessSigInt } from "./process-helpers";

export const runLocalServer = (
  port: number,
  serveDir: string,
  openOnStart: boolean
) => {
  liveServer.start({
    port: port,
    host: "0.0.0.0",
    root: serveDir,
    open: openOnStart,
    wait: 1000,
    logLevel: 2,
  });

  const onExit = () => {
    console.log(`Closing local server at port: ${port}...`);
    liveServer.shutdown();
  };

  process.on("exit", onExit);
  onProcessSigInt();
};
