import { isPublishMode } from "../common";
import * as path from "path";

const REPO_ROOT = path.join(__dirname, "../..");

export async function postPublishReset() {
  if (!(await isPublishMode())) {
    console.log("Already in dev mode. No changes needed.");
    return;
  }

  const statePath = path.join(REPO_ROOT, ".publish-state.json");

  try {
    const modifiedPackages = await Bun.file(statePath).json();

    for (const { pkgDirName, original } of modifiedPackages) {
      const pkgPath = path.join(REPO_ROOT, pkgDirName, "package.json");
      await Bun.write(pkgPath, JSON.stringify(original, null, "  ") + "\n");
    }

    await Bun.file(statePath).delete();
    console.log("✓ Workspace dependencies restored");
  } catch {
    console.log("No publish state found. Nothing to restore.");
  }
}
