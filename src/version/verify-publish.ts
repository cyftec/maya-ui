import { sleep } from "bun";
import { getPackageLatestVersion, getWorkspacePackageNames } from "../common";

const expectedVersion = process.argv[2];

if (!expectedVersion) {
  console.error("Usage: bun run verify <version>");
  process.exit(1);
}

const POLL_INTERVAL_MS = 2000;
const POLL_INTERVAL_SEC = Math.round(POLL_INTERVAL_MS / 1000);
const TIMEOUT_MS = 10000;

const start = Date.now();
const workspacePackageNames = await getWorkspacePackageNames();
while (Date.now() - start < TIMEOUT_MS) {
  let success = true;

  console.log(workspacePackageNames.join(", "));
  console.log(`EXPECTED:\n${expectedVersion}\n\nFOUND:`);
  for (const pkgDirName of workspacePackageNames) {
    const publishedVersion = await getPackageLatestVersion(pkgDirName);
    console.log(`${pkgDirName}: ${publishedVersion || "--"}`);
    if (publishedVersion !== expectedVersion) {
      success = false;
    }
  }

  if (success) {
    console.log(`✅ All packages are published at version ${expectedVersion}.`);
    process.exit(0);
  }

  console.log(`\nNPM can take a while to reflect latest published versions.`);
  console.log(`Retrying after ${POLL_INTERVAL_SEC} seconds...\n\n`);
  await sleep(POLL_INTERVAL_MS);
}

console.error(
  `❌ Timed out after ${TIMEOUT_MS / 1000}s waiting for version ${expectedVersion}.`,
);

process.exit(1);
