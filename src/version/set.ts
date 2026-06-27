import { $ } from "bun";
import { REPO_PACKAGES } from "../constants";

const version = process.argv[2];
if (!version) {
  console.error("Usage: bun run version:set <version>");
  process.exit(1);
}

for (const pkg of REPO_PACKAGES) {
  console.log(`Updating ${pkg} -> ${version}`);
  await $`cd ${pkg} && bun pm pkg set version=${version}`;
}

console.log(`✓ Updated all packages to ${version}`);
