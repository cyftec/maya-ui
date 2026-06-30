import * as path from "path";
import {
  DEPENDENT_PACKAGE_NAMES,
  REPO_ROOT,
  WORKSPACE_PACKAGE_DIRS,
} from "../common";
import { PackagePublishState } from "./publish-state-helper";

export async function updateVersionsInPackageJson(
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
      for (const key of Object.keys(pkgJson[depsType])) {
        if (DEPENDENT_PACKAGE_NAMES.includes(key)) {
          originalDeps[depsType] = {
            ...(originalDeps[depsType] || {}),
            [key]: "workspace:*",
          };
          pkgJson[depsType][key] = targetVersion;
        }
      }
    }
  }

  await Bun.write(pkgPath, JSON.stringify(pkgJson, null, "  ") + "\n");
  return originalDeps;
}

export async function modifyPackages(targetVersion: string) {
  const modifiedPackages: { pkgDirName: string; originalDeps: any }[] = [];
  for (const pkgDirName of WORKSPACE_PACKAGE_DIRS) {
    const pkgPath = path.join(REPO_ROOT, pkgDirName, "package.json");
    const originalDeps = await updateVersionsInPackageJson(
      pkgPath,
      targetVersion,
    );
    modifiedPackages.push({ pkgDirName, originalDeps });
  }

  return modifiedPackages;
}
