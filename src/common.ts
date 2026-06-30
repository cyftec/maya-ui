import { $ } from "bun";
import * as path from "path";

export type ProjectMode = "dev" | "publish";

export const REPO_ROOT = path.join(__dirname, "..");

export const WORKSPACE_PACKAGE_DIRS = [
  // preserve this order, as the latter depend on the former
  "maya",
  "sample-maya-app",
  "brahma",
] as const;

export const DEPENDABLE_PACKAGE_NAMES = [
  "@cyftec/maya",
  "@cyftec/sample-maya-app",
] satisfies string[];

export const getBrahmaPackageJsonPath = () =>
  path.join(REPO_ROOT, "brahma", "package.json");

export const getCurrentGlobalBrahmaVersion = async () => {
  try {
    const globalBun = (await $`bun pm bin -g`.text()).replaceAll("\n", "");
    const v = await $`${globalBun}/brahma v`.text();
    const version = v
      .split("- ")[1]
      .replaceAll("\n", " ")
      .split(" ")[0]
      .replace("v", "");
    console.log(`Global 'brahma' version - ${version}`);
    return version;
  } catch (error) {
    console.log(error);
    return "";
  }
};

// TODO: Block any dev or changes during publish mode
export const setProjectMode = async (mode: ProjectMode) => {
  const brahmaPackageJsonPath = getBrahmaPackageJsonPath();
  const pkg = await Bun.file(brahmaPackageJsonPath).json();
  const brahmaIndexFile = "./src/index.ts";

  if (!["dev", "publish"].includes(mode))
    throw `Incorrect mode '${mode}' provided.`;
  if (mode === "dev" && (await isDevMode()))
    console.warn(`It is already '${mode}' mode.`);
  if (mode === "publish" && (await isPublishMode()))
    console.warn(`It is already '${mode}' mode.`);

  if (mode === "dev") {
    pkg.bin.dvbrm = brahmaIndexFile;
    delete pkg.bin.brahma;
  }
  if (mode === "publish") {
    pkg.bin.brahma = brahmaIndexFile;
    delete pkg.bin.dvbrm;
  }

  const pkgJsonString = JSON.stringify(pkg, null, "  ") + "\n";
  await Bun.write(brahmaPackageJsonPath, pkgJsonString);
};

export async function isDevMode(): Promise<boolean> {
  const brahmaPackageJsonPath = getBrahmaPackageJsonPath();
  const pkg = await Bun.file(brahmaPackageJsonPath).json();
  return !!pkg?.bin?.dvbrm;
}

export async function isPublishMode(): Promise<boolean> {
  return !(await isDevMode());
}

export async function hasUncommittedChanges() {}
