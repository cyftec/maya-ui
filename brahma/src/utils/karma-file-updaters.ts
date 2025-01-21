import { exists } from "node:fs/promises";
import { updateFileSection } from "./file-section-updater";
import { nonCachedImport } from "./common";
import type { Karma } from "../probes/karma/karma-types";

export const syncPackageJsonToKarma = async (appRootPath: string) => {
  const pjPath = `${appRootPath}/package.json`;
  if (!(await exists(pjPath))) {
    throw `'package.json' file missing.`;
  }

  const karmaPath = `${appRootPath}/karma.ts`;
  const pjText = await Bun.file(pjPath).text();
  const karmaPjSplitter = "packageJson:";
  await updateFileSection(karmaPath, pjText, karmaPjSplitter);
};

export const addPackageDepToKarma = async (
  karmaPath: string,
  dependency: object
) => {
  const { config } = (await nonCachedImport(karmaPath)) as Karma;
  const karmaPackageJson = {
    ...config.packageJson,
    dependencies: { ...config.packageJson.dependencies, ...dependency },
  };
  const karmaPjSplitter = "packageJson:";
  const karmaPackageJsonText = JSON.stringify(karmaPackageJson, null, "\t");
  await updateFileSection(karmaPath, karmaPackageJsonText, karmaPjSplitter);
};
