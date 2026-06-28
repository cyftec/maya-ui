import { $ } from "bun";
import { WORKSPACE_PACKAGE_DIRS } from "../common";

await $`bun run ./src/version/pre-publish.ts`;
for (const pkgDirName of WORKSPACE_PACKAGE_DIRS) {
  console.log(`Publishing ${pkgDirName}...`);
  await $`cd ${pkgDirName} && bun publish --access public`;
}
await $`bun run ./src/version/post-publish.ts`;

console.log(`✓ All packages published and workspace dependencies restored.`);
