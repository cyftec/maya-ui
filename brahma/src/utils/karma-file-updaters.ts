import { getKarmaPaths, getPackageJsonPath } from "./file-path-getters";
import { updateSectionInFile } from "./file-section-updater";
import { ValidateAndExitIf } from "./file-validations";

// karma.maya is equivalent to node's package.json
const karmaPackageJsonPathArray = ["karma:", "maya:"];

export const syncPackageJsonToKarma = async (appRootPath: string) => {
  await ValidateAndExitIf.karmaFileMissing(appRootPath);
  await ValidateAndExitIf.packageJsonMissing(appRootPath);

  const [karmaPath] = getKarmaPaths(appRootPath);
  const packageJsonPath = getPackageJsonPath(appRootPath);
  const packageJsonText = await Bun.file(packageJsonPath).text();
  await updateSectionInFile(
    karmaPath,
    karmaPackageJsonPathArray,
    packageJsonText,
  );
};
