# Maya Architecture

Codebase audit date: 2026-07-20

This document describes the implementation that is present in this repository. It intentionally prefers observed source code over older product notes or external naming. The local packages currently identify as `@cyftec/maya` and `@cyftec/brahma`, both at `0.0.14`. If the public package scope is later moved to other names or versioned as `0.1.x`, update package metadata and examples together.

## Repository Map

Maya is organized as a small Bun and TypeScript monorepo:

- `maya/`: core runtime, element factories, components, DOM mounting, custom elements, toolkit exports, and type definitions.
- `brahma/`: CLI and static builder used to create, stage, and publish Maya applications.
- `sample-maya-app/`: source templates copied by `brahma create` for `web`, `pwa`, and `ext` app modes.
- `src/`: development and publish scripts for this monorepo.
- `docs-md/`: codebase guidance for humans and LLMs.

## Design Position

Maya is an MPA-first UI framework. It does not implement JSX, a virtual DOM, a client router, server rendering, or hydration. A Maya page is a TypeScript module that exports a Maya element getter. Brahma builds those modules into static HTML and page-local JavaScript.

The core idea is:

```text
TypeScript page source
  -> Brahma build
  -> static HTML with data-elem-id markers
  -> browser mount
  -> signal effects update exact nodes and attributes
```

The browser DOM remains the real UI tree. Maya stores direct references to DOM nodes during mount, then updates those nodes when signals change.

## Runtime Surface

The main runtime export is:

```ts
import { m, component } from "@cyftec/maya";
import { signal, derive, tmpl, effect, compute, op } from "@cyftec/maya/signal";
```

`m` is a map of capitalized HTML tag factories. Examples: `m.Html`, `m.Head`, `m.Body`, `m.Div`, `m.Button`, `m.Script`, `m.Link`, `m.Meta`.

Every factory returns an `MHtmlElementGetter`, a function marked with `isElementGetter: true`. Calling the getter returns the real DOM node.

```ts
const title = m.H1("Hello Maya");
const node = title();
```

Children may be strings, element getters, arrays of those values, signalified values, or derived signals of children. The public `Child` type is intentionally narrow: `undefined`, strings, and Maya element getters. Numeric and boolean values should be converted to strings, for example with `String(...)` or `tmpl`.

The runtime accepts both the direct-child form and the props form. Event keys are lower-case DOM names such as `onclick` and `oninput`; `onmount` and `onunmount` are Maya-only lifecycle events. Attribute values are strings, booleans, `undefined`, or signalified versions of those values at runtime. The public TypeScript API narrows known boolean and enumerated attributes by tag (for example, `m.Input({ type: "email" })`, `m.Button({ type: "submit" })`, `m.Link({ rel: "stylesheet" })`, and `m.Input({ required: true })`) while leaving custom `data-*`, ARIA, and free-form attributes usable.

## Build, Mount, Run

Maya has three phases, tracked by `window._currentAppPhase` through `phase.start()`.

### Build

Brahma runs the page module in a JSDOM environment. It calls the default export, serializes the returned `m.Html(...)` node, and writes `<!DOCTYPE html>` plus the generated HTML.

During build:

- `idGen.resetIdCounter()` starts element IDs from 1 for each page.
- each Maya element receives `data-elem-id`.
- page code must not depend on browser-only globals such as `location`, `chrome`, or live layout APIs.
- browser-only logic should be deferred to `onmount` or external scripts.

### Mount

The generated page script runs `mountAndRun()`. It resets the ID generator again and calls the same page function in `mount` phase. Instead of creating fresh nodes, `elementGetter()` queries the existing static nodes with `[data-elem-id="<id>"]`.

During mount:

- event listeners are registered.
- signal effects for attributes and children are created.
- `onmount` callbacks are scheduled with `setTimeout`.
- `data-elem-id` is removed from mounted nodes.

### Run

After mount, `phase.start("run")` enables reactive writes. Signal effects mutate the specific DOM text node, child position, or attribute they own. No parent component tree is re-rendered and there is no virtual DOM diff.

When an element uses `onunmount`, Maya starts a document-level `MutationObserver`. Removed subtrees are walked from the deepest child upward; registered unmount listeners run and each element's signal effects are disposed. The observer is only started outside the build phase.

## Element Creation

The element factory accepts either props or children:

```ts
m.Div("Text");
m.Div([m.Span("A"), m.Span("B")]);
m.Button({
  class: "primary",
  onclick: () => console.log("clicked"),
  children: "Save",
});
```

Props are split into:

- `children`
- DOM events such as `onclick`, `oninput`, `onsubmit`
- Maya custom events: `onmount`, `onunmount`
- attributes such as `id`, `class`, `href`, `style`, `value`, `data-*`

HTML event prop values must be functions. The event name is lower-case and matches DOM event attribute spelling, for example `onclick`.

`href` and `style` values are sanitized. `href` rejects `javascript:`, `data:`, `vbscript:`, and `file:`. `style` rejects `url(...)`, `expression(...)`, and the same dangerous schemes. Prefer CSS classes and stylesheet files for layout.

`PropsForTag<T>` supplies tag-specific attribute-name and attribute-value hints to each `m.*` factory. Some attributes are also constrained by tag: `rel: "stylesheet"` is valid for `m.Link` but rejected for `m.A` and `m.Area`. Signals preserve the same value type, so `m.Input({ type: signal("email") })` is checked like the literal form. This is compile-time guidance only; runtime attribute handling still serializes string and boolean values through the common sanitizer and setter.

## Components

`component()` is implemented by the generic `fragment()` helper. It wraps a function and normalizes props before passing them to the inner implementation.

- signals and functions pass through unchanged.
- plain strings and arrays become signalified non-signal objects with `.value`.
- plain objects become non-signal objects with `.value`.
- arrays that already contain signalified objects are unwrapped with `value()`.

Component internals should usually read normalized props with `.value` unless the prop type is a signal or a function.

```ts
type ButtonProps = {
  label: string;
  onTap: () => void;
};

export const Button = component<ButtonProps>(({ label, onTap }) =>
  m.Button({
    onclick: onTap,
    children: label.value,
  }),
);
```

Plain functions that return Maya element getters also work for static composition, but `component()` is the framework-level API for reusable components with typed props.

## Signals

Maya re-exports `@cyftec/signal` from `@cyftec/maya/signal`.

Important primitives:

- `signal(initialValue)`: creates mutable source state.
- `derive(fn)`: creates read-only derived state.
- `effect(fn)`: runs immediately and again when accessed signal values change.
- `tmpl`: creates a derived string from a template literal.
- `compute(fn, ...args)`: unwraps signalified arguments and derives a function result.
- `op(input)`: creates chainable logical, numeric, string, or array operations.
- `promstates(fn)`: exposes promise result, error, and running signals.
- `receive()` and `transmit()`: connect source and derived signals.

Dependency tracking happens when `.value` is read inside `derive()` or `effect()`. Conditional reads matter: if a signal is not read on the first run, it is not tracked until the effect is re-created.

Source signals store values immutably through `@cyftec/immut`. Reading `.value` returns a plain value, while signalified objects expose the helper methods supplied by `@cyftec/signal`.

Object source signals expose:

```ts
const user = signal({ name: "Ada", active: true });
user.set({ active: false }); // shallow merge
const active = user.prop("active"); // derived signal
const props = user.props(); // derived signal per key
```

Array source signals expose mutating helpers that create new arrays internally:

```ts
const tasks = signal([{ id: 1, text: "Ship", done: false }]);
tasks.push({ id: 2, text: "Verify", done: false });
tasks.remove((task) => task.id === 1);
const doneTasks = tasks.filter((task) => task.done); // derived signal
```

## Built-In Custom Elements

Maya adds three custom element helpers to `m`.

### `m.If`

`m.If({ subject, isTruthy, isFalsy })` evaluates a plain or signal subject. Signal subjects return a derived child, so the exact child position updates when the condition changes.

```ts
m.If({
  subject: isReady,
  isTruthy: () => m.P("Ready"),
  isFalsy: () => m.P("Waiting"),
});
```

### `m.Switch`

`m.Switch({ subject, cases, defaultCase, caseMatcher })` matches string or number subjects to case keys. Signal subjects return a derived child.

### `m.For`

`m.For({ subject, map })` maps an array to children. If `subject` is a signal, the return value is a derived children array signal. Without `itemKey`, the mapped result is recomputed as a normal list. With `itemKey`, the keyed diff uses `@cyftec/immut` array mutations and preserves mapped element getters for shuffle/update operations.

For object arrays, `itemKey` enables keyed mutable mapping. With `itemKey`, Maya preserves existing DOM nodes and updates per-item signals instead of recreating every mapped child.

```ts
m.For({
  subject: tasks,
  itemKey: "id",
  map: (task, index) =>
    m.Li({
      children: tmpl`${index.value + 1}. ${() => task.value.text}`,
    }),
});
```

`n` and `nthChild` may be provided together to inject a child at a fixed position in the mapped result.

## Brahma CLI

Brahma is the project toolchain. The implemented commands are:

```text
brahma create <app-name> [--web|--ext|--pwa]
brahma install [package]
brahma uninstall [package]
brahma stage
brahma publish
brahma reset [--hard]
brahma version [version|latest]
brahma help
```

The CLI is Bun-first. The entrypoint is `brahma/src/index.ts`.

`brahma create` copies one of the sample app folders. `brahma install` writes `package.json`, `.vscode/settings.json`, and `.gitignore` from `karma.ts`, then runs `bun i`. Installing or uninstalling a specific package runs Bun for that package and synchronizes the resulting `package.json` back into `karma.maya`. `brahma reset` restores the scaffold's `karma.ts` and supports soft/hard reset modes.

`brahma stage` builds to the configured staging directory, watches the source directory, and serves with BrowserSync. `brahma publish` builds the production output and minifies page JavaScript.

## `karma.ts`

`karma.ts` is the single project-level configuration file. The current implementation requires one named export:

```ts
export const karma: Karma = { ... };
```

The guide may mention "uber-level config"; in this codebase that is `karma.ts`.

Key fields:

- `brahma.build.appSrcDir`: root source directory.
- `brahma.build.appViewDir`: view source directory recursively transformed into static pages.
- `brahma.build.buildablePageFileName`: page entry filename, normally `page.ts`.
- `brahma.build.buildableManifestFileName`: manifest entry filename, normally `manifest.ts`.
- `brahma.build.ignoreDelimiter`: files or directories starting with this delimiter are skipped by the recursive builder.
- `brahma.build.stagingDir`: dev build output.
- `brahma.build.publishDir`: production build output.
- `brahma.serve.watchDir`: watched source directory.
- `brahma.serve.serveDir`: served staging directory.
- `maya`: package.json-equivalent app metadata and dependencies.
- `git.ignore`: generated `.gitignore` entries.
- `vscode.settings`: generated VS Code settings.

## Routing And Output

Brahma routes from files.

- `dev/view/page.ts` -> `index.html` plus `main.js`
- `dev/view/docs/page.ts` -> `docs/index.html` plus `docs/main.js`
- `dev/view/contact.page.ts` -> `contact.html` plus `contact.main.js`

Any non-page `.ts` file under the view tree is compiled to `.js`. A top-level configured `manifest.ts` is imported and written as `manifest.json`. Other files are copied.

Files and directories prefixed with the ignore delimiter, usually `@`, are not copied or traversed by the builder. This is the intended place for shared source-only components such as `@components`, `@elements`, or `@site`.

The builder only treats the configured page filename as a page entry. A prefixed page filename such as `contacts.page.ts` produces `contacts.html` and `contacts.main.js`; a directory `page.ts` produces that directory's `index.html` and `main.js`. The generated page JavaScript contains the bundled source plus a build helper and a mount-and-run function; production page scripts are minified.

## App Targets

### Web

`appType: "web"` produces static pages and assets. The sample web scaffold configures `publishDir: "docs"` for GitHub Pages.

### PWA

`appType: "pwa"` uses the same static build path plus a typed `manifest.ts`, an app script that registers `sw.js`, icons, and a service worker file. The sample service worker currently only logs a message; real caching must be implemented by the app.

### Chrome Extension

`appType: "ext"` includes a typed Chrome `manifest.ts`, popup page, service worker, content script, and extension assets. Production extension builds are zipped by Brahma.

## Toolkit

`@cyftec/maya/toolkit` currently exports `query()`. It creates a signal state around a GET `fetch` request with:

- `isLoading`
- `data`
- `error`
- `runQuery()`
- `abortQuery()`
- `clearCache()`

It is a lightweight helper, not a full cache or retry layer.

## Implementation Gaps To Document Honestly

The current repository implements the core MPA build pipeline, element factories, components, signals, directives, PWA scaffolding, and extension scaffolding.

Do not claim these are implemented unless the code changes:

- JSX support
- virtual DOM diffing
- client-side router
- SSR or hydration
- full service-worker caching strategy
- dedicated form abstraction
- global store abstraction
- client-side route transitions (the website has a small pathname/hash signal helper, but Maya itself has no router)

## Authoring Rules

- Write Maya pages as TypeScript modules exporting a Maya element getter.
- Use `m.*` factories, not JSX or HTML strings.
- Use `children` instead of `innerHTML` (which is COMPLETELY PROHIBITED).
- Convert non-string reactive values to strings before using them as children.
- Use `onmount` for browser-only apis and global properties or methods.
- Keep shared source-only modules under an ignored `@...` folder.
- Use relative asset and page links when the site may be hosted under a GitHub Pages project path.
- Keep `karma.ts` and package metadata in sync.
- Keep browser-only reads and APIs out of page construction because pages are executed in JSDOM during build.
