// import { readdir } from "node:fs/promises";

const getPackageVersion = (packageJsonText: string) =>
  packageJsonText
    .split(`"version"`)[1]
    .split(",")[0]
    .trim()
    .slice(1)
    .trim()
    .replaceAll(`"`, "");

export const showVersion = async () => {
  const brahmaPackageJsonText = await Bun.file("package.json").text();
  const mayaPackageJsonText = await Bun.file(
    "node_modules/maya/package.json"
  ).text();
  const brahmaV = getPackageVersion(brahmaPackageJsonText);
  const mayaV = getPackageVersion(mayaPackageJsonText);
  console.log(`brahma v${brahmaV}\nmaya   v${mayaV}`);
  process.exit();
};
