import { buildApp } from "../builder/build.ts";
import { getKarma } from "../common/utils.ts";

export const stageApp = async () => {
  const cwd = process.cwd();
  console.log(`Staging app...`);

  try {
    const karma = await getKarma(cwd);
    if (!karma) return false;
    const { config } = karma;
    await buildApp(cwd, config, false);
  } catch (error) {
    console.log(error);
    process.exit(1);
  }

  process.exit();
};
