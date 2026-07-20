import { m } from "@cyftec/maya";
import { Article, Bullets, Code, Note, Paragraphs, Section } from "../../tutorial/@libs/chapters/article";

export const BrahmaKarmaMaya = Article(
  m.H3({ class: "black", children: "Three pieces, one workflow" }),
  Paragraphs(
    "Maya is the runtime that creates and updates DOM elements. Karma is the typed project configuration. Brahma is the CLI and builder that reads Karma and turns the source project into a runnable app.",
    "Keeping these roles separate makes the workflow easier to reason about: write UI with Maya, describe the project in karma.ts, and let Brahma build or serve it.",
  ),
  Code(`TypeScript pages + assets
          |
       karma.ts
          |
       Brahma
          |
  static HTML + JS + CSS
          |
        Maya runtime`),
  Bullets(
    "Maya: m.* factories, components, lifecycle events, and reactive DOM updates.",
    "Karma: build paths, route naming, serving options, package metadata, Git, and VS Code settings.",
    "Brahma: create, install, stage, publish, reset, and uninstall commands.",
  ),
);

export const WhyCli = Article(
  m.H3({ class: "black", children: "Why use a CLI?" }),
  Paragraphs(
    "A Maya app has a predictable build pipeline. Brahma packages that pipeline into short commands, so you do not have to manually copy scaffolds, configure a watcher, or remember how route files become output files.",
    "The CLI is deliberately small: it prepares the project and delegates UI authoring to normal TypeScript files.",
  ),
  Bullets(
    "Create a web, PWA, or extension scaffold.",
    "Install dependencies and generated project files from karma.ts.",
    "Build and serve a staging directory while watching source changes.",
    "Build minified static output for deployment.",
  ),
  Code("brahma help\nbrahma create my-app\nbrahma install\nbrahma stage\nbrahma publish"),
);

export const Create = Article(
  m.H3({ class: "black", children: "brahma create" }),
  Paragraphs(
    "create makes a new app directory from the matching sample scaffold. The first argument is the folder name; the optional flag selects web, pwa, or ext mode.",
  ),
  Code("brahma create my-app\nbrahma create my-pwa --pwa\nbrahma create my-extension --ext"),
  Note("create only prepares the source scaffold. Enter the folder and run brahma install before staging the app."),
  Code("cd my-app\nbrahma install\nbrahma stage"),
);

export const Install = Article(
  m.H3({ class: "black", children: "brahma install" }),
  Paragraphs(
    "With no package argument, install uses karma.ts to write package.json, .vscode/settings.json, and .gitignore, then runs bun install. This keeps generated project files aligned with the typed configuration.",
    "With a package argument, Brahma adds that package with Bun and synchronizes the resulting dependency back into karma.ts.",
  ),
  Code("brahma install\nbrahma install @cyftec/maya\nbrahma install lodash"),
);

export const Uninstall = Article(
  m.H3({ class: "black", children: "brahma uninstall" }),
  Paragraphs(
    "uninstall is the reverse of install. With a package argument it removes that dependency and updates karma.ts. Without one, it removes installed packages and generated project files according to the app configuration.",
  ),
  Code("brahma uninstall lodash\nbrahma uninstall"),
  Note("Use version control before resetting or removing generated files if you need to recover local changes."),
);

export const Publish = Article(
  m.H3({ class: "black", children: "brahma publish" }),
  Paragraphs(
    "publish builds the app using the production flag. Brahma writes to brahma.build.publishDir and minifies the generated page JavaScript. A web app can then be served by a static host such as a CDN or GitHub Pages.",
    "The command does not start the development server; it produces the files you deploy.",
  ),
  Code("brahma publish\n# output location comes from karma.brahma.build.publishDir"),
);

export const Reset = Article(
  m.H3({ class: "black", children: "brahma reset" }),
  Paragraphs(
    "reset restores karma.ts from the base scaffold. A soft reset preserves the app mode; a hard reset returns to the base web configuration. Changes made to karma.ts can be lost, so check version control first.",
  ),
  Code("brahma reset\nbrahma reset --hard"),
  Note("Reset changes configuration source. It does not replace your page implementation files."),
);

export const SignalImplementation = Article(
  m.H3({ class: "black", children: "Maya's signal integration" }),
  Paragraphs(
    "Maya does not implement a second signal system. It re-exports @cyftec/signal through @cyftec/maya/signal and uses the same primitives internally for reactive attributes, children, derived values, and effects.",
    "The important Maya behavior is where those signals connect: each element stores the effects associated with its attributes and children, and those effects are disposed when the element unmounts.",
  ),
  Code(`import { signal, derive, effect } from "@cyftec/maya/signal";

const count = signal(0);
const doubled = derive(() => count.value * 2);

effect(() => console.log(doubled.value));`),
  Note("Use the public Maya signal import in app code. The dependency package supplies the implementation; Maya supplies the DOM integration."),
);

export const DefaultHtmlPage = Article(
  m.H3({ class: "black", children: "The default HTML page" }),
  Paragraphs(
    "A page is a Maya HTML getter with head metadata, a body, and the page-local script emitted by Brahma. The script must be deferred so the static DOM exists before mount begins.",
  ),
  Code(`import { m } from "@cyftec/maya";

export default m.Html({
  lang: "en",
  children: [
    m.Head([
      m.Title("My app"),
      m.Meta({ charset: "UTF-8" }),
      m.Meta({ name: "viewport", content: "width=device-width, initial-scale=1" }),
    ]),
    m.Body([
      m.Script({ src: "main.js", defer: true }),
      m.Main(m.H1("Hello Maya")),
    ]),
  ],
});`),
);

export const Router = Article(
  m.H3({ class: "black", children: "A small app-level router helper" }),
  Paragraphs(
    "Maya itself does not ship a client-side router. The website demonstrates a small helper that wraps document.location.pathname and hash in signals, then updates them on popstate and hashchange.",
    "This is useful for lightweight UI state, but it does not create routes, load pages, or replace Brahma's file-based MPA routing.",
  ),
  Code(`import { signal } from "@cyftec/maya/signal";

export const path = signal(document.location.pathname);
export const hash = signal(document.location.hash);

window.onpopstate = () => {
  path.value = document.location.pathname;
};`),
  Note("Read document and window only in browser-safe code. A page is evaluated in JSDOM during build."),
);

export const UiToolkit = Article(
  m.H3({ class: "black", children: "The UI toolkit" }),
  Paragraphs(
    "The current Maya toolkit exports query(). It wraps a GET fetch request in signal state so a component can react to loading, data, and error changes.",
  ),
  Code(`import { query } from "@cyftec/maya/toolkit";

const users = query<User[]>("/api/users", undefined);

users.runQuery();
users.isLoading.value;
users.data.value;
users.error.value;
users.abortQuery();
users.clearCache();`),
  Section(
    "What it is not",
    Bullets(
      "It is not a full data cache or retry framework.",
      "It does not define a component-level loading UI for you.",
      "It does not replace fetch or native browser error handling.",
    ),
  ),
);
