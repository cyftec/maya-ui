import { exists } from "node:fs/promises";
import type { KarmaConfigObject } from "../probes/karma/karma-types";
import { getKarma, getKarmaPaths, nonCachedImport } from "./common";
import { updateSectionInFile } from "./file-section-updater";

// karma.maya is equivalent to node's package.json
const karmaPackageJsonSplitters = ["karma:", "maya:"];

export const syncPackageJsonToKarma = async (appRootPath: string) => {
  const packageJsonPath = `${appRootPath}/package.json`;
  if (!(await exists(packageJsonPath))) {
    throw `'package.json' file missing.`;
  }

  const [karmaPath] = getKarmaPaths(appRootPath);
  const packageJsonText = await Bun.file(packageJsonPath).text();
  await updateSectionInFile(
    karmaPath,
    karmaPackageJsonSplitters,
    packageJsonText,
  );
};

export const addPackageDepToKarma = async (
  appRootPath: string,
  dependency: object,
) => {
  const [karmaPath] = getKarmaPaths(appRootPath);
  const karma = await getKarma(appRootPath);
  const karmaPackageJson = {
    ...karma.maya,
    dependencies: { ...karma.maya.dependencies, ...dependency },
  };
  const karmaPackageJsonText = JSON.stringify(karmaPackageJson, null, "\t");
  await updateSectionInFile(
    karmaPath,
    karmaPackageJsonSplitters,
    karmaPackageJsonText,
  );
};
