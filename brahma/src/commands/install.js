import { existsSync } from "node:fs";
import { copyFile, cp, rename } from "node:fs/promises";
import {
  execAsync,
  getPath,
  installKarma,
  syncNodeModulesSymlink,
} from "../libs/index.js";

const copyBaseFiles = async () => {
  const probeVSCodeConfigDir = getPath("../probe/base-files");
  const localVSCodeConfigDir = `${process.cwd()}`;
  await cp(probeVSCodeConfigDir, localVSCodeConfigDir, { recursive: true });
  const npmrcFile = `${process.cwd()}/.brahma/npmrc`;
  const dotNpmrcFile = `${process.cwd()}/.brahma/.npmrc`;
  await rename(npmrcFile, dotNpmrcFile);
};

const createOldKarmaCopy = async () => {
  const localKarmaFile = `${process.cwd()}/karma.mjs`;
  const oldKarmaFile = `${process.cwd()}/.brahma/old-karma.mjs`;
  await copyFile(localKarmaFile, oldKarmaFile);
};

export const registerInstall = (cli) => {
  cli
    .command("install")
    .description("Installs the packages and files based on karma config")
    .option(
      "-r, --refresh",
      "install packages and files after deleting and re-installing the base files"
    )
    .action(async (options) => {
      if (!existsSync(".brahma") || options.refresh) {
        await copyBaseFiles();
        await createOldKarmaCopy();
      }
      await installKarma();
      const appBrahmaDir = `${process.cwd()}/.brahma`;
      process.chdir(appBrahmaDir);
      console.log("Running 'brahma install'.\nInstalling packages...");
      await execAsync("bun i");
      process.chdir("../");
      await syncNodeModulesSymlink();
      await execAsync("brahma stage");
    });
};
