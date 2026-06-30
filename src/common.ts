import { $ } from "bun";
import * as path from "path";

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

async function hasWorkspaceDependency(pkgPath: string): Promise<boolean> {
  const pkgJson = await Bun.file(pkgPath).json();
  const depSections = [
    pkgJson.dependencies,
    pkgJson.devDependencies,
    pkgJson.peerDependencies,
  ];

  for (const section of depSections) {
    if (section) {
      for (const version of Object.values(section)) {
        if (version === "workspace:*") {
          return true;
        }
      }
    }
  }
  return false;
}

export async function isDevMode(): Promise<boolean> {
  const REPO_ROOT = path.join(__dirname, "..");
  const locationsOfInterest = [
    path.join(REPO_ROOT, "brahma", "package.json"),
    path.join(REPO_ROOT, "sample-maya-app", "package.json"),
  ];

  for (const pkgPath of locationsOfInterest) {
    if (await hasWorkspaceDependency(pkgPath)) {
      return true;
    }
  }
  return false;
}

export async function isPublishMode(): Promise<boolean> {
  return !(await isDevMode());
}
