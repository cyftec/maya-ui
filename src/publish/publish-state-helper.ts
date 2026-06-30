import { REPO_ROOT } from "../common";
import path from "node:path";

export type PackagePublishState = {
  dirName: string;
  originalDeps: {
    dependencies: {};
    devDependencies: {};
    peerDependencies: {};
  };
};

const PUBLISH_STATE_JSON_PATH = path.join(REPO_ROOT, ".publish-state.json");

export const updatePublishState = async (
  modifiedPackages: PackagePublishState[],
) => {
  await Bun.write(
    PUBLISH_STATE_JSON_PATH,
    JSON.stringify(modifiedPackages, null, "  ") + "\n",
  );
};

export const getPublishedState = async () => {
  const modifiedPackages: PackagePublishState[] = await Bun.file(
    PUBLISH_STATE_JSON_PATH,
  ).json();
  return modifiedPackages;
};

export const disposePublishState = async () => {
  await Bun.file(PUBLISH_STATE_JSON_PATH).delete();
};
