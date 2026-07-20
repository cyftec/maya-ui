import { m } from "@cyftec/maya/core";
import { Article, Bullets, Code, Note, Paragraphs, Section } from "../article";

export const FirstApp = Article(
  m.H3({ class: "black", children: "Create a Maya app" }),
  Paragraphs(
    "Brahma creates a ready-to-run Maya project from one command. The app name becomes the new folder, and the optional mode chooses the kind of project scaffold you want to start with.",
    "Start with a web app while learning. It is the smallest target: TypeScript source is built into static HTML, JavaScript, CSS, and assets for web.",
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
    "The 'brahma create' command creates the app scaffold in the mode you choose. The command 'brahma install' then creates the local package/config files from karma.ts and installs dependencies.",
  ),
  Code("brahma create hello-pwa --pwa\nbrahma create hello-extension --ext"),
);
