import { $ } from "bun";
import { isDevMode, WORKSPACE_PACKAGE_DIRS } from "../common";
import { prePublishCleanup } from "./pre-publish";
import { verifyPublishState } from "./verify-version";
import { postPublishReset } from "./post-publish";

const targetVersion = process.argv[2];
if (!targetVersion) {
  console.warn("Version is missing");
  console.error("Usage: bun run publish <version>");
  process.exit(1);
}

if (await isDevMode()) {
  console.error(`Publishing of packages should happen only in 'publish' mode.`);
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
await Bun.sleep(8000);
await verifyPublishState();
console.log(`✓ All packages published.`);

try {
  await postPublishReset();
} catch (error) {
  console.error("Error during post-publish:", error);
  process.exit(1);
}
console.log(`✓ Workspace dependencies restored.`);
