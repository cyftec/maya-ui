import { $, sleep } from "bun";
import { WORKSPACE_PACKAGE_DIRS } from "../common";

export const getPackageRegistryURL = (packageName: string) =>
  `https://registry.npmjs.org/${encodeURIComponent(packageName)}/latest`;

export async function getPackageLatestPublishedVersion(
  packageName: string,
): Promise<string> {
  console.log(`Checking published version for - ${packageName}`);
  const npmURL = getPackageRegistryURL(packageName);
  const response = await fetch(npmURL);
  if (!response.ok) {
    console.error(`HTTP ${response.status}`);
    process.exit(1);
  }

  const metadata = (await response.json()) as { version: string };
  const version = metadata.version;
  console.log(`${packageName} latest version - ${version}`);
  return version;
}

export async function verifyPublishState() {
  const POLL_INTERVAL_MS = 5000;
  const POLL_INTERVAL_SEC = Math.round(POLL_INTERVAL_MS / 1000);
  const TIMEOUT_MS = 12000;
  const start = Date.now();
  let targetVersion = "";

  while (Date.now() - start < TIMEOUT_MS) {
    let success = true;

    for (const dirName of WORKSPACE_PACKAGE_DIRS) {
      const pkg = await $`cd ${dirName} && bun pm pkg get name version`.quiet();
      const stdout =
        typeof pkg.stdout === "string"
          ? pkg.stdout
          : new TextDecoder().decode(pkg.stdout);

      let pkgJson: unknown;
      try {
        pkgJson = JSON.parse(stdout);
      } catch {
        console.error(`Bun couldn't parse the package info for '${dirName}'`);
        process.exit(1);
      }

      if (
        !pkgJson ||
        typeof pkgJson !== "object" ||
        Array.isArray(pkgJson) ||
        !Object.keys(pkgJson).every((key) => ["name", "version"].includes(key))
      ) {
        console.error(`Bun couldn't get the package for '${dirName}'`);
        process.exit(1);
      }

      const { name, version } = pkgJson as {
        name: string;
        version: string;
      };

      if (targetVersion && targetVersion !== version) {
        console.error(`Looks like all packages are not at the same version.`);
        console.error(
          `Found one version - ${targetVersion} and version of '${dirName}' is ${version}`,
        );
        process.exit(1);
      }

      targetVersion = version;

      const publishedVersion = await getPackageLatestPublishedVersion(name);
      console.log(`${dirName}: ${publishedVersion || "--"}`);
      if (publishedVersion !== version) {
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
