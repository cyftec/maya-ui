import { $ } from "bun";
import { REPO_PACKAGES } from "../constants";

for (const pkg of REPO_PACKAGES) {
  console.log(`Publishing ${pkg}...`);
  await $`cd ${pkg} && bun pm pkg get name version`;
}

console.log(`✓ All packages published.`);
