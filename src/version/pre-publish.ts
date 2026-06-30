import { isDevMode, WORKSPACE_PACKAGE_DIRS } from "../common";
import * as path from "path";
import { setVersionToAllPackages } from "./set";

const REPO_ROOT = path.join(__dirname, "../..");

async function getPackageVersion(pkgName: string): Promise<string> {
  const pkgPath = path.join(REPO_ROOT, pkgName, "package.json");
  const pkgJson = await Bun.file(pkgPath).json();
  return pkgJson.version;
}

async function replaceWorkspaceDependencies(pkgPath: string) {
  const pkgJson = await Bun.file(pkgPath).json();
  let modified = false;

  for (const section of [
    "dependencies",
    "devDependencies",
    "peerDependencies",
  ]) {
    if (pkgJson[section]) {
      for (const [dep, version] of Object.entries(pkgJson[section])) {
        if (version === "workspace:*" && dep.startsWith("@cyftec")) {
          const depPkgName = dep.replace("@cyftec/", "");
          pkgJson[section][dep] = await getPackageVersion(depPkgName);
          modified = true;
        }
      }
    }
  }

  if (modified) {
    await Bun.write(pkgPath, JSON.stringify(pkgJson, null, "  ") + "\n");
  }
  return modified;
}

export async function prePublishCleanup(targetVersion: string) {
  if (!(await isDevMode())) {
    console.log("Already in publish mode. No changes needed.");
    return;
  }
  await setVersionToAllPackages(targetVersion);

  console.log("Replacing workspace:* dependencies with actual versions...\n");
  const modifiedPackages: { pkgDirName: string; original: any }[] = [];

  for (const pkgDirName of WORKSPACE_PACKAGE_DIRS) {
    const pkgPath = path.join(REPO_ROOT, pkgDirName, "package.json");
    const originalPkgJson = await Bun.file(pkgPath).json();
    const modified = await replaceWorkspaceDependencies(pkgPath);

    if (modified) {
      modifiedPackages.push({ pkgDirName, original: originalPkgJson });
    }
  }

  const statePath = path.join(REPO_ROOT, ".publish-state.json");
  await Bun.write(
    statePath,
    JSON.stringify(modifiedPackages, null, "  ") + "\n",
  );
  console.log("✓ Workspace dependencies replaced");
  console.log("Run 'bun run version:post-publish' to restore after publishing");
}
