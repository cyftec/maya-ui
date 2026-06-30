import { updateSectionInFile } from "../utils/file-section-updater";
import path from "node:path";

export const updateKarmaProbeMayaVersion = async (version: string) => {
  console.log(`Updateing karma probe with version ${version}`);
  const karmaFilePath = path.join(__dirname, "karma-probe", "karma.ts");
  const updatedSectionText = `{"@cyftec/maya": "${version}"}`;
  await updateSectionInFile(
    karmaFilePath,
    ["karma:", "maya:", "dependencies:"],
    updatedSectionText,
  );
  const updatedKarmaProbeFileContent = await Bun.file(karmaFilePath).text();
  const updateSuccessful =
    updatedKarmaProbeFileContent.includes(updatedSectionText);
  if (!updateSuccessful) {
    console.log(updatedKarmaProbeFileContent);
    throw `Update of probe 'karma.ts' file failed.`;
  }
};
