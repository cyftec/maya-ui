import { $ } from "bun";

const SOURCE_DIR = "brahma/src/probe/karma-probe";
const TARGET_BASE_DIR = "sample-maya-app/apps";

const APP_CONFIGS = {
  ext: {
    appViewDir: "dev",
    publishDir: "prod",
    name: "sample-chrome-extension",
    appType: "ext",
    dependencies: { "@cyftec/maya": "workspace:*", "@types/chrome": "0.0.297" },
  },
  pwa: {
    appViewDir: "dev",
    publishDir: "prod",
    name: "sample-pwa",
    appType: "pwa",
    dependencies: {
      "@cyftec/maya": "workspace:*",
      "@types/web-app-manifest": "1.0.8",
    },
  },
  web: {
    appViewDir: "dev/view",
    publishDir: "docs",
    name: "sample-app",
    appType: "web",
    dependencies: { "@cyftec/maya": "workspace:*" },
  },
};

async function copyFile(source: string, target: string) {
  const content = await Bun.file(source).text();
  await Bun.write(target, content);
  console.log(`Copied ${source} -> ${target}`);
}

async function updateKarmaFile(appType: keyof typeof APP_CONFIGS) {
  const config = APP_CONFIGS[appType];
  const targetKarmaPath = `${TARGET_BASE_DIR}/${appType}/karma.ts`;

  let content = await Bun.file(targetKarmaPath).text();

  // Update appViewDir in the files object
  content = content.replace(
    /buildable: \{[\s\S]*?appViewDir: "[^"]+",/,
    (match) =>
      match.replace(
        /appViewDir: "[^"]+",/,
        `appViewDir: "${config.appViewDir}",`,
      ),
  );

  // Update publishDir in the static object
  content = content.replace(/static: \{[\s\S]*?publishDir: "[^"]+",/, (match) =>
    match.replace(
      /publishDir: "[^"]+",/,
      `publishDir: "${config.publishDir}",`,
    ),
  );

  // Update maya section
  const depsEntries = Object.entries(config.dependencies)
    .map(([key, value]) => `      "${key}": "${value}"`)
    .join(",\n");

  content = content.replace(
    /maya: \{[\s\S]*?\n  \},/,
    `maya: {
    name: "${config.name}",
    appType: "${config.appType}",
    dependencies: {
${depsEntries},
    },
  },`,
  );

  await Bun.write(targetKarmaPath, content);
  console.log(`Updated karma.ts for ${appType}`);
}

async function syncKarmaFiles() {
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

export async function syncIfKarmaFilesChange() {
  // Check for changes in karma files
  const karmaProbeFilesMap = {
    karma: "brahma/src/probe/karma-probe/karma.ts",
    karmaTypes: "brahma/src/probe/karma-probe/karma-types.ts",
  };
  const karmaProbeFiles = Object.values(karmaProbeFilesMap);

  const proc = Bun.spawn(
    ["git", "diff", "--cached", "--name-only", ...karmaProbeFiles],
    {
      cwd: process.cwd(),
      stdout: "pipe",
    },
  );

  const reader = proc.stdout.getReader();
  const { value: output } = await reader.read();
  const changedFiles = new TextDecoder()
    .decode(output)
    .trim()
    .split("\n")
    .filter(Boolean);

  if (changedFiles.length) {
    console.log(`Syncing karma files...`);
    try {
      await syncKarmaFiles();
    } catch (error) {
      console.error("Error during karma file synchronization:", error);
      process.exit(1);
    }
    console.log(`Karma files synced successfully.`);
    console.log(`Running 'git add .' again to unclude synced files.`);
    await $`git add .`;
  }
}
