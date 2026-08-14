import { m } from "@cyftec/maya/core";
import { Article, Bullets, Code, Paragraphs, Section } from "../article";

export const Brahma = Article(
  m.H3({ class: "black", children: "Let Brahma build and serve" }),
  Paragraphs(
    "Brahma is Maya's Bun-first CLI. It creates scaffolds, installs generated project files, builds pages, compiles NoCSS, watches source changes, and produces deployable output.",
    "During stage, Brahma clears the NoCSS registry, statically builds the pages, generates the used stylesheet, watches the configured source directory, and serves the staging folder.",
  ),
  Code(`brahma help
brahma stage
brahma publish
brahma reset
brahma reset --stylesheet
brahma uninstall`),
  Section(
    "A useful development loop",
    Bullets(
      "Edit a page or shared component inside dev.",
      "Express every application class through the typed NoCSS css helper.",
      "Run brahma stage to build and serve the current app.",
      "Open the printed localhost address and test the browser behavior.",
      "Run brahma publish when you want minified production output.",
    ),
  ),
  Code(
    "brahma stage  # build, watch, and serve\nbrahma publish # build production files",
  ),
);
