import { APP_MODE_DEPENDENCIES_MAP } from "../utils/constants";
import { updateSectionInFile } from "../utils/file-section-updater";
import type { AppMode } from "./probe/base-karma/types";

export async function transformWebKarmaToNonWebKarma(
  appType: Exclude<AppMode, "web">,
  targetKarmaPath: string,
) {
  if (
    !targetKarmaPath.endsWith("/karma.ts") ||
    !(await Bun.file(targetKarmaPath).exists())
  ) {
    throw `Invalid karma path provided - '${targetKarmaPath}'`;
  }

  const appTypeDeps = APP_MODE_DEPENDENCIES_MAP[appType];
  let content = await Bun.file(targetKarmaPath).text();

  content = content
    .replace(`appType:"web"`, `appType: "${appType}"`)
    .replace(`appType: "web"`, `appType: "${appType}"`);
  content = content
    .replace(`appViewDir: "dev/view/pages"`, `appViewDir: "dev"`)
    .replace(`appViewDir:"dev/view/pages"`, `appViewDir: "dev"`);
  content = content
    .replace(`publishDir:"docs"`, `publishDir: "prod"`)
    .replace(`publishDir: "docs"`, `publishDir: "prod"`);
  await Bun.write(targetKarmaPath, content);

  const currVersion = content
    .split("dependencies:")[1]
    .split(`"@cyftec/maya":`)[1]
    .trim()
    .split(`"`)[1];
  const baseDeps = { "@cyftec/maya": currVersion };
  const deps = { ...baseDeps, ...appTypeDeps };
  await updateSectionInFile(
    targetKarmaPath,
    ["karma:", "maya:", "dependencies:"],
    JSON.stringify(deps),
  );

  console.log(`Updated _karma/karma.ts for ${appType}`);
}
