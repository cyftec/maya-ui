import * as path from "path";
import {
  REPO_ROOT,
  WORKSPACE_PACKAGE_DIRS,
  hasUncommittedChanges,
} from "../common";
import {
  updateAndVerifyMayaVersionsInKarmaProbe,
  updateAndVerifyVersionsInPackageJson,
} from "../version-manager";

type PrePublishCleanupOptions = {
  repoRoot?: string;
  packageDirs?: readonly string[];
  hasChanges?: typeof hasUncommittedChanges;
  updatePackageJson?: typeof updateAndVerifyVersionsInPackageJson;
  updateKarmaProbe?: typeof updateAndVerifyMayaVersionsInKarmaProbe;
  exit?: typeof process.exit;
};

export async function prePublishCleanup(
  targetVersion: string,
  {
    repoRoot = REPO_ROOT,
    packageDirs = WORKSPACE_PACKAGE_DIRS,
    hasChanges = hasUncommittedChanges,
    updatePackageJson = updateAndVerifyVersionsInPackageJson,
    updateKarmaProbe = updateAndVerifyMayaVersionsInKarmaProbe,
    exit = process.exit,
  }: PrePublishCleanupOptions = {},
) {
  if (await hasChanges()) {
    console.error(`Changes need to be commited first before publish.`);
    exit(1);
  }

  console.log("Replacing workspace:* dependencies with actual versions...\n");
  await updateKarmaProbe(targetVersion);
  for (const pkgDirName of packageDirs) {
    const pkgPath = path.join(repoRoot, pkgDirName, "package.json");
    await updatePackageJson(pkgPath, targetVersion);
  }

  console.log(
    `✓ Workspace dependencies replaced with version - ${targetVersion}`,
  );
}
