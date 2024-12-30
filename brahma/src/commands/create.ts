import { exists, mkdir, cp } from "node:fs/promises";
import path from "node:path";

export const createApp = async (cmdArgs: string[]) => {
  const appDirName = cmdArgs[0];
  if (!appDirName) {
    console.log(
      `ERROR: Project directory name missing.\nRun 'brhm help' for usage guide.`
    );
    process.exit(1);
  }

  const cwd = process.cwd();
  const sampleAppPath = path.resolve(__dirname, "../sample-app");
  const destAppDirPath = `${cwd}/${appDirName}`;
  if (await exists(destAppDirPath)) {
    console.log(`A directory with name '${appDirName}' already exists.`);
    process.exit(1);
  } else {
    console.log(`Creating app in '${appDirName}' directory.`);
  }

  await mkdir(appDirName);
  await cp(sampleAppPath, destAppDirPath, { recursive: true });
  console.log(`'${appDirName}' directory created.`);
  console.log(`
  Run following commands to start dev:

  cd ${appDirName}
  brhm install
  brhm stage
  `);
  process.exit();
};
