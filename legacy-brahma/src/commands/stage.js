import { existsSync } from "node:fs";
import { execAsync, getPortNumber, instructions } from "../libs/index.js";

export const registerStage = (cli) => {
  cli
    .command("stage")
    .description("Builds the app in 'stage' mode for dev and testing")
    .option("-il, --ignore-logs", "stages the app without showing logs", true)
    .action(async (options) => {
      if (!existsSync(".brahma")) {
        throw new Error(`The sub-directory '.brahma' does not exist or is corrupted.
          \nIf this is a valid Maya app directory, run 'brahma install' command or create new maya app altogether\n\nError,`);
      }
      const portNumber = await getPortNumber();
      const appBrahmaDir = `${process.cwd()}/.brahma`;
      process.chdir(appBrahmaDir);
      await execAsync("bun run stage", options.ignoreLogs);
      process.chdir("../");
      console.log(
        `App is staged for dev and testing. Follow below instructions, ${instructions(
          process.cwd(),
          portNumber
        )}`
      );
    });
};
