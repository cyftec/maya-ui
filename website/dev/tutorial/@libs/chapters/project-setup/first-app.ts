import { m } from "@cyftec/maya/core";
import { Article, Bullets, Code, Note, Paragraphs, Section } from "../article";

export const FirstApp = Article(
  m.H3({ class: "black", children: "Create a Maya app" }),
  Paragraphs(
    "Brahma creates a ready-to-run Maya project from one command. The app name becomes the new folder, and the optional mode chooses the kind of project scaffold you want to start with.",
    "Start with a web app while learning. TypeScript pages become static HTML and page JavaScript, while the typed NoCSS source becomes the generated application stylesheet.",
  ),
  Code("brahma create hello-maya"),
  m.H3({ class: "black", children: "Install and run" }),
  Paragraphs(
    "Run the below commands in terminal. It installs dependencies and then stages your app in watch mode for seeing the generated app UI and continously develop the app.",
  ),
  Code("cd hello-maya\nbrahma install\nbrahma stage"),
  Section(
    "Project modes",
    Bullets(
      "web — a normal web app with multiple page routes.",
      "pwa — a progressive-web-app (PWA) scaffold with a typed manifest, icons, and service-worker entry point.",
      "ext — a Chrome extension scaffold with a typed manifest, popup, content script, and service worker.",
    ),
  ),
  Note(
    "The 'brahma create' command creates the selected scaffold and installs its NoCSS probe. 'brahma install' creates local package/config files from _karma/karma.ts and installs dependencies. Run it before the first 'brahma stage' and whenever generated files or dependencies need synchronization.",
  ),
  Code("brahma create hello-pwa --pwa\nbrahma create hello-extension --ext"),
);
