import path from "node:path";

const getPackageVersion = (packageJsonText: string) =>
  packageJsonText
    .split(`"version"`)[1]
    .split(",")[0]
    .trim()
    .slice(1)
    .trim()
    .replaceAll(`"`, "");

export const showVersion = async () => {
  const cliRootPath = path.resolve(__dirname, "../../");
  const brahmaPackageJsonText = await Bun.file(
    `${cliRootPath}/package.json`
  ).text();
  const mayaPackageJsonText = await Bun.file(
    `${cliRootPath}/node_modules/@mufw/maya/package.json`
  ).text();
  const brahmaV = getPackageVersion(brahmaPackageJsonText);
  const mayaV = getPackageVersion(mayaPackageJsonText);
  console.log(`brahma v${brahmaV}\nmaya   v${mayaV}`);
  process.exit();
};
