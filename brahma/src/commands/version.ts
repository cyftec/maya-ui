import path from "node:path";
import { config } from "../sample-app/karma";

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
  const packageJsonPath = `${cliRootPath}/package.json`;
  const brahmaPackageJsonText = await Bun.file(packageJsonPath).text();
  const brahmaV = getPackageVersion(brahmaPackageJsonText);
  console.log(`brahma v${brahmaV}`);
  console.log(`maya   v${config.packageJson.dependencies["@mufw/maya"]}`);
  process.exit();
};
