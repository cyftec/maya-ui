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

export const isDevMode = (pkg: any) =>
  !pkg?.bin?.brahma && !!pkg?.bin?.devbrahma;

export const isPublishMode = (pkg: any) =>
  !!pkg?.bin?.brahma && !pkg?.bin?.devbrahma;

export const updatePackageJson = async (packageJsonObject: any) => {
  await Bun.write(
    "./brahma/package.json",
    JSON.stringify(packageJsonObject, null, "  ") + "\n",
  );
};

export const setPackageMode = async (mode: "dev" | "publish") => {
  const pkg = await Bun.file("./brahma/package.json").json();
  const brahmaIndexFile = "./src/index.ts";

  if (!["dev", "publish"].includes(mode))
    throw `Incorrect mode '${mode}' provided.`;
  if (mode === "dev" && isDevMode(pkg))
    console.warn(`It is already '${mode}' mode.`);
  if (mode === "publish" && isPublishMode(pkg))
    console.warn(`It is already '${mode}' mode.`);

  if (mode === "dev") {
    pkg.bin.dvbrm = brahmaIndexFile;
    delete pkg.bin.brahma;
  }
  if (mode === "publish") {
    pkg.bin.brahma = brahmaIndexFile;
    delete pkg.bin.dvbrm;
  }

  await updatePackageJson(pkg);
};

export const getCurrentBrahmaVersion = async () => {
  try {
    const globalBun = (await $`bun pm bin -g`.text()).replaceAll("\n", "");
    const v = await $`${globalBun}/brahma v`.text();
    const version = v
      .split("- ")[1]
      .replaceAll("\n", " ")
      .split(" ")[0]
      .replace("v", "");
    console.log(version);
    return version;
  } catch (error) {
    console.log(error);
    return "";
  }
};
