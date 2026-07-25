import path from "path";
import { PROBE_KARMA_FILE_PATH } from "../common";
import type { KarmaConfigObject } from "../../brahma/src/probe-helpers/probe/base-karma/types";

export const verifyProbeAppsMayaVersion = async (
  version: string,
  karmaFilePath = PROBE_KARMA_FILE_PATH,
) => {
  console.log(`Verifying karma probe with version ${version}`);
  const appKarmaPath = path.resolve(karmaFilePath);
  const { karma } = (await import(`${appKarmaPath}?t=${Date.now()}`)) as KarmaConfigObject;
  const foundVersion = karma.maya.dependencies["@cyftec/maya"];
  if (foundVersion !== `${version}`) {
    throw `Version in karma probe found to be ${foundVersion}.\nVersion expected: ${version}`;
  }
  console.log(`Karma probe has version ${version} updated.`);
};
