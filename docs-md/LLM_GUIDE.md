# Maya Framework LLM Guide

Codebase audit date: 2026-07-13

Use this guide when generating Maya application code for the repository in its current state. The local packages are `@cyftec/maya` and `@cyftec/brahma` at `0.0.14`.

## Prime Directive

Generate native Maya code only:

- no JSX
- no React, Vue, Angular, Svelte, Solid, or router libraries
- no client-side virtual DOM assumptions
- no HTML-string rendering
- no `innerHTML`
- no SCSS or framework-specific post-processing

Maya templates are TypeScript expressions made from `m.*` element factories.

## Imports

Use the package-level exports in application code:

```ts
import { m, component, type Child, type DomEventValue } from "@cyftec/maya";
import { signal, derive, tmpl, effect, compute, op } from "@cyftec/maya/signal";
import { newVal, areValuesEqual } from "@cyftec/maya/immut";
import { query } from "@cyftec/maya/toolkit";
```

The signal and immut packages are re-exported by Maya. Prefer the Maya import path in app examples.

## Page Shape

A buildable page exports a Maya element getter as default:

```ts
import { m } from "@cyftec/maya";

export default m.Html({
  lang: "en",
  children: [
    m.Head({
      children: [
        m.Title("Maya App"),
        m.Meta({ charset: "UTF-8" }),
        m.Meta({
          name: "viewport",
          content: "width=device-width, initial-scale=1.0",
        }),
        m.Link({ rel: "stylesheet", href: "assets/styles.css" }),
      ],
    }),
    m.Body({
      children: [
        // this line is a must, specially with 'defer'
        m.Script({ src: "main.js", defer: true }),
        m.Main({
          children: m.H1("Hello Maya"),
        }),
      ],
    }),
  ],
});
```

Every page must include the script that Brahma emits for that page. Folder pages use `main.js`; prefixed pages such as `contact.page.ts` use `contact.main.js`.

## File Routing

Default scaffold values:

```text
dev/view/page.ts             -> index.html
dev/view/docs/page.ts        -> docs/index.html
dev/view/docs/signals/page.ts -> docs/signals/index.html
dev/view/contact.page.ts     -> contact.html
```

Shared source-only modules belong under a directory starting with the configured ignore delimiter, usually `@`:

```text
dev/view/@site/layout.ts
dev/view/@components/button.ts
dev/view/docs/page.ts
```

Brahma skips ignored directories during static copying but Bun can still import from them.

## `karma.ts`

The current implementation requires:

```ts
export const karma: Karma = {
  brahma: {
    build: {
      appSrcDir: "dev",
      appViewDir: "dev/view",
      skipErrorAndBuildNext: false,
      ignoreDelimiter: "@",
      buildablePageFileName: "page.ts",
      buildableManifestFileName: "manifest.ts",
      stagingDir: "stage",
      publishDir: "prod",
      disposable: ["stage", ".vscode", "node_modules", "bun.lock", "bun.lockb"],
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
    name: "my-app",
    appType: "web",
    dependencies: {
      "@cyftec/maya": "0.0.14",
    },
  },
  git: { ignore: [".DS_Store", "stage", "node_modules"] },
  vscode: { settings: { "deno.enable": false, "files.exclude": {} } },
};
```

Older docs that mention `projectFileNames` or `config` as required exports are stale for this codebase.

## Element Rules

Maya elements are capitalized HTML tags on `m`.

```ts
m.Div("Hello");
m.Pre(m.Code("Hello"));
m.Div([m.Strong("Maya"), " uses native text nodes"]);
m.A({ href: "docs/", children: "Docs" });
m.Input({ value: "initial", oninput: (event) => console.log(event) });
```

Rules:

- Pass children directly or as `children`.
- Children must be strings, element getters, arrays of valid children, or signals/derived signals that resolve to valid children.
- Convert numbers and booleans to strings before using them as children.
- Attribute names match HTML names: `class`, `id`, `href`, `value`, `data-*`.
- Event names match lower-case DOM event attributes: `onclick`, `oninput`, `onsubmit`.
- Event values are functions, never strings.
- Use `onmount` for browser-only code.
- Use `onunmount` for cleanup when the element may be removed.

## Text And Code Blocks

Do not use `innerHTML`. Use text nodes:

```ts
m.Pre({
  children: m.Code({
    children: "const count = signal(0);",
  }),
});
```

Maya serializes text nodes safely during build.

## Attributes And Styling

Static attributes:

```ts
m.Div({ class: "panel", id: "settings" });
```

Reactive attributes:

```ts
const active = signal(false);

m.Button({
  class: tmpl`tab ${() => (active.value ? "is-active" : "")}`,
  onclick: () => (active.value = !active.value),
  children: tmpl`${() => (active.value ? "Active" : "Inactive")}`,
});
```

Avoid complex inline `style`. The core sanitizer rejects `url(...)`, `expression(...)`, `javascript:`, `data:`, `vbscript:`, and `file:` in `style`. Prefer CSS classes in a stylesheet.

## Signals

Basic state:

```ts
const count = signal(0);

m.Button({
  onclick: () => (count.value = count.value + 1),
  children: tmpl`Count: ${count}`,
});
```

Derived state:

```ts
const firstName = signal("Ada");
const lastName = signal("Lovelace");
const fullName = derive(() => `${firstName.value} ${lastName.value}`);

m.P({ children: fullName });
```

`derive()` and `effect()` track dependencies by reading `.value` inside the callback. Keep dependency reads unconditional when possible.

Object state:

```ts
const task = signal({ id: 1, text: "Write docs", done: false });

task.set({ done: true });

m.Span({
  class: tmpl`${() => (task.value.done ? "done" : "open")}`,
  children: task.prop("text"),
});
```

Array state:

```ts
type Task = { id: number; text: string; done: boolean };

const tasks = signal<Task[]>([]);

tasks.push({ id: Date.now(), text: "New task", done: false });
tasks.remove((task) => task.done);

const openTasks = tasks.filter((task) => !task.done);
```

Array mutating methods create new arrays internally and trigger signal effects.

## Components

Use `component()` for typed reusable components:

```ts
type ButtonProps = {
  label: string;
  onTap: () => void;
};

export const Button = component<ButtonProps>(({ label, onTap }) =>
  m.Button({
    class: "button",
    onclick: onTap,
    children: label.value,
  }),
);
```

Inside a `component()` implementation:

- string, array, object, number, and boolean props are signalified and usually read as `.value`.
- signal props are kept as signals.
- function props are kept as functions.

For simple static composition, a plain function returning an element getter is also acceptable.

## Conditional Rendering

Use `m.If`:

```ts
const user = signal<{ name: string } | undefined>(undefined);

m.If({
  subject: user,
  isTruthy: () =>
    m.P({ children: tmpl`Signed in as ${() => user.value?.name}` }),
  isFalsy: () => m.P("Signed out"),
});
```

Use `m.Switch`:

```ts
const status = signal<"idle" | "saving" | "error">("idle");

m.Switch({
  subject: status,
  cases: {
    idle: () => m.P("Idle"),
    saving: () => m.P("Saving"),
    error: () => m.P("Could not save"),
  },
});
```

## Lists

Use `m.For` for lists:

```ts
const labels = signal(["Alpha", "Beta"]);

m.Ul({
  children: m.For({
    subject: labels,
    map: (label) => m.Li(label),
  }),
});
```

For object arrays that may reorder or update, provide `itemKey`:

```ts
type Task = { id: number; text: string; done: boolean };
const tasks = signal<Task[]>([]);

m.Ul({
  children: m.For({
    subject: tasks,
    itemKey: "id",
    map: (task, index) =>
      m.Li({
        class: tmpl`${() => (task.value.done ? "done" : "")}`,
        children: [tmpl`${() => index.value + 1}. `, task.prop("text")],
      }),
  }),
});
```

With `itemKey`, `map` receives item and index derived signals. Existing DOM nodes are preserved for matching keys.

## Forms

Use native DOM events and signals:

```ts
const email = signal("");

m.Form({
  onsubmit: (event) => {
    event.preventDefault();
    console.log(email.value);
  },
  children: [
    m.Input({
      type: "email",
      value: email,
      oninput: (event) => {
        email.value = (event.target as HTMLInputElement).value;
      },
    }),
    m.Button({ type: "submit", children: "Save" }),
  ],
});
```

The current repo has no dedicated form abstraction.

## Browser-Only APIs

Build runs in JSDOM, not the real browser. Avoid direct browser globals while constructing the page.

Incorrect:

```ts
m.P({ children: location.href });
```

Correct:

```ts
m.P({
  children: "",
  onmount: (element) => {
    element.textContent = location.href;
  },
});
```

## PWA Target

Use `brahma create my-pwa --pwa`. The scaffold includes `manifest.ts`, `sw.ts`, assets, and an app script that registers the service worker.

`manifest.ts` is TypeScript and is emitted as `manifest.json`:

```ts
import type { WebAppManifest } from "web-app-manifest";

const manifest: WebAppManifest = {
  name: "My PWA",
  short_name: "PWA",
  start_url: ".",
  display: "standalone",
  theme_color: "#000000",
  background_color: "#ffffff",
  icons: [
    { src: "assets/images/192_logo.png", sizes: "192x192", type: "image/png" },
  ],
};

export default manifest;
```

The sample service worker is a placeholder. Add caching logic explicitly.

## Chrome Extension Target

Use `brahma create my-extension --ext`. The scaffold includes:

- `manifest.ts` typed as `chrome.runtime.ManifestV3`
- `popup.page.ts`
- `sw.ts`
- `content-script.ts`
- extension assets

Production extension builds are zipped.

## CLI

```text
brahma create my-app
brahma create my-app --pwa
brahma create my-app --ext
brahma install
brahma install lodash
brahma stage
brahma publish
brahma reset
brahma reset --hard
brahma uninstall
brahma version
```

`brahma stage` builds and starts a local server. `brahma publish` builds the production output.

## Security And Safety

- Never render untrusted HTML.
- Do not use `innerHTML`.
- Prefer text children and attributes.
- Use stylesheet files instead of unsafe inline style strings.
- Remember that `href` and `style` are sanitized by core, but other attributes are not a complete security boundary.

## Common Mistakes

- Returning `null` as a child. Use `undefined` or `m.If`.
- Using numbers directly as children. Convert with `tmpl` or `String(...)`.
- Reading `window`, `location`, `document.body`, or `chrome` during build.
- Forgetting `m.Script({ src: "main.js", defer: true })` on folder pages.
- Placing reusable source modules outside an ignored folder and accidentally building them as standalone JS.
- Claiming a feature exists because older docs mention it. Check source first.
