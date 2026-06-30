import { $ } from "bun";
import { WORKSPACE_PACKAGE_DIRS } from "../common";

export async function setVersionToAllPackages(targetVersion: string) {
  for (const pkgDirName of WORKSPACE_PACKAGE_DIRS) {
    console.log(`Updating ${pkgDirName} -> ${targetVersion}`);
    await $`cd ${pkgDirName} && bun pm pkg set version=${targetVersion}`;
  }

  console.log(`✓ Updated all packages to ${targetVersion}`);
}
