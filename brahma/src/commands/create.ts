import { exists, mkdir, cp } from "node:fs/promises";
import path from "node:path";
import { NO_ARG_PROVIDED } from "../common/constants";

export const createApp = async (appDirName: string) => {
  const cwd = process.cwd();

  if (appDirName === NO_ARG_PROVIDED) {
    console.log(
      `ERROR: Project directory name missing.\nRun 'brhm help' for usage guide.`
    );
    process.exit(1);
  }

  const exampleAppPath = path.resolve(__dirname, "../example");
  const destAppDirPath = `${cwd}/${appDirName}`;
  if (await exists(destAppDirPath)) {
    console.log(`A directory with name '${appDirName}' already exists.`);
    process.exit(1);
  } else {
    console.log(`Creating app in '${appDirName}' directory.`);
  }

  await mkdir(appDirName);
  await cp(exampleAppPath, destAppDirPath, { recursive: true });
  console.log(`'${appDirName}' directory created.`);
  console.log(`
  Run following commands to start dev:

  cd ${appDirName}
  brhm install
  brhm stage
  `);
  process.exit();
};
