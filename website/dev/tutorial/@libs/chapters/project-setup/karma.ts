import { m } from "@cyftec/maya/core";
import { Article, Code, Note, Paragraphs, Section } from "../article";

export const Karma = Article(
  m.H3({ class: "black", children: "Configure the project in karma.ts" }),
  Paragraphs(
    "Karma is a TypeScript object exported from the project root. It is the one place Brahma reads to learn where source lives, how pages are named, where builds go, and which package metadata to install.",
    "Because karma.ts is TypeScript, you can define a shared files object, reuse variables, and get editor type checking instead of editing a large JSON file.",
  ),
  Code(`import type { Karma } from "./karma-types";

export const karma: Karma = {
  brahma: {
    build: {
      appSrcDir: "dev",
      appViewDir: "dev/view",
      buildablePageFileName: "page.ts",
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
    dependencies: { "@cyftec/maya": "0.0.11" },
  },
  git: { ignore: ["stage", "node_modules"] },
  vscode: { settings: { "deno.enable": false, "files.exclude": {} } },
};`),
  Section(
    "The important distinction",
    Note(
      "karma.ts is the uber-level source configuration. The package.json, .gitignore, and VS Code settings are generated or synchronized using this file by Brahma commands.",
    ),
  ),
);
