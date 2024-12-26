import { existsSync } from "node:fs";
import {
  execAsync,
  syncNodeModulesSymlink,
  syncKarmaWithNpmDeps,
} from "../libs/index.js";

export const registerRemovePackage = (cli) => {
  cli
    .command("remove")
    .argument(
      "<packageName>",
      "npm package name to be removed from app dependecnies"
    )
    .description("Removes the npm package from the app")
    .action(async (packageName) => {
      if (!existsSync(".brahma")) {
        throw new Error(`The sub-directory '.brahma' does not exist or is corrupted.
          \nIf this is a valid Maya app directory, run 'brahma install' command or create new maya app altogether\n\nError,`);
      }
      const appBrahmaDir = `${process.cwd()}/.brahma`;
      process.chdir(appBrahmaDir);
      await execAsync(`bun remove ${packageName}`);
      process.chdir("../");
      await syncNodeModulesSymlink();
      await syncKarmaWithNpmDeps();
    });
};
