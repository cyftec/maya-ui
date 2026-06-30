import { $ } from "bun";
import { isDevMode, isPublishMode } from "../common";

const updatePackageJson = async (packageJsonObject: any) => {
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
