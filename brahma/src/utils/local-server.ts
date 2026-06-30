import browserSync from "browser-sync";
import { onProcessSigInt } from "./process-helpers";

const server = browserSync.create();

export const runLocalServer = (
  port: number,
  serveDir: string,
  openOnStart: boolean
) => {
  server.init({
    port: port,
    server: serveDir,
    open: openOnStart,
    ui: false,
    logLevel: "silent",
  });

  const onExit = () => {
    console.log(`Closing local server at port: ${port}...`);
    server.exit();
  };

  process.on("exit", onExit);
  onProcessSigInt();
};
