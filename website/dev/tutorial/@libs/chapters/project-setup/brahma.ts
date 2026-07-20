import { m } from "@cyftec/maya/core";
import { Article, Bullets, Code, Paragraphs, Section } from "../article";

export const Brahma = Article(
  m.H3({ class: "black", children: "Let Brahma build and serve" }),
  Paragraphs(
    "Brahma is Maya's Bun-first CLI. It is responsible for creating a scaffold, installing project files, building pages, watching source changes, and producing a deployable output.",
    "During stage, Brahma builds the app, watches the configured source directory, rebuilds after changes, and serves the staging folder with a local server.",
  ),
  Code(`brahma help
brahma stage
brahma publish
brahma reset
brahma uninstall`),
  Section(
    "A useful development loop",
    Bullets(
      "Edit a page or shared component inside dev.",
      "Run brahma stage to build and serve the current app.",
      "Open the printed localhost address and test the browser behavior.",
      "Run brahma publish when you want minified production output.",
    ),
  ),
  Code(
    "brahma stage  # build, watch, and serve\nbrahma publish # build production files",
  ),
);
