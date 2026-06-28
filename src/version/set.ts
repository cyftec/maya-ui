import { $ } from "bun";
import { WORKSPACE_PACKAGE_DIRS } from "../common";

const version = process.argv[2];
if (!version) {
  console.error("Usage: bun run version:set <version>");
  process.exit(1);
}

for (const pkgDirName of WORKSPACE_PACKAGE_DIRS) {
  console.log(`Updating ${pkgDirName} -> ${version}`);
  await $`cd ${pkgDirName} && bun pm pkg set version=${version}`;
}

console.log(`✓ Updated all packages to ${version}`);
