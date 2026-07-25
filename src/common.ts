import { $ } from "bun";
import * as path from "path";

export type ProjectMode = "dev" | "publish";

export const REPO_ROOT = path.join(__dirname, "..");
export const PROBE_KARMA_FILE_PATH = path.join(
  REPO_ROOT,
  "brahma",
  "src",
  "probe-helpers",
  "probe",
  "base-karma",
  "karma.ts",
);

// preserve this order, as the latter depend on the former
export const WORKSPACE_PACKAGE_DIRS = ["maya", "brahma"] as const;

export async function hasUncommittedChanges(
  getStatus = async () => {
    const result = await $`git status --porcelain`.quiet();
    return result.stdout.toString();
  },
  exit: typeof process.exit = process.exit,
) {
  try {
    return (await getStatus()).trim().length > 0;
  } catch (error) {
    console.error(error);
    exit(1);
  }
}
