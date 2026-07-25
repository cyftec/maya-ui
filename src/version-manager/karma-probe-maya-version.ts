import { updateSectionInFile } from "../../brahma/src/utils/file-section-updater";
import { PROBE_KARMA_FILE_PATH } from "../common";

const updateKarmaProbeMayaVersion = async (
  version: string,
  karmaFilePath = PROBE_KARMA_FILE_PATH,
) => {
  console.log(`Updating karma probe with version ${version}`);
  const updatedSectionText = `{"@cyftec/maya": "${version}"}`;
  await updateSectionInFile(
    karmaFilePath,
    ["karma:", "maya:", "dependencies:"],
    updatedSectionText,
  );
};

export const verifyKarmProbeMayaVersion = async (
  version: string,
  karmaFilePath = PROBE_KARMA_FILE_PATH,
) => {
  console.log(`Verifying karma probe with version ${version}`);
  const karmaContent = await Bun.file(karmaFilePath).text();
  const hasVersion =
    karmaContent.includes(`"@cyftec/maya": "${version}"`) ||
    karmaContent.includes(`"@cyftec/maya":"${version}"`);

  if (!hasVersion)
    throw `Probe 'karma.ts' file doesn't contain this maya version - '${version}'`;
  else console.log(`Probe 'karma.ts' has maya version - '${version}'`);
};

export const updateAndVerifyMayaVersionsInKarmaProbe = async (
  targetVersion: string,
  karmaFilePath = PROBE_KARMA_FILE_PATH,
): Promise<void> => {
  await updateKarmaProbeMayaVersion(targetVersion, karmaFilePath);
  await verifyKarmProbeMayaVersion(targetVersion, karmaFilePath);
};
