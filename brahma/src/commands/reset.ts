import { copyFile, exists, rm, rename } from "node:fs/promises";
import path from "node:path";
import { getKarma } from "../common/utils.ts";

export const resetApp = async () => {
  const cwd = process.cwd();
  console.log(`Resetting 'karma.ts' file...`);

  try {
    const karma = await getKarma(cwd);
    if (!karma) {
      console.log(`ERROR: 'karma.ts' file is missing in current directory.
  - 'brhm reset' is used when 'karma.ts' file exists but is corrupted.`);
      process.exit(1);
    }
    const srcKarmaPath = path.resolve(__dirname, "../example/karma.ts");
    const srcKarmaTypesPath = path.resolve(
      __dirname,
      "../example/karma-types.ts"
    );
    const destKarmaTempPath = `${cwd}/karma.temp.ts`;
    const destKarmaTypesTempPath = `${cwd}/karma-types.temp.ts`;
    if (await exists(destKarmaTempPath)) {
      await rm(destKarmaTempPath);
    }
    if (await exists(destKarmaTypesTempPath)) {
      await rm(destKarmaTypesTempPath);
    }
    await copyFile(srcKarmaPath, destKarmaTempPath);
    await copyFile(srcKarmaTypesPath, destKarmaTypesTempPath);

    const destKarmaPath = `${cwd}/karma.ts`;
    const destKarmaTypesPath = `${cwd}/karma-types.ts`;
    if (await exists(destKarmaPath)) {
      await rm(destKarmaPath);
    }
    if (await exists(destKarmaTypesPath)) {
      await rm(destKarmaTypesPath);
    }
    await rename(destKarmaTempPath, destKarmaPath);
    await rename(destKarmaTypesTempPath, destKarmaTypesPath);
  } catch (error) {
    console.log(error);
    process.exit(1);
  }

  process.exit();
};
