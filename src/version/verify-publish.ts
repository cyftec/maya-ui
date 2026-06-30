import { sleep } from "bun";
import { getPackageLatestVersion, getWorkspacePackageNames } from "../common";

export async function verifyPublishState(targetVersion: string) {
  if (!targetVersion) {
    console.error("Usage: bun run verify <version>");
    process.exit(1);
  }

  const POLL_INTERVAL_MS = 5000;
  const POLL_INTERVAL_SEC = Math.round(POLL_INTERVAL_MS / 1000);
  const TIMEOUT_MS = 12000;

  const start = Date.now();
  const workspacePackageNames = await getWorkspacePackageNames();
  while (Date.now() - start < TIMEOUT_MS) {
    let success = true;

    console.log(workspacePackageNames.join(", "));
    console.log(`EXPECTED:\n${targetVersion}\n\nFOUND:`);
    for (const pkgDirName of workspacePackageNames) {
      const publishedVersion = await getPackageLatestVersion(pkgDirName);
      console.log(`${pkgDirName}: ${publishedVersion || "--"}`);
      if (publishedVersion !== targetVersion) {
        success = false;
      }
    }

    if (success) {
      console.log(`✅ All packages are published at version ${targetVersion}.`);
      return;
    }

    console.log(`\nNPM can take a while to reflect latest published versions.`);
    console.log(`Retrying after ${POLL_INTERVAL_SEC} seconds...\n\n`);
    await sleep(POLL_INTERVAL_MS);
  }

  console.error(
    `❌ Timed out after ${TIMEOUT_MS / 1000}s waiting for version ${targetVersion}.`,
  );

  process.exit(1);
}
