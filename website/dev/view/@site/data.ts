export type SiteSection = "home" | "docs" | "tutorial" | "blogs";

export type TocItem = {
  id: string;
  text: string;
  level: 2 | 3;
};

export type ContentBlock =
  | { kind: "p"; text: string }
  | { kind: "h2"; id: string; text: string }
  | { kind: "h3"; id: string; text: string }
  | { kind: "ul"; items: string[] }
  | { kind: "ol"; items: string[] }
  | { kind: "code"; code: string }
  | { kind: "callout"; title: string; body: string };

export type PageContent = {
  id: string;
  route: string;
  section: SiteSection;
  eyebrow: string;
  title: string;
  description: string;
  badge?: boolean;
  toc: TocItem[];
  blocks: ContentBlock[];
};

export type NavItem = {
  label: string;
  route: string;
  pageId: string;
};

export type NavGroup = {
  title: string;
  items: NavItem[];
};

const code = (lines: string[]) => lines.join("\n");

export const rootNav: NavItem[] = [
  { label: "Home", route: "", pageId: "home" },
  { label: "Docs", route: "docs/", pageId: "docs-what-is-maya" },
  { label: "Tutorial", route: "tutorial/", pageId: "tutorial-thinking-in-maya" },
  { label: "Blogs", route: "blogs/", pageId: "blogs" },
];

export const docsNav: NavGroup[] = [
  {
    title: "Introduction & Setup",
    items: [
      { label: "What is Maya?", route: "docs/what-is-maya/", pageId: "docs-what-is-maya" },
      { label: "Getting Started", route: "docs/getting-started/", pageId: "docs-getting-started" },
      { label: "Project Lifecycle", route: "docs/project-lifecycle/", pageId: "docs-project-lifecycle" },
    ],
  },
  {
    title: "Core Architecture & Components",
    items: [
      { label: "Component Creation", route: "docs/component-creation/", pageId: "docs-component-creation" },
      { label: "Reactivity with Signals", route: "docs/reactivity-with-signals/", pageId: "docs-reactivity-with-signals" },
      { label: "Built-In Directives", route: "docs/built-in-directives/", pageId: "docs-built-in-directives" },
    ],
  },
  {
    title: "Compilation Targets",
    items: [
      { label: "Web Applications", route: "docs/web-applications/", pageId: "docs-web-applications" },
      { label: "Progressive Web Apps", route: "docs/pwa/", pageId: "docs-pwa" },
      { label: "Chrome Extensions", route: "docs/chrome-extensions/", pageId: "docs-chrome-extensions" },
    ],
  },
];

export const tutorialNav: NavGroup[] = [
  {
    title: "Overview",
    items: [
      { label: "Thinking in Maya", route: "tutorial/thinking-in-maya/", pageId: "tutorial-thinking-in-maya" },
    ],
  },
  {
    title: "Project 1: Todo List",
    items: [
      { label: "Step 1: Task Input", route: "tutorial/todo-input/", pageId: "tutorial-todo-input" },
      { label: "Step 2: Array Signals", route: "tutorial/todo-array-signals/", pageId: "tutorial-todo-array-signals" },
      { label: "Step 3: Finished Tasks", route: "tutorial/todo-conditional-rendering/", pageId: "tutorial-todo-conditional-rendering" },
    ],
  },
  {
    title: "Project 2: Tic-Tac-Toe",
    items: [
      { label: "Step 4: Grid Mechanics", route: "tutorial/tic-tac-toe-grid/", pageId: "tutorial-tic-tac-toe-grid" },
      { label: "Step 5: Turn State", route: "tutorial/tic-tac-toe-turns/", pageId: "tutorial-tic-tac-toe-turns" },
      { label: "Step 6: Win Computations", route: "tutorial/tic-tac-toe-winner/", pageId: "tutorial-tic-tac-toe-winner" },
    ],
  },
];

export const pages: Record<string, PageContent> = {
  "docs-what-is-maya": {
    id: "docs-what-is-maya",
    route: "docs/what-is-maya/",
    section: "docs",
    eyebrow: "Introduction",
    title: "What is Maya?",
    description:
      "Maya is an MPA-first TypeScript UI framework that builds static pages and mounts direct DOM references for signal-driven updates.",
    badge: true,
    toc: [
      { id: "model", text: "The mental model", level: 2 },
      { id: "current-package", text: "Current package identity", level: 2 },
      { id: "first-page", text: "A complete page", level: 2 },
    ],
    blocks: [
      { kind: "h2", id: "model", text: "The mental model" },
      {
        kind: "p",
        text:
          "A Maya page is not JSX and not a virtual DOM render function. It is a TypeScript expression that builds real DOM nodes through capitalized factories such as m.Div, m.Button, and m.Script.",
      },
      {
        kind: "p",
        text:
          "Brahma runs the page once during build to produce static HTML, then the generated script runs the same page in the browser to mount the existing nodes. After mount, signals mutate the exact text node, child slot, or attribute that depends on them.",
      },
      {
        kind: "ul",
        items: [
          "MPA routing comes from folders and page.ts files.",
          "Components are plain TypeScript functions or component() wrappers.",
          "State is held in signals, derived signals, and signal helpers.",
          "The DOM remains directly available through events and onmount.",
        ],
      },
      { kind: "h2", id: "current-package", text: "Current package identity" },
      {
        kind: "callout",
        title: "Repository audit",
        body:
          "The local code currently publishes as @cyftec/maya and @cyftec/brahma at 0.0.14. The @mufw scope in the product prompt is not present in package.json yet, so verified examples use @cyftec imports.",
      },
      { kind: "h2", id: "first-page", text: "A complete page" },
      {
        kind: "code",
        code: code([
          'import { m } from "@cyftec/maya";',
          "",
          "export default m.Html({",
          '  lang: "en",',
          "  children: [",
          "    m.Head({",
          "      children: [",
          '        m.Title("Maya App"),',
          '        m.Meta({ charset: "UTF-8" }),',
          '        m.Meta({ name: "viewport", content: "width=device-width, initial-scale=1.0" }),',
          "      ],",
          "    }),",
          "    m.Body({",
          "      children: [",
          '        m.Script({ src: "main.js", defer: true }),',
          '        m.Main({ children: m.H1("Hello Maya") }),',
          "      ],",
          "    }),",
          "  ],",
          "});",
        ]),
      },
    ],
  },
  "docs-getting-started": {
    id: "docs-getting-started",
    route: "docs/getting-started/",
    section: "docs",
    eyebrow: "Introduction & Setup",
    title: "Getting Started",
    description:
      "Create a Maya app with Brahma, install generated dependencies, and run the static development build.",
    badge: true,
    toc: [
      { id: "install", text: "Install Brahma", level: 2 },
      { id: "create", text: "Create a project", level: 2 },
      { id: "commands", text: "Daily commands", level: 2 },
    ],
    blocks: [
      { kind: "h2", id: "install", text: "Install Brahma" },
      {
        kind: "p",
        text:
          "The current CLI is Bun-first. The local help text supports npm-style global installation examples, but repository builds use Bun.",
      },
      { kind: "code", code: code(["bun install -g @cyftec/brahma", "brahma version"]) },
      {
        kind: "callout",
        title: "If your package scope has moved",
        body:
          "Use npm i -g @mufw/brahma only after package metadata and registry publishing have moved from @cyftec to @mufw.",
      },
      { kind: "h2", id: "create", text: "Create a project" },
      {
        kind: "code",
        code: code([
          "brahma create my-app",
          "cd my-app",
          "brahma install",
          "brahma stage",
        ]),
      },
      { kind: "h2", id: "commands", text: "Daily commands" },
      {
        kind: "ul",
        items: [
          "brahma stage builds to the configured staging directory, watches source files, and starts a local server.",
          "brahma publish builds production output and minifies page JavaScript.",
          "brahma reset restores karma.ts from the scaffold template.",
          "brahma install <package> adds a dependency and syncs karma.maya.",
        ],
      },
    ],
  },
  "docs-project-lifecycle": {
    id: "docs-project-lifecycle",
    route: "docs/project-lifecycle/",
    section: "docs",
    eyebrow: "Introduction & Setup",
    title: "Project Lifecycle",
    description:
      "Understand karma.ts, source folders, ignored component folders, staging output, and production output.",
    badge: true,
    toc: [
      { id: "karma", text: "karma.ts is the app contract", level: 2 },
      { id: "layout", text: "Directory layout", level: 2 },
      { id: "route-output", text: "Route output", level: 2 },
    ],
    blocks: [
      { kind: "h2", id: "karma", text: "karma.ts is the app contract" },
      {
        kind: "p",
        text:
          "Brahma reads a single named export, karma. It contains build filenames, output folders, serve settings, app metadata, generated ignore rules, and dependency declarations.",
      },
      {
        kind: "code",
        code: code([
          'export const karma = {',
          "  brahma: {",
          "    build: {",
          '      appSrcDir: "dev",',
          '      appViewDir: "dev/view",',
          '      buildablePageFileName: "page.ts",',
          '      buildableManifestFileName: "manifest.ts",',
          '      ignoreDelimiter: "@",',
          '      publishDir: "prod",',
          "    },",
          "  },",
          '  maya: { name: "my-app", appType: "web", dependencies: {} },',
          "};",
        ]),
      },
      { kind: "h2", id: "layout", text: "Directory layout" },
      {
        kind: "code",
        code: code([
          "dev/",
          "  view/",
          "    page.ts",
          "    docs/page.ts",
          "    docs/signals/page.ts",
          "    @site/layout.ts",
          "    assets/styles.css",
          "karma.ts",
          "package.json",
        ]),
      },
      { kind: "h2", id: "route-output", text: "Route output" },
      {
        kind: "ul",
        items: [
          "page.ts builds to index.html and main.js in the same output folder.",
          "contact.page.ts builds to contact.html and contact.main.js.",
          "manifest.ts at the app view root is imported and written as manifest.json.",
          "Other .ts files are compiled to .js; other assets are copied.",
        ],
      },
    ],
  },
  "docs-component-creation": {
    id: "docs-component-creation",
    route: "docs/component-creation/",
    section: "docs",
    eyebrow: "Core Architecture & Components",
    title: "Component Creation",
    description:
      "Create reusable UI with pure TypeScript functions, component(), and raw DOM access through events and onmount.",
    badge: true,
    toc: [
      { id: "factories", text: "Element factories", level: 2 },
      { id: "component-wrapper", text: "component()", level: 2 },
      { id: "dom-access", text: "Raw DOM access", level: 2 },
    ],
    blocks: [
      { kind: "h2", id: "factories", text: "Element factories" },
      {
        kind: "p",
        text:
          "Every HTML tag listed by Maya is available as a capitalized function on m. The function accepts children or a props object and returns an element getter.",
      },
      {
        kind: "code",
        code: code([
          "const toolbar = m.Nav({",
          '  class: "toolbar",',
          "  children: [",
          '    m.A({ href: "docs/", children: "Docs" }),',
          '    m.Button({ onclick: save, children: "Save" }),',
          "  ],",
          "});",
        ]),
      },
      { kind: "h2", id: "component-wrapper", text: "component()" },
      {
        kind: "code",
        code: code([
          'import { component, m } from "@cyftec/maya";',
          "",
          "type PillProps = { label: string; selected: boolean; onTap: () => void };",
          "",
          "export const Pill = component<PillProps>(({ label, selected, onTap }) =>",
          "  m.Button({",
          '    class: selected.value ? "pill selected" : "pill",',
          "    onclick: onTap,",
          "    children: label.value,",
          "  }),",
          ");",
        ]),
      },
      { kind: "h2", id: "dom-access", text: "Raw DOM access" },
      {
        kind: "p",
        text:
          "Use onmount when code requires a real browser node. The callback receives the mounted Maya element after the static node has been connected to runtime state.",
      },
      {
        kind: "code",
        code: code([
          "m.Div({",
          '  children: "",',
          "  onmount: (element) => {",
          "    element.textContent = `Rendered at ${new Date().toLocaleTimeString()}`;",
          "  },",
          "});",
        ]),
      },
    ],
  },
  "docs-reactivity-with-signals": {
    id: "docs-reactivity-with-signals",
    route: "docs/reactivity-with-signals/",
    section: "docs",
    eyebrow: "Core Architecture & Components",
    title: "Reactivity with Signals",
    description:
      "Use source signals, derived signals, template strings, and keyed list updates for surgical DOM mutation.",
    badge: true,
    toc: [
      { id: "source", text: "Source signals", level: 2 },
      { id: "derived", text: "Derived values", level: 2 },
      { id: "dom", text: "DOM update boundaries", level: 2 },
    ],
    blocks: [
      { kind: "h2", id: "source", text: "Source signals" },
      {
        kind: "code",
        code: code([
          'import { signal, tmpl } from "@cyftec/maya/signal";',
          "",
          "const count = signal(0);",
          "",
          "m.Button({",
          "  onclick: () => (count.value = count.value + 1),",
          "  children: tmpl`Clicked ${count} times`,",
          "});",
        ]),
      },
      { kind: "h2", id: "derived", text: "Derived values" },
      {
        kind: "p",
        text:
          "derive() tracks signals whose .value is read during the callback. The return value is a read-only signal that can be used as text, attributes, or child selectors.",
      },
      {
        kind: "code",
        code: code([
          "const first = signal(\"Ada\");",
          "const last = signal(\"Lovelace\");",
          "const fullName = derive(() => `${first.value} ${last.value}`);",
          "",
          "m.P({ children: fullName });",
        ]),
      },
      { kind: "h2", id: "dom", text: "DOM update boundaries" },
      {
        kind: "p",
        text:
          "Attribute signals are watched by the element that owns the attribute. Child signals are watched by the parent and replace only the affected child position. There is no full parent re-render.",
      },
    ],
  },
  "docs-built-in-directives": {
    id: "docs-built-in-directives",
    route: "docs/built-in-directives/",
    section: "docs",
    eyebrow: "Core Architecture & Components",
    title: "Built-In Directives",
    description:
      "Use m.If, m.For, and m.Switch for conditions, loops, keyed node preservation, and state-based branch selection.",
    badge: true,
    toc: [
      { id: "if", text: "m.If", level: 2 },
      { id: "for", text: "m.For", level: 2 },
      { id: "switch", text: "m.Switch", level: 2 },
    ],
    blocks: [
      { kind: "h2", id: "if", text: "m.If" },
      {
        kind: "code",
        code: code([
          "m.If({",
          "  subject: isLoggedIn,",
          '  isTruthy: () => m.P("Welcome back"),',
          '  isFalsy: () => m.P("Please sign in"),',
          "});",
        ]),
      },
      { kind: "h2", id: "for", text: "m.For" },
      {
        kind: "code",
        code: code([
          "m.For({",
          "  subject: tasks,",
          '  itemKey: "id",',
          "  map: (task, index) =>",
          "    m.Li({",
          "      children: [tmpl`${() => index.value + 1}. `, task.prop(\"text\")],",
          "    }),",
          "});",
        ]),
      },
      {
        kind: "callout",
        title: "Keyed mapping",
        body:
          "With itemKey, m.For keeps existing mapped nodes for matching keys and updates item/index signals. Without itemKey, array changes recreate mapped children.",
      },
      { kind: "h2", id: "switch", text: "m.Switch" },
      {
        kind: "code",
        code: code([
          "m.Switch({",
          "  subject: view,",
          "  cases: {",
          '    list: () => m.Section("List"),',
          '    detail: () => m.Section("Detail"),',
          "  },",
          '  defaultCase: () => m.Section("Unknown view"),',
          "});",
        ]),
      },
    ],
  },
  "docs-web-applications": {
    id: "docs-web-applications",
    route: "docs/web-applications/",
    section: "docs",
    eyebrow: "Compilation Targets",
    title: "Web Applications",
    description:
      "Build a static multi-page website or application with folder routes and page-local runtime bundles.",
    badge: true,
    toc: [
      { id: "web-mode", text: "Web mode", level: 2 },
      { id: "assets", text: "Assets and links", level: 2 },
      { id: "publish", text: "Publishing", level: 2 },
    ],
    blocks: [
      { kind: "h2", id: "web-mode", text: "Web mode" },
      {
        kind: "p",
        text:
          "The default scaffold is appType web. It builds every page.ts under appViewDir into static HTML and a small page-local JavaScript file.",
      },
      { kind: "h2", id: "assets", text: "Assets and links" },
      {
        kind: "p",
        text:
          "For GitHub Pages project sites, prefer relative links such as ../assets/styles.css from nested pages. Absolute /assets links assume domain-root hosting.",
      },
      { kind: "h2", id: "publish", text: "Publishing" },
      {
        kind: "code",
        code: code([
          "// In karma.ts",
          'publishDir: "../doc"',
          "",
          "// Then build",
          "brahma publish",
        ]),
      },
    ],
  },
  "docs-pwa": {
    id: "docs-pwa",
    route: "docs/pwa/",
    section: "docs",
    eyebrow: "Compilation Targets",
    title: "Progressive Web Apps",
    description:
      "Use the PWA scaffold for typed manifest configuration, service worker registration, and static deployment.",
    badge: true,
    toc: [
      { id: "manifest", text: "Typed manifest", level: 2 },
      { id: "service-worker", text: "Service worker", level: 2 },
    ],
    blocks: [
      { kind: "h2", id: "manifest", text: "Typed manifest" },
      {
        kind: "code",
        code: code([
          'import type { WebAppManifest } from "web-app-manifest";',
          "",
          "const manifest: WebAppManifest = {",
          '  name: "Maya PWA",',
          '  short_name: "Maya",',
          '  start_url: ".",',
          '  display: "standalone",',
          '  theme_color: "#000000",',
          '  background_color: "#ffffff",',
          "};",
          "",
          "export default manifest;",
        ]),
      },
      { kind: "h2", id: "service-worker", text: "Service worker" },
      {
        kind: "p",
        text:
          "The scaffold registers sw.js from app.js. The sample service worker is intentionally minimal, so production cache routes, update behavior, and offline fallbacks must be written by the app.",
      },
    ],
  },
  "docs-chrome-extensions": {
    id: "docs-chrome-extensions",
    route: "docs/chrome-extensions/",
    section: "docs",
    eyebrow: "Compilation Targets",
    title: "Chrome Extensions",
    description:
      "Target Manifest V3 with a typed manifest, popup page, background service worker, and content scripts.",
    badge: true,
    toc: [
      { id: "extension-mode", text: "Extension mode", level: 2 },
      { id: "manifest-v3", text: "Manifest V3", level: 2 },
    ],
    blocks: [
      { kind: "h2", id: "extension-mode", text: "Extension mode" },
      {
        kind: "code",
        code: code(["brahma create attention-extension --ext", "cd attention-extension", "brahma install", "brahma publish"]),
      },
      { kind: "h2", id: "manifest-v3", text: "Manifest V3" },
      {
        kind: "code",
        code: code([
          "const manifest: chrome.runtime.ManifestV3 = {",
          '  name: "Maya Extension",',
          '  version: "0.0.1",',
          "  manifest_version: 3,",
          '  permissions: ["tabs"],',
          '  background: { service_worker: "sw.js" },',
          '  action: { default_popup: "popup.html" },',
          "};",
          "",
          "export default manifest;",
        ]),
      },
    ],
  },
  "tutorial-thinking-in-maya": {
    id: "tutorial-thinking-in-maya",
    route: "tutorial/thinking-in-maya/",
    section: "tutorial",
    eyebrow: "Overview",
    title: "Thinking in Maya",
    description:
      "Build interfaces by identifying which DOM node or attribute should change when a signal mutates.",
    badge: true,
    toc: [
      { id: "mutation", text: "Mutation instead of diffing", level: 2 },
      { id: "shape", text: "Shape state around DOM ownership", level: 2 },
    ],
    blocks: [
      { kind: "h2", id: "mutation", text: "Mutation instead of diffing" },
      {
        kind: "p",
        text:
          "In a virtual DOM system you often ask what component should render again. In Maya, ask which child position, text node, or attribute depends on this signal.",
      },
      {
        kind: "code",
        code: code([
          "const selected = signal(\"inbox\");",
          "",
          "m.A({",
          "  class: tmpl`nav-link ${() => (selected.value === \"inbox\" ? \"active\" : \"\")}`",
          "  children: \"Inbox\",",
          "});",
        ]),
      },
      { kind: "h2", id: "shape", text: "Shape state around DOM ownership" },
      {
        kind: "p",
        text:
          "Small signals work well. Keep form fields, selected IDs, current filters, and derived display strings close to the page or component that owns the DOM they update.",
      },
    ],
  },
  "tutorial-todo-input": {
    id: "tutorial-todo-input",
    route: "tutorial/todo-input/",
    section: "tutorial",
    eyebrow: "Project 1: Todo List",
    title: "Step 1: Scaffolding the Task Input",
    description:
      "Create a controlled input and submit action using native form events and a text signal.",
    badge: true,
    toc: [
      { id: "state", text: "Input state", level: 2 },
      { id: "form", text: "Form wiring", level: 2 },
    ],
    blocks: [
      { kind: "h2", id: "state", text: "Input state" },
      {
        kind: "p",
        text:
          "Start with one source signal for the draft text. The input writes to it through oninput; the preview reads it through tmpl.",
      },
      { kind: "h2", id: "form", text: "Form wiring" },
      {
        kind: "code",
        code: code([
          "const draft = signal(\"\");",
          "",
          "m.Form({",
          "  onsubmit: (event) => {",
          "    event.preventDefault();",
          "    if (!draft.value.trim()) return;",
          "    console.log(\"create task\", draft.value.trim());",
          "    draft.value = \"\";",
          "  },",
          "  children: [",
          "    m.Input({",
          "      value: draft,",
          "      placeholder: \"Write a task\",",
          "      oninput: (event) => {",
          "        draft.value = (event.target as HTMLInputElement).value;",
          "      },",
          "    }),",
          "    m.Button({ type: \"submit\", children: \"Add\" }),",
          "  ],",
          "});",
        ]),
      },
    ],
  },
  "tutorial-todo-array-signals": {
    id: "tutorial-todo-array-signals",
    route: "tutorial/todo-array-signals/",
    section: "tutorial",
    eyebrow: "Project 1: Todo List",
    title: "Step 2: Managing List State with Array Signals",
    description:
      "Store tasks in an array signal and render them with keyed m.For so rows stay stable across updates.",
    badge: true,
    toc: [
      { id: "task-type", text: "Task type", level: 2 },
      { id: "keyed-list", text: "Keyed list rendering", level: 2 },
    ],
    blocks: [
      { kind: "h2", id: "task-type", text: "Task type" },
      {
        kind: "code",
        code: code([
          "type Task = { id: number; text: string; done: boolean };",
          "const tasks = signal<Task[]>([]);",
          "",
          "const addTask = (text: string) => {",
          "  tasks.push({ id: Date.now(), text, done: false });",
          "};",
        ]),
      },
      { kind: "h2", id: "keyed-list", text: "Keyed list rendering" },
      {
        kind: "code",
        code: code([
          "m.Ul({",
          "  children: m.For({",
          "    subject: tasks,",
          "    itemKey: \"id\",",
          "    map: (task) =>",
          "      m.Li({",
          "        children: task.prop(\"text\"),",
          "      }),",
          "  }),",
          "});",
        ]),
      },
    ],
  },
  "tutorial-todo-conditional-rendering": {
    id: "tutorial-todo-conditional-rendering",
    route: "tutorial/todo-conditional-rendering/",
    section: "tutorial",
    eyebrow: "Project 1: Todo List",
    title: "Step 3: Conditional Rendering of Finished Tasks",
    description:
      "Combine m.For and m.If to toggle individual tasks while keeping rows bound to stable task IDs.",
    badge: true,
    toc: [
      { id: "toggle", text: "Toggle done", level: 2 },
      { id: "empty", text: "Empty states", level: 2 },
    ],
    blocks: [
      { kind: "h2", id: "toggle", text: "Toggle done" },
      {
        kind: "code",
        code: code([
          "m.For({",
          "  subject: tasks,",
          "  itemKey: \"id\",",
          "  map: (task) =>",
          "    m.Li({",
          "      class: tmpl`${() => (task.value.done ? \"task done\" : \"task\")}`,",
          "      children: [",
          "        m.Input({",
          "          type: \"checkbox\",",
          "          checked: derive(() => task.value.done),",
          "          onchange: () => task.set({ done: !task.value.done }),",
          "        }),",
          "        task.prop(\"text\"),",
          "      ],",
          "    }),",
          "});",
        ]),
      },
      { kind: "h2", id: "empty", text: "Empty states" },
      {
        kind: "code",
        code: code([
          "m.If({",
          "  subject: tasks.length(),",
          "  isTruthy: () => m.Ul({ children: taskRows }),",
          "  isFalsy: () => m.P(\"No tasks yet\"),",
          "});",
        ]),
      },
    ],
  },
  "tutorial-tic-tac-toe-grid": {
    id: "tutorial-tic-tac-toe-grid",
    route: "tutorial/tic-tac-toe-grid/",
    section: "tutorial",
    eyebrow: "Project 2: Tic-Tac-Toe",
    title: "Step 4: Grid Layout Mechanics & Component Reusability",
    description:
      "Represent the board as nine cells and extract a reusable square component.",
    badge: true,
    toc: [
      { id: "board", text: "Board signal", level: 2 },
      { id: "square", text: "Square component", level: 2 },
    ],
    blocks: [
      { kind: "h2", id: "board", text: "Board signal" },
      {
        kind: "code",
        code: code([
          'type Mark = "X" | "O" | "";',
          "const board = signal<Mark[]>(Array(9).fill(\"\"));",
        ]),
      },
      { kind: "h2", id: "square", text: "Square component" },
      {
        kind: "code",
        code: code([
          "const Square = component<{ mark: Mark; onTap: () => void }>(({ mark, onTap }) =>",
          "  m.Button({",
          "    class: \"square\",",
          "    onclick: onTap,",
          "    children: mark.value || \" \",",
          "  }),",
          ");",
        ]),
      },
    ],
  },
  "tutorial-tic-tac-toe-turns": {
    id: "tutorial-tic-tac-toe-turns",
    route: "tutorial/tic-tac-toe-turns/",
    section: "tutorial",
    eyebrow: "Project 2: Tic-Tac-Toe",
    title: "Step 5: Turn-Based State & Move Tracing",
    description:
      "Track the active mark, write immutable board moves, and record move history.",
    badge: true,
    toc: [
      { id: "turn", text: "Turn state", level: 2 },
      { id: "history", text: "Move tracing", level: 2 },
    ],
    blocks: [
      { kind: "h2", id: "turn", text: "Turn state" },
      {
        kind: "code",
        code: code([
          'const active = signal<"X" | "O">("X");',
          "const history = signal<number[]>([]);",
          "",
          "const play = (index: number) => {",
          "  if (board.value[index]) return;",
          "  const next = board.value;",
          "  next[index] = active.value;",
          "  board.value = next;",
          "  history.push(index);",
          "  active.value = active.value === \"X\" ? \"O\" : \"X\";",
          "};",
        ]),
      },
      { kind: "h2", id: "history", text: "Move tracing" },
      {
        kind: "p",
        text:
          "Because array signal reads return a fresh value, copy the board into a local variable, update it, and assign it back. Use history.push for append-only move tracing.",
      },
    ],
  },
  "tutorial-tic-tac-toe-winner": {
    id: "tutorial-tic-tac-toe-winner",
    route: "tutorial/tic-tac-toe-winner/",
    section: "tutorial",
    eyebrow: "Project 2: Tic-Tac-Toe",
    title: "Step 6: Win Condition Computations & Game Reset",
    description:
      "Compute a winner from the board signal and reset all game signals from one command.",
    badge: true,
    toc: [
      { id: "winner", text: "Winner computation", level: 2 },
      { id: "reset", text: "Game reset", level: 2 },
    ],
    blocks: [
      { kind: "h2", id: "winner", text: "Winner computation" },
      {
        kind: "code",
        code: code([
          "const wins = [[0,1,2], [3,4,5], [6,7,8], [0,3,6], [1,4,7], [2,5,8], [0,4,8], [2,4,6]];",
          "",
          "const winner = derive(() => {",
          "  const cells = board.value;",
          "  const line = wins.find(([a, b, c]) => cells[a] && cells[a] === cells[b] && cells[a] === cells[c]);",
          "  return line ? cells[line[0]] : \"\";",
          "});",
        ]),
      },
      { kind: "h2", id: "reset", text: "Game reset" },
      {
        kind: "code",
        code: code([
          "const reset = () => {",
          "  board.value = Array(9).fill(\"\");",
          "  history.value = [];",
          "  active.value = \"X\";",
          "};",
        ]),
      },
    ],
  },
  blogs: {
    id: "blogs",
    route: "blogs/",
    section: "blogs",
    eyebrow: "Framework Updates",
    title: "Blogs & Engineering Logs",
    description:
      "Release notes, implementation notes, and changelog entries for the evolving Maya and Brahma codebase.",
    toc: [
      { id: "release-line", text: "v0.1.x release line", level: 2 },
      { id: "audit", text: "Repository audit log", level: 2 },
      { id: "next", text: "Next documentation tasks", level: 2 },
    ],
    blocks: [
      { kind: "h2", id: "release-line", text: "v0.1.x release line" },
      {
        kind: "p",
        text:
          "The prompt targets a v0.1.x public release line, while the local packages still report 0.0.14. Treat v0.1.x posts here as planned release content until package metadata is updated.",
      },
      { kind: "h2", id: "audit", text: "Repository audit log" },
      {
        kind: "ul",
        items: [
          "Core runtime exports m factories, component(), and type definitions.",
          "Signals are re-exported through @cyftec/maya/signal.",
          "Brahma generates static HTML, page-local JavaScript, manifest.json, and production bundles.",
          "PWA and extension modes are scaffolded, with real service-worker caching left to the app.",
        ],
      },
      { kind: "h2", id: "next", text: "Next documentation tasks" },
      {
        kind: "ol",
        items: [
          "Align package metadata with the intended public scope.",
          "Add tested PWA cache recipes after service-worker strategy is implemented.",
          "Add API reference pages generated from TypeScript signatures.",
        ],
      },
    ],
  },
};

export const landingPillars = [
  {
    title: "MPA first",
    text:
      "Folder routes build to independent HTML files, so navigation and deployment stay close to the platform.",
  },
  {
    title: "Signal precision",
    text:
      "Source and derived signals update the exact DOM ownership boundary that reads them.",
  },
  {
    title: "TypeScript templates",
    text:
      "Templates are native TypeScript values built from m.* factories instead of JSX or string HTML.",
  },
  {
    title: "Static targets",
    text:
      "Web, PWA, and Chrome extension scaffolds share the same Brahma build pipeline.",
  },
];
