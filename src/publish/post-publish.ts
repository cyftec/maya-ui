import * as path from "path";
import { REPO_ROOT, WORKSPACE_PACKAGE_DIRS } from "../common";
import {
  updateAndVerifyMayaVersionsInKarmaProbe,
  updateAndVerifyVersionsInPackageJson,
} from "../version-manager";

type PostPublishResetOptions = {
  repoRoot?: string;
  packageDirs?: readonly string[];
  updatePackageJson?: typeof updateAndVerifyVersionsInPackageJson;
  updateKarmaProbe?: typeof updateAndVerifyMayaVersionsInKarmaProbe;
};

export async function postPublishReset({
  repoRoot = REPO_ROOT,
  packageDirs = WORKSPACE_PACKAGE_DIRS,
  updatePackageJson = updateAndVerifyVersionsInPackageJson,
  updateKarmaProbe = updateAndVerifyMayaVersionsInKarmaProbe,
}: PostPublishResetOptions = {}) {
  const WORKSPACE_VERSION = "workspace:*";
  console.log(
    `Replacing original dependencies with '${WORKSPACE_VERSION}' versions...\n`,
  );
  for (const pkgDirName of packageDirs) {
    const pkgPath = path.join(repoRoot, pkgDirName, "package.json");
    await updatePackageJson(pkgPath, WORKSPACE_VERSION);
    await updateKarmaProbe(WORKSPACE_VERSION);
  }

  console.log(
    `✓ Workspace dependencies reset back with version - ${WORKSPACE_VERSION}`,
  );
}
