import { m } from "@cyftec/maya/core";
import { Article, Code, Note, Paragraphs, Section } from "../article";

export const Karma = Article(
  m.H3({ class: "black", children: "Configure the project in karma.ts" }),
  Paragraphs(
    "Karma is a TypeScript object exported from _karma/karma.ts. It is the source Brahma reads for source and output paths, page and stylesheet names, package metadata, editor settings, Git ignores, and the generated TypeScript configuration.",
    "Generated package.json and tsconfig.json are disposable projections of Karma. Change the typed Karma source, then run brahma install to synchronize them.",
  ),
  Code(`import type { Karma } from "./types.js";

export const karma: Karma = {
  brahma: {
    build: {
      appSrcDir: "dev",
      appViewDir: "dev/view/pages",
      buildablePageFileName: "page.ts",
      buildableStylesheetFileName: "styles.ts",
      assetsDirName: "assets",
      buildableManifestFileName: "manifest.ts",
      ignoreDelimiter: "@",
      stagingDir: "stage",
      publishDir: "docs",
      skipErrorAndBuildNext: false,
      disposable: ["stage", "node_modules"],
    },
    serve: {
      port: 3000,
      redirectOnStart: true,
      reloadPageOnFocus: false,
      watchDir: "dev",
      serveDir: "stage",
    },
  },
  maya: {
    name: "hello-maya",
    appType: "web",
    dependencies: { "@cyftec/maya": "0.1.4" },
    devDependencies: {
      "@types/bun": "^1.3.14",
      typescript: "7.0.2",
    },
  },
  git: { ignore: ["stage", "node_modules"] },
  vscode: { settings: { "deno.enable": false, "files.exclude": {} } },
  zed: { settings: { file_scan_exclusions: [] } },
  tsconfig: {
    compilerOptions: {
      lib: ["ESNext", "DOM", "DOM.Iterable"],
      target: "ESNext",
      module: "ESNext",
      moduleResolution: "Bundler",
      moduleDetection: "force",
      allowImportingTsExtensions: true,
      isolatedModules: true,
      noEmit: true,
      strict: true,
      skipLibCheck: true,
      forceConsistentCasingInFileNames: true,
      noErrorTruncation: true,
      noFallthroughCasesInSwitch: true,
      noPropertyAccessFromIndexSignature: true,
      noUncheckedIndexedAccess: true,
      noUncheckedSideEffectImports: true,
      noUnusedLocals: true,
      noUnusedParameters: true,
      types: ["bun-types"],
    },
    include: ["_karma/**/*.ts", "dev/**/*.ts"],
  },
};`),
  Section(
    "The important distinction",
    Note(
      "_karma/karma.ts is the source configuration. package.json, tsconfig.json, .gitignore, VS Code settings, and Zed settings are generated or synchronized from it. TypeScript is pinned exactly to 7.0.2; do not replace it with a range or downgrade it to hide an error.",
    ),
  ),
);
