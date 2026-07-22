import { mkdir, mkdtemp } from "node:fs/promises";
import { tmpdir } from "node:os";
import path from "node:path";
import type { Karma } from "../src/probe/karma-probe/karma-types.ts";

export class ProcessExit extends Error {
  constructor(public readonly code: number) {
    super(`process.exit(${code})`);
  }
}

export const makeTempDir = () =>
  mkdtemp(path.join(tmpdir(), "brahma-test-"));

export const writeText = async (filePath: string, text: string) => {
  await mkdir(path.dirname(filePath), { recursive: true });
  await Bun.write(filePath, text);
};

export const makeKarma = (
  overrides: {
    appType?: Karma["maya"]["appType"];
    appViewDir?: string;
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
      buildableManifestFileName: "manifest.ts",
      stagingDir: "stage",
      publishDir: "prod",
      disposable: ["stage", ".vscode", "node_modules", "bun.lock", "package.json"],
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
  git: { ignore: ["node_modules", "stage", "package.json"] },
});

export const karmaModuleText = (karma: Karma) =>
  `export const karma: any = ${JSON.stringify(karma, null, 2).replace(
    '"maya":',
    "maya:",
  )};\n`;
