import { exec as nodeExec } from "node:child_process";
import util from "node:util";

const execute = util.promisify(nodeExec);

export const execAsync = async (shellCommand, ignoreLogs) => {
  try {
    const { stdout } = await execute(shellCommand);
    if (!ignoreLogs) {
      console.log(stdout);
    }
  } catch (err) {
    console.log(err);
  }
};

export const replaceAll = (str, pattern, replaceWith) => {
  if (str.includes(pattern))
    return replaceAll(
      str.replaceAll(pattern, replaceWith),
      pattern,
      replaceWith
    );
  else return str;
};

export const instructions = (rootDir, portNumber) => `
  - Open VSCode with root directory - ${rootDir}
  - Make sure below VS Code extensions are installed,
      • 'Live Server' (ritwickdey.LiveServer)
      • 'Run on Save' (emeraldwalk.RunOnSave)
  - If you installed the extensions just now, run 'brahma stage' command in the terminal
  - At VSCode bottombar, click on 'Go Live' button to run the Live Server extension
  - The app is being served at http://127.0.0.1:${portNumber}`;
