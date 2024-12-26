import { build } from "../builder/build.ts";
import { getKarma } from "../common/utils.ts";

export const stageApp = async () => {
  console.log(`Staging app..`);

  try {
    const projectRootDirPath = process.cwd();
    const karma = await getKarma(projectRootDirPath);
    if (!karma) return false;
    const { config } = karma;
    const appRootDirPath = `${projectRootDirPath}/${config.app.appRootDirName}`;
    await build(appRootDirPath, projectRootDirPath, config);
  } catch (error) {
    console.log(error);
    process.exit(1);
  }

  process.exit();
};
