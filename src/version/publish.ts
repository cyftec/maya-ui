import { $ } from "bun";
import { WORKSPACE_PACKAGE_DIRS } from "../common";
import { prePublishCleanup } from "./pre-publish";
import { verifyPublishState } from "./verify-publish";

const targetVersion = process.argv[2];
if (!targetVersion) {
  console.error("Usage: bun run version:set <version>");
  process.exit(1);
}

try {
  await prePublishCleanup(targetVersion);
} catch (error) {
  console.error("Error during pre-publish:", error);
  process.exit(1);
}
console.log(`✓ All workspace dependencies are set with original versions.`);

for (const pkgDirName of WORKSPACE_PACKAGE_DIRS) {
  console.log(`Publishing ${pkgDirName}...`);
  await $`cd ${pkgDirName} && bun publish --access public`;
}
await verifyPublishState(targetVersion);
console.log(`✓ All packages published.`);

try {
  await prePublishCleanup(targetVersion);
} catch (error) {
  console.error("Error during post-publish:", error);
  process.exit(1);
}
console.log(`✓ Workspace dependencies restored.`);
