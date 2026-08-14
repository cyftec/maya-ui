import { mkdir, mkdtemp } from "node:fs/promises";
import { tmpdir } from "node:os";
import path from "node:path";
import type { Karma } from "../src/probe-helpers";

export class ProcessExit extends Error {
  constructor(public readonly code: number) {
    super(`process.exit(${code})`);
  }
}

export const makeTempDir = () => mkdtemp(path.join(tmpdir(), "brahma-test-"));

export const writeText = async (filePath: string, text: string) => {
  await mkdir(path.dirname(filePath), { recursive: true });
  await Bun.write(filePath, text);
};

export const makeKarma = (
  overrides: {
    appType?: Karma["maya"]["appType"];
    appViewDir?: string;
    assetsDirName?: string;
    reloadPageOnFocus?: boolean;
    skipErrorAndBuildNext?: boolean;
  } = {},
): Karma => ({
  brahma: {
    build: {
      appSrcDir: "dev",
      appViewDir: overrides.appViewDir || "dev/view",
      skipErrorAndBuildNext: overrides.skipErrorAndBuildNext || false,
      ignoreDelimiter: "@",
      buildablePageFileName: "page.ts",
      buildableStylesheetFileName: "styles.ts",
      assetsDirName: overrides.assetsDirName || "assets",
      buildableManifestFileName: "manifest.ts",
      stagingDir: "stage",
      publishDir: "prod",
      disposable: [
        "stage",
        ".vscode",
        ".zed",
        "node_modules",
        "bun.lock",
        "package.json",
      ],
    },
    serve: {
      port: 0,
      redirectOnStart: false,
      reloadPageOnFocus: overrides.reloadPageOnFocus || false,
      watchDir: "dev",
      serveDir: "stage",
    },
  },
  maya: {
    name: "fixture-app",
    appType: overrides.appType || "web",
    dependencies: { "@cyftec/maya": "workspace:*" },
  },
  vscode: {
    settings: {
      "deno.enable": false,
      "files.exclude": { stage: false, node_modules: true },
    },
  },
  zed: {
    settings: {
      file_scan_exclusions: ["node_modules"],
      file_scan_inclusions: ["stage"],
    },
  },
  git: { ignore: ["node_modules", "stage", "package.json", ".zed"] },
});

export const karmaModuleText = (karma: Karma) =>
  `export const karma: any = ${JSON.stringify(karma, null, 2).replace(
    '"maya":',
    "maya:",
  )};\n`;
