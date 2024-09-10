import { execAsync } from "../libs/index.js";

export const registerAnythingElse = (cli) => {
  cli.action(async () => {
    console.log(`Command provided to 'brahma' is either empty or incorrect.\n`);
    await execAsync("brahma -h");
  });
};
