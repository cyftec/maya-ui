import * as fs from "fs-extra";
import * as path from "path";

const REPO_ROOT = path.join(__dirname, "../..");

async function main() {
  const statePath = path.join(REPO_ROOT, ".publish-state.json");

  if (!(await fs.pathExists(statePath))) {
    console.log("No publish state found. Nothing to restore.");
    return;
  }

  console.log("Restoring workspace:* dependencies after publishing...\n");

  const modifiedPackages = await fs.readJson(statePath);

  for (const { pkg, original } of modifiedPackages) {
    const pkgPath = path.join(REPO_ROOT, pkg, "package.json");
    console.log(`Restoring ${pkg}...`);
    await fs.writeJson(pkgPath, original, { spaces: 2 });
  }

  await fs.remove(statePath);
  console.log("\n✓ Workspace dependencies restored");
  console.log("Publish state file removed");
}

main().catch((error) => {
  console.error("Error during post-publish:", error);
  process.exit(1);
});
