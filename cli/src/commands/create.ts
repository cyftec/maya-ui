import { exists, mkdir, cp } from "node:fs/promises";
import path from "node:path";

const copySampleApp = async (projectPath: string) => {
  const sampleAppPath = path.resolve(__dirname, "../sample-app");
  await cp(sampleAppPath, projectPath, { recursive: true });
};

export const createApp = async (projectDirName: string) => {
  if (!projectDirName) {
    console.log(`App directory name missing. Provided: '${projectDirName}'.`);
    process.exit(1);
  }
  const projectPath = `${process.cwd()}/${projectDirName}`;
  if (await exists(projectPath)) {
    console.log(`A directory with name '${projectDirName}' already exists.`);
    process.exit(1);
  } else {
    console.log(`Creating app in '${projectDirName}' directory.`);
  }

  await mkdir(projectDirName);
  await copySampleApp(projectPath);
  console.log(`'${projectDirName}' directory created.`);
  console.log(`
  Run following commands to start dev:

  cd ${projectDirName}
  brm install
  brm stage
  `);
  process.exit();
};
