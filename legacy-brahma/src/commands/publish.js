import { existsSync } from "node:fs";
import { execAsync } from "../libs/index.js";

export const registerPublish = (cli) => {
  cli
    .command("publish")
    .description("Builds static files for production version of the app")
    .action(async () => {
      if (!existsSync(".brahma")) {
        throw new Error(`The sub-directory '.brahma' does not exist or is corrupted.
          \nIf this is a valid Maya app directory, run 'brahma install' command or create new maya app altogether\n\nError,`);
      }
      const appBrahmaDir = `${process.cwd()}/.brahma`;
      process.chdir(appBrahmaDir);
      await execAsync("bun run publish");
      process.chdir("../");
      console.log("App published successfully");
    });
};
