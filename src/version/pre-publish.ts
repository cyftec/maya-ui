import { $ } from "bun";
import { WORKSPACE_PACKAGE_DIRS } from "../common";
import * as fs from "fs-extra";
import * as path from "path";

console.log("Replacing workspace:* dependencies with actual versions...");

const REPO_ROOT = path.join(__dirname, "../..");

async function getPackageVersion(pkgName: string): Promise<string> {
  const pkgPath = path.join(REPO_ROOT, pkgName, "package.json");
  const pkgJson = await fs.readJson(pkgPath);
  return pkgJson.version;
}

async function replaceWorkspaceDependencies(pkgPath: string) {
  const pkgJson = await fs.readJson(pkgPath);
  let modified = false;

  // Replace workspace:* in dependencies
  if (pkgJson.dependencies) {
    for (const [dep, version] of Object.entries(pkgJson.dependencies)) {
      if (version === "workspace:*" && dep.startsWith("@cyftec")) {
        const depPkgName = dep.replace("@cyftec/", "");
        const actualVersion = await getPackageVersion(depPkgName);
        pkgJson.dependencies[dep] = actualVersion;
        modified = true;
        console.log(`  Replaced ${dep}: workspace:* -> ${actualVersion}`);
      }
    }
  }

  // Replace workspace:* in devDependencies
  if (pkgJson.devDependencies) {
    for (const [dep, version] of Object.entries(pkgJson.devDependencies)) {
      if (version === "workspace:*" && dep.startsWith("@cyftec")) {
        const depPkgName = dep.replace("@cyftec/", "");
        const actualVersion = await getPackageVersion(depPkgName);
        pkgJson.devDependencies[dep] = actualVersion;
        modified = true;
        console.log(`  Replaced ${dep}: workspace:* -> ${actualVersion}`);
      }
    }
  }

  // Replace workspace:* in peerDependencies
  if (pkgJson.peerDependencies) {
    for (const [dep, version] of Object.entries(pkgJson.peerDependencies)) {
      if (version === "workspace:*" && dep.startsWith("@cyftec")) {
        const depPkgName = dep.replace("@cyftec/", "");
        const actualVersion = await getPackageVersion(depPkgName);
        pkgJson.peerDependencies[dep] = actualVersion;
        modified = true;
        console.log(`  Replaced ${dep}: workspace:* -> ${actualVersion}`);
      }
    }
  }

  if (modified) {
    await fs.writeJson(pkgPath, pkgJson, { spaces: 2 });
    return true;
  }
  return false;
}

async function restoreWorkspaceDependencies(
  pkgPath: string,
  originalPkgJson: any,
) {
  await fs.writeJson(pkgPath, originalPkgJson, { spaces: 2 });
}

async function main() {
  console.log("Preparing packages for publishing...");
  console.log("Replacing workspace:* dependencies with actual versions\n");

  const modifiedPackages: { pkgDirName: string; original: any }[] = [];

  for (const pkgDirName of WORKSPACE_PACKAGE_DIRS) {
    const pkgPath = path.join(REPO_ROOT, pkgDirName, "package.json");
    const originalPkgJson = await fs.readJson(pkgPath);

    console.log(`Processing ${pkgDirName}...`);
    const modified = await replaceWorkspaceDependencies(pkgPath);

    if (modified) {
      modifiedPackages.push({ pkgDirName, original: originalPkgJson });
    }
  }

  console.log("\n✓ Workspace dependencies replaced");
  console.log(
    "Modified packages:",
    modifiedPackages.map((p) => p.pkgDirName).join(", "),
  );

  // Save the state for restoration after publish
  const statePath = path.join(REPO_ROOT, ".publish-state.json");
  await fs.writeJson(statePath, modifiedPackages, { spaces: 2 });
  console.log(`\nState saved to ${statePath}`);
  console.log(
    "Run 'bun run version:post-publish' to restore workspace:* dependencies after publishing",
  );
}

main().catch((error) => {
  console.error("Error during pre-publish:", error);
  process.exit(1);
});
