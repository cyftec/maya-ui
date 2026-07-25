export const DEPENDABLE_PACKAGE_NAMES = ["@cyftec/maya"] satisfies string[];

async function updateVersionsInPackageJson(
  pkgPath: string,
  targetVersion: string,
): Promise<void> {
  const pkgJson = await Bun.file(pkgPath).json();

  pkgJson["version"] = targetVersion;
  const depTypes = ["dependencies", "devDependencies", "peerDependencies"];
  for (const depsType of depTypes) {
    if (pkgJson[depsType]) {
      for (const pkgName of Object.keys(pkgJson[depsType])) {
        if (DEPENDABLE_PACKAGE_NAMES.includes(pkgName)) {
          pkgJson[depsType][pkgName] = targetVersion;
        }
      }
    }
  }

  await Bun.write(pkgPath, JSON.stringify(pkgJson, null, "  ") + "\n");
}

export async function verifyVersionsInPackageJson(
  pkgPath: string,
  targetVersion: string,
): Promise<void> {
  const pkgJson = await Bun.file(pkgPath).json();

  pkgJson["version"] = targetVersion;
  const depTypes = ["dependencies", "devDependencies", "peerDependencies"];
  for (const depsType of depTypes) {
    if (pkgJson[depsType]) {
      for (const pkgName of Object.keys(pkgJson[depsType])) {
        if (DEPENDABLE_PACKAGE_NAMES.includes(pkgName)) {
          if (pkgJson[depsType][pkgName] !== targetVersion) {
            throw `${depsType}["${pkgName}"] in '${pkgPath}' found this version - '${pkgJson[depsType][pkgName]}' instead of '${targetVersion}'`;
          }
        }
      }
    }
  }

  console.log(
    `All types of dependencies inside '${pkgPath}' contain the version ${targetVersion} correctly.`,
  );
}

export const updateAndVerifyVersionsInPackageJson = async (
  packageJsonPath: string,
  targetVersion: string,
): Promise<void> => {
  await updateVersionsInPackageJson(packageJsonPath, targetVersion);
  await verifyVersionsInPackageJson(packageJsonPath, targetVersion);
};
