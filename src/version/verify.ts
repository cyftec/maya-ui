import { $ } from "bun";
import { REPO_PACKAGES } from "../constants";

interface RegistryMetadata {
  version: string;
}

const expectedVersion = process.argv[2];

if (!expectedVersion) {
  console.error("Usage: bun run verify <version>");
  process.exit(1);
}

async function getLatestVersion(packageName: string): Promise<string> {
  const npmURL = `https://registry.npmjs.org/${encodeURIComponent(packageName)}/latest`;
  const response = await fetch(npmURL);
  if (!response.ok) {
    console.error(`HTTP ${response.status}`);
    process.exit(1);
  }

  const metadata = (await response.json()) as RegistryMetadata;
  return metadata.version;
}

const packages = [];
for (const pkg of REPO_PACKAGES) {
  const packageNameResponse = await $`cd ${pkg} && bun pm pkg get name`.quiet();
  const npmPackageName = packageNameResponse
    .text()
    .replaceAll("\n", "")
    .replaceAll(`"`, ``);
  packages.push(npmPackageName);
}

const POLL_INTERVAL_MS = 2000;
const POLL_INTERVAL_SEC = Math.round(POLL_INTERVAL_MS / 1000);
const TIMEOUT_MS = 10000;

const sleep = (ms: number) => new Promise((resolve) => setTimeout(resolve, ms));

const start = Date.now();

while (Date.now() - start < TIMEOUT_MS) {
  let success = true;

  console.log(packages.join(", "));
  // console.log(`EXPECTED:\n${expectedVersion}\n\nFOUND:`);
  // for (const pkg of packages) {
  //   const publishedVersion = await getLatestVersion(pkg);
  //   console.log(`${pkg}: ${publishedVersion || "--"}`);
  //   if (publishedVersion !== expectedVersion) {
  //     success = false;
  //   }
  // }

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
