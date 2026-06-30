import * as path from "path";
import {
  DEPENDABLE_PACKAGE_NAMES,
  WORKSPACE_PACKAGE_DIRS,
  isDevMode,
  REPO_ROOT,
} from "../common";
import {
  PackagePublishState,
  updatePublishState,
} from "./publish-state-helper";
import { updateKarmaProbeMayaVersion } from "../../brahma/src/probe/karma-version-updatore";

async function updateVersionsInKarmaProbe(targetVersion: string) {
  try {
    await updateKarmaProbeMayaVersion(targetVersion);
  } catch (error) {
    console.error(error);
    process.exit(1);
  }
}

async function updateVersionsInPackageJson(
  pkgPath: string,
  targetVersion: string,
): Promise<PackagePublishState["originalDeps"]> {
  const pkgJson = await Bun.file(pkgPath).json();
  const originalDeps: PackagePublishState["originalDeps"] = {
    dependencies: {},
    devDependencies: {},
    peerDependencies: {},
  };

  pkgJson["version"] = targetVersion;
  const depTypes: (keyof PackagePublishState["originalDeps"])[] = [
    "dependencies",
    "devDependencies",
    "peerDependencies",
  ];
  for (const depsType of depTypes) {
    if (pkgJson[depsType]) {
      for (const pkgName of Object.keys(pkgJson[depsType])) {
        if (DEPENDABLE_PACKAGE_NAMES.includes(pkgName)) {
          originalDeps[depsType] = {
            ...(originalDeps[depsType] || {}),
            [pkgName]: "workspace:*",
          };
          pkgJson[depsType][pkgName] = targetVersion;
        }
      }
    }
  }

  await Bun.write(pkgPath, JSON.stringify(pkgJson, null, "  ") + "\n");
  return originalDeps;
}

export async function prePublishCleanup(targetVersion: string) {
  if (await isDevMode()) {
    console.error(`Change mode from 'dev' to 'publish' first.`);
    process.exit(1);
  }

  console.log("Replacing workspace:* dependencies with actual versions...\n");
  const modifiedPackages: PackagePublishState[] = [];
  for (const pkgDirName of WORKSPACE_PACKAGE_DIRS) {
    const pkgPath = path.join(REPO_ROOT, pkgDirName, "package.json");
    await updateVersionsInKarmaProbe(targetVersion);
    const originalDeps = await updateVersionsInPackageJson(
      pkgPath,
      targetVersion,
    );
    modifiedPackages.push({ dirName: pkgDirName, originalDeps });
  }

  await updatePublishState(modifiedPackages);
  console.log("✓ Workspace dependencies replaced with original");
}
