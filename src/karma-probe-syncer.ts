import { $ } from "bun";
import { updateSectionInFile } from "../brahma/src/utils/file-section-updater";

const SOURCE_DIR = "brahma/src/probe/karma-probe";
const TARGET_BASE_DIR = "sample-maya-app/apps";

const APP_CONFIGS = {
  ext: { "@types/chrome": "0.0.297" },
  pwa: { "@types/web-app-manifest": "1.0.8" },
  web: {},
};

async function copyFile(source: string, target: string) {
  const content = await Bun.file(source).text();
  await Bun.write(target, content);
  console.log(`Copied ${source} -> ${target}`);
}

async function updateKarmaFile(appType: keyof typeof APP_CONFIGS) {
  const appTypeDeps = APP_CONFIGS[appType];
  const targetKarmaPath = `${TARGET_BASE_DIR}/${appType}/karma.ts`;
  let content = await Bun.file(targetKarmaPath).text();

  // Replace appType with "ext" | "pwa" | "web"
  content = content.replace(`appType: "web"`, `appType: "${appType}"`);
  if (appType === "web") {
    // Set appViewDir to 'dev/view' for "web" app type
    content = content.replace(`appViewDir: "dev"`, `appViewDir: "dev/view"`);
    // Set publishDir to 'docs' for "web" app type
    content = content.replace(`publishDir: "prod"`, `publishDir: "docs"`);
  }
  await Bun.write(targetKarmaPath, content);

  // Replace deps with specific deps for each type
  const karmaProbeContent = await Bun.file(
    "brahma/src/probe/karma-probe/karma.ts",
  ).text();
  const currVersion = karmaProbeContent
    .split("dependencies:")[1]
    .split(`"@cyftec/maya":`)[1]
    .trim()
    .split(`"`)[1];
  const baseDeps = { "@cyftec/maya": currVersion };
  const deps = appType === "web" ? baseDeps : { ...baseDeps, ...appTypeDeps };

  await updateSectionInFile(
    targetKarmaPath,
    ["karma:", "maya:", "dependencies:"],
    JSON.stringify(deps),
  );

  console.log(`Updated karma.ts for ${appType}`);
}

export async function syncKarmaFilesToSampleApps() {
  console.log("Starting karma file synchronization...");

  // Copy karma-types.ts to all three directories
  for (const appType of ["ext", "pwa", "web"] as const) {
    await copyFile(
      `${SOURCE_DIR}/karma-types.ts`,
      `${TARGET_BASE_DIR}/${appType}/karma-types.ts`,
    );
  }

  // Copy karma.ts to all three directories first
  for (const appType of ["ext", "pwa", "web"] as const) {
    await copyFile(
      `${SOURCE_DIR}/karma.ts`,
      `${TARGET_BASE_DIR}/${appType}/karma.ts`,
    );
  }

  // Update karma.ts files with app-specific configurations
  for (const appType of ["ext", "pwa", "web"] as const) {
    await updateKarmaFile(appType);
  }

  console.log("Karma file synchronization completed!");
}
