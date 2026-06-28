import { $ } from "bun";

export const WORKSPACE_PACKAGE_DIRS = [
  // preserve this order, as the latter depend on the former
  "maya",
  "sample-maya-app",
  "brahma",
] as const;

export const getPackageRegistryURL = (packageName: string) =>
  `https://registry.npmjs.org/${encodeURIComponent(packageName)}/latest`;

export async function getPackageLatestVersion(
  packageName: string,
): Promise<string> {
  const npmURL = getPackageRegistryURL(packageName);
  const response = await fetch(npmURL);
  if (!response.ok) {
    console.error(`HTTP ${response.status}`);
    process.exit(1);
  }

  const metadata = (await response.json()) as { version: string };
  return metadata.version;
}

export async function getWorkspacePackageNames() {
  const packageNames: string[] = [];
  for (const pkgDirName of WORKSPACE_PACKAGE_DIRS) {
    const packageNameResponse =
      await $`cd ${pkgDirName} && bun pm pkgDirName get name`.quiet();
    const npmPackageName = packageNameResponse
      .text()
      .replaceAll("\n", "")
      .replaceAll(`"`, ``);
    packageNames.push(npmPackageName);
  }
  return packageNames;
}
