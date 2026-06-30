import * as path from "path";
import { isDevMode, REPO_ROOT } from "../common";
import { disposePublishState, getPublishedState } from "./publish-state-helper";

export async function postPublishReset() {
  if (await isDevMode()) {
    console.error(`This should not be reached is already in 'dev' mode.`);
    process.exit(1);
  }

  try {
    const modifiedPackages = await getPublishedState();
    for (const { dirName, originalDeps } of modifiedPackages) {
      const pkgPath = path.join(REPO_ROOT, dirName, "package.json");
      const updatedPkg = await Bun.file(pkgPath).json();
      Object.entries(originalDeps).forEach(([depName, depsObject]) => {
        Object.entries(depsObject).forEach(([pkgName, version]) => {
          updatedPkg[depName][pkgName] = version;
        });
      });
      await Bun.write(pkgPath, JSON.stringify(updatedPkg, null, "  ") + "\n");
    }
  } catch {
    console.log("No publish state found. Nothing to restore.");
  }
}
