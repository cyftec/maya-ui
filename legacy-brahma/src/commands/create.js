import { cp } from "node:fs/promises";
import { createDirIfNotExists, execAsync, getPath } from "../libs/index.js";

const copySampleApp = async () => {
  const probeAppDir = getPath("../probe/sample-app");
  const localAppDir = `${process.cwd()}`;
  await cp(probeAppDir, localAppDir, { recursive: true });
};

export const registerCreate = (cli) => {
  cli
    .command("create <appName>")
    .description("Creates a new maya app")
    .action(async (appName) => {
      await createDirIfNotExists(appName);
      const appDir = `${process.cwd()}/${appName}`;
      process.chdir(appDir);
      console.log(`Installing files in '${appDir}' directory...`);
      await copySampleApp();
      await execAsync("brahma install");
      process.chdir("../");
      console.log(
        `Follow the instructions above for dev setup.\nHappy hacking :)`
      );
    });
};
