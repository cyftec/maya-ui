import { getKarma } from "./common";
import { getKarmaPaths, getPackageJsonPath } from "./file-path-getters";
import { updateSectionInFile } from "./file-section-updater";
import { ValidateAndExitIf } from "./file-validations";

// karma.maya is equivalent to node's package.json
const karmaPackageJsonPathArray = ["karma:", "maya:"];

export const syncPackageJsonToKarma = async (appRootPath: string) => {
  ValidateAndExitIf.karmaFileMissing(appRootPath);
  ValidateAndExitIf.packageJsonMissing(appRootPath);

  const [karmaPath] = getKarmaPaths(appRootPath);
  const packageJsonPath = getPackageJsonPath(appRootPath);
  const packageJsonText = await Bun.file(packageJsonPath).text();
  await updateSectionInFile(
    karmaPath,
    karmaPackageJsonPathArray,
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
    karmaPackageJsonPathArray,
    karmaPackageJsonText,
  );
};
