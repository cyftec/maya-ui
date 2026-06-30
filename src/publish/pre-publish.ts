import * as path from "path";
import { isDevMode, REPO_ROOT, WORKSPACE_PACKAGE_DIRS } from "../common";
import {
  PackagePublishState,
  updatePublishState,
} from "./publish-state-helper";
import { updateVersionsInPackageJson } from "./set-version";

export async function prePublishCleanup(targetVersion: string) {
  if (await isDevMode()) {
    console.error(`Change mode from 'dev' to 'publish' first.`);
    process.exit(1);
  }
  console.log("Already in publish mode. No changes needed.");
  console.log("Replacing workspace:* dependencies with actual versions...\n");

  const modifiedPackages: PackagePublishState[] = [];
  for (const pkgDirName of WORKSPACE_PACKAGE_DIRS) {
    const pkgPath = path.join(REPO_ROOT, pkgDirName, "package.json");
    const originalDeps = await updateVersionsInPackageJson(
      pkgPath,
      targetVersion,
    );
    modifiedPackages.push({ dirName: pkgDirName, originalDeps });
  }

  await updatePublishState(modifiedPackages);
  console.log("✓ Workspace dependencies replaced with original");
}
