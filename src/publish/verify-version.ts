import { $, sleep } from "bun";
import { WORKSPACE_PACKAGE_DIRS } from "../common";

export const getPackageRegistryURL = (packageName: string) =>
  `https://registry.npmjs.org/${encodeURIComponent(packageName)}/latest`;

export async function getPackageLatestPublishedVersion(
  packageName: string,
  fetchMetadata: typeof fetch = fetch,
  exit: typeof process.exit = process.exit,
): Promise<string> {
  console.log(`Checking published version for - ${packageName}`);
  const npmURL = getPackageRegistryURL(packageName);
  const response = await fetchMetadata(npmURL);
  if (!response.ok) {
    console.error(`HTTP ${response.status}`);
    exit(1);
  }

  const metadata = (await response.json()) as { version: string };
  const version = metadata.version;
  console.log(`${packageName} latest version - ${version}`);
  return version;
}

type PackageInfo = {
  name: string;
  version: string;
};

type VerifyPublishStateOptions = {
  packageDirs?: readonly string[];
  pollIntervalMs?: number;
  timeoutMs?: number;
  now?: () => number;
  sleepFor?: typeof sleep;
  getPackageInfo?: (dirName: string) => Promise<PackageInfo>;
  getPublishedVersion?: (packageName: string) => Promise<string>;
  exit?: typeof process.exit;
};

const getPackageInfoFromBun = async (
  dirName: string,
  exit: typeof process.exit,
): Promise<PackageInfo> => {
  const pkg = await $`cd ${dirName} && bun pm pkg get name version`.quiet();
  const stdout =
    typeof pkg.stdout === "string"
      ? pkg.stdout
      : new TextDecoder().decode(pkg.stdout);

  return parsePackageInfo(dirName, stdout, exit);
};

export const parsePackageInfo = (
  dirName: string,
  stdout: string,
  exit: typeof process.exit = process.exit,
): PackageInfo => {
  let pkgJson: unknown;
  try {
    pkgJson = JSON.parse(stdout);
  } catch {
    console.error(`Bun couldn't parse the package info for '${dirName}'`);
    exit(1);
  }

  if (
    !pkgJson ||
    typeof pkgJson !== "object" ||
    Array.isArray(pkgJson) ||
    !Object.keys(pkgJson).every((key) => ["name", "version"].includes(key))
  ) {
    console.error(`Bun couldn't get the package for '${dirName}'`);
    exit(1);
  }

  return pkgJson as PackageInfo;
};

export async function verifyPublishState({
  packageDirs = WORKSPACE_PACKAGE_DIRS,
  pollIntervalMs = 5000,
  timeoutMs = 12000,
  now = Date.now,
  sleepFor = sleep,
  getPackageInfo,
  getPublishedVersion = getPackageLatestPublishedVersion,
  exit = process.exit,
}: VerifyPublishStateOptions = {}) {
  const POLL_INTERVAL_MS = pollIntervalMs;
  const POLL_INTERVAL_SEC = Math.round(POLL_INTERVAL_MS / 1000);
  const TIMEOUT_MS = timeoutMs;
  const start = now();
  let targetVersion = "";

  while (now() - start < TIMEOUT_MS) {
    let success = true;

    for (const dirName of packageDirs) {
      const { name, version } = getPackageInfo
        ? await getPackageInfo(dirName)
        : await getPackageInfoFromBun(dirName, exit);

      if (targetVersion && targetVersion !== version) {
        console.error(`Looks like all packages are not at the same version.`);
        console.error(
          `Found one version - ${targetVersion} and version of '${dirName}' is ${version}`,
        );
        exit(1);
      }

      targetVersion = version;

      const publishedVersion = await getPublishedVersion(name);
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
    await sleepFor(POLL_INTERVAL_MS);
  }

  console.error(
    `❌ Timed out after ${TIMEOUT_MS / 1000}s waiting for version ${targetVersion}.`,
  );

  exit(1);
}
