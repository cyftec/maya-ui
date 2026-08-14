# Maya NoCSS Coding Specification

**Status:** normative styling contract

**Audience:** coding agents and engineers building Maya applications

**Read with:** [`MAYA_APP_CODING_SPEC.md`](./MAYA_APP_CODING_SPEC.md) and the
applicable domain profile

NoCSS is Maya's self-contained styling system. Application code declares typed
class names in TypeScript, Brahma observes which names are used while building
the pages, and the NoCSS compiler writes the minified application stylesheet.
The authored source remains TypeScript; `styles.css` is generated output.

---

## 1. Coding-agent contract

For coding agents, NoCSS is the only permitted way to author CSS-based styles
in a Maya application. This restriction does not apply to human contributors.

A coding agent MUST:

1. use the project's configured NoCSS `styles.ts` as the single stylesheet
   source;
2. import its typed `css` helper and pass every `class` value through it;
3. express custom declarations, responsive constraints, and reusable class
   groups through the NoCSS configuration maps;
4. preserve the generated `styles.css` link required by the page; and
5. build the app and verify the generated stylesheet and the rendered result.

A coding agent MUST NOT:

- create or edit an authored `.css` file;
- use an inline `style` attribute or property;
- generate `style` or SVG style-element content;
- inject CSS text at runtime;
- introduce another CSS framework, preprocessor, CSS module, or styling
  dependency;
- put a raw class string directly in a Maya element;
- hide an unknown class with a cast, `any`, or a broad `string`; or
- edit generated staging or production CSS.

Existing human-authored CSS that is unrelated to the task may remain. When an
agent is asked to change an existing style, the changed behavior must be moved
into NoCSS rather than extending the old stylesheet.

Canvas context properties such as `fillStyle`, `strokeStyle`, shadows, and
fonts control canvas pixels rather than DOM CSS. They remain valid inside a
canvas renderer. Style the canvas element, HUD, menus, and other DOM through
NoCSS.

---

## 2. One stylesheet source

The active filenames and paths come from `_karma/karma.ts`:

```ts
brahma: {
  build: {
    appViewDir: "dev/view/pages",
    buildableStylesheetFileName: "styles.ts",
    assetsDirName: "assets",
  },
}
```

With that configuration, Brahma recognizes one stylesheet source inside the
app view and emits it as:

```text
dev/view/pages/assets/styles.ts  ->  stage/assets/styles.css
                                  ->  docs/assets/styles.css (production)
```

Paths vary when Karma changes `appViewDir`, `assetsDirName`, or the publish
directory. Read the project configuration instead of assuming the example
paths. Only one file whose basename equals `buildableStylesheetFileName` may
exist inside `appViewDir`; Brahma rejects multiple configuration files.

`brahma create` installs the initial NoCSS probe. If that source is missing or
damaged, `brahma reset --stylesheet` restores the configured probe and
overwrites the existing file. Do not run that reset against intentional
stylesheet changes without preserving them first.

The page still links the generated asset:

```ts
m.Link({ rel: "stylesheet", href: "/assets/styles.css" });
```

That link consumes NoCSS output. It does not authorize a second handwritten
stylesheet.

---

## 3. Stylesheet module

A NoCSS stylesheet module exports its configuration, derives the complete
class-name type, and creates one typed helper:

```ts
import {
  getCss,
  type AppClassNames,
  type AtomicClassOverrides,
  type BaseClassName,
  type ClassNamesPhrase,
  type MediaConstraintsOverrides,
} from "@cyftec/maya/nocss";

export const overriddenMediaConstraints = {
  ns: { minWidth: "30em" },
  m: { minWidth: "30em", maxWidth: "60em" },
  l: { minWidth: "60em" },
} as const satisfies MediaConstraintsOverrides;

export const overriddenBaseClasses = {
  default: {
    theme: "{ color: #ee4440; }",
    "bg-theme": "{ background-color: #ee4440; }",
    "focus-theme:focus-visible":
      "{ outline: .1875rem solid #ee4440; outline-offset: .1875rem; }",
    "not-allowed": "{ cursor: not-allowed; }",
  },
  ns: {
    "page-grid-ns": "{ display: grid; grid-template-columns: 16rem 1fr; }",
  },
} as const satisfies AtomicClassOverrides;

export const compoundClasses = {
  card: "bg-theme pa3 br3",
  action: "ph3 pv2 br2 focus-theme",
} as const;

export type { ClassNamesPhrase };
export type ClassName = AppClassNames<
  BaseClassName,
  typeof overriddenBaseClasses,
  typeof compoundClasses
>;

export const css = getCss<ClassName>();
```

Keep every map `as const`. Literal keys and values allow TypeScript to reject
unknown class names and invalid compound definitions.

### 3.1 Base and overridden classes

`BaseClassName` contains Maya's built-in atomic classes, including responsive
`-ns`, `-m`, and `-l` variants. Use editor completion on `css("...")` and the
`ClassName` type to discover available names.

`overriddenBaseClasses` has four optional groups:

- `default`: rules without a media query;
- `ns`: rules within the not-small constraint;
- `m`: rules within the medium constraint; and
- `l`: rules within the large constraint.

An override with an existing name replaces that built-in declaration. A new
name adds an application class. A selector suffix such as `:hover`, `:focus`,
or `:focus-visible` belongs on the configuration key, while application code
uses only the class portion:

```ts
// styles.ts
export const overriddenBaseClasses = {
  default: {
    "action:hover": "{ background-color: #eee; }",
    "action:focus-visible": "{ outline: .1875rem solid currentColor; }",
  },
} as const satisfies AtomicClassOverrides;

// component.ts
m.Button({ class: css("action"), children: "Save" });
```

Declarations include their surrounding braces. Custom properties, logical
properties, grid, and other class-level browser CSS declarations belong inside
these typed NoCSS rules when the built-in classes do not cover the requirement.

### 3.2 Responsive constraints

The default media groups are:

- `ns`: `min-width: 30em`;
- `m`: `min-width: 30em` and `max-width: 60em`; and
- `l`: `min-width: 60em`.

`overriddenMediaConstraints` partially replaces those boundaries. Use the
responsive class registered for the matching group, such as `pa2-ns`,
`pa2-m`, or a custom `page-grid-ns`. Do not branch the initial Maya tree from
`window.innerWidth` merely to change layout.

### 3.3 Compound classes

`compoundClasses` creates a reusable application class from known atomic
classes:

```ts
export const compoundClasses = {
  surface: "bg-white near-black pa3",
  card: "bg-white near-black pa3 br3 shadow-1",
} as const;
```

The compiler emits the expanded declarations under the compound selector, such
as `.card`. Values must stay literal and, in the public application type, may
contain only built-in or overridden atomic names. Repeat an atomic phrase when
one compound needs the same rules as another; do not nest compound names.

Prefer a compound when a meaningful UI role repeatedly uses the same group of
atomic rules. Prefer an overridden atomic class when the application needs a
declaration the built-in vocabulary does not provide.

---

## 4. Applying classes

Import `css` from the app stylesheet module, not directly from the Maya
package. The app helper carries its exact class-name vocabulary:

```ts
import { component, m } from "@cyftec/maya/core";
import { signal } from "@cyftec/maya/signals";
import { css, type ClassNamesPhrase } from "../assets/styles.js";

type ActionProps = {
  classNames?: ClassNamesPhrase;
  label: string;
};

export const Action = component<ActionProps>(({ classNames, label }) => {
  const busy = signal(false);

  return m.Button({
    type: "button",
    class: css(
      "action",
      css.when(busy, "o-50 not-allowed", "pointer"),
      classNames,
    ),
    disabled: busy,
    children: label,
  });
});
```

Always call `css`, even for one static class:

```ts
m.Main({ class: css("center mw8 pa3") }); // Correct.
m.Main({ class: "center mw8 pa3" });      // Forbidden for agents.
```

Calling `css` performs three jobs: it validates each word, registers the class
for build-time generation, and returns a value suitable for Maya's reactive
`class` attribute.

Do not construct names with unchecked interpolation:

```ts
// Invalid: broad runtime text cannot be checked or exhaustively collected.
class: `bg-${color.value}`;

// Correct: declare every supported outcome.
class: css.cases(color, {
  "bg-green": "success",
  "bg-yellow": "warning",
  "bg-red": "danger",
});
```

---

## 5. Helper API

### 5.1 `css(...phrases)`

`css` combines validated class phrases. Inputs may be literal classes,
previously validated `ClassNamesPhrase` values, nullish optional values, or
compatible signals. Empty and nullish inputs are omitted. If any input is a
signal, the result is a derived signal.

```ts
const tone = signal<"green" | "red">("green");
const classes = css("pa3 br2", tone);
```

Use a narrow `ClassName` or `ClassNamesPhrase` type at API boundaries. A broad
`string` is intentionally rejected because NoCSS cannot prove its words exist.

### 5.2 `css.when(condition, truthyPhrase, falsyPhrase)`

`css.when` selects between two class phrases and registers both outcomes during
the static build:

```ts
class: css("pa3", css.when(selected, "bg-blue white", "bg-white black"));
```

Use it for a boolean visual state. Use `""` when one branch adds no class.

### 5.3 `css.cases(subject, cases, defaultPhrase?)`

`css.cases` maps class phrases to matching subject values. It uses the first
match and registers every declared class phrase plus the optional default:

```ts
class: css.cases(
  status,
  {
    "bg-light-gray near-black": "idle",
    "bg-washed-blue dark-blue": "loading",
    "bg-washed-green dark-green": "ready",
    "bg-washed-red dark-red": "error",
  },
  "bg-light-gray near-black",
);
```

Case values may themselves be compatible signals. Omit the default when no
match should produce an empty class phrase.

### 5.4 `css.ifNullable(value, fallbackPhrase)`

`css.ifNullable` uses its fallback only when the first value is `null` or
`undefined`. An empty phrase remains empty:

```ts
class: css.ifNullable(optionalTone, "near-black");
```

The fallback is static and registered during the build. For a finite set of
future signal values, prefer `css.when` or `css.cases` so every possible rule
is generated.

### 5.5 Static-build completeness

Brahma can emit only classes registered while statically building the app.
`css.when` and `css.cases` deliberately register all declared outcomes. A
direct signal passed to `css` or `css.ifNullable` registers the value observed
during the build, but a new value first encountered later in the browser
cannot add a rule to the already generated stylesheet.

Therefore, model finite runtime styling states with `css.when` or `css.cases`.
Do not rely on a direct broad signal, user input, server text, or string
interpolation to reveal a new class after mount.

---

## 6. Build behavior

For each app build, Brahma:

1. clears the NoCSS usage registry;
2. bundles and statically renders every Maya page;
3. collects class names passed through the app's `css` helper;
4. imports the configured `styles.ts` maps;
5. expands compounds and selects only rules for collected names;
6. wraps responsive groups in their media queries;
7. writes and minifies `styles.css` under the configured output assets
   directory.

Unknown names are rejected by the typed helper during type-checking. At the
lower-level compiler boundary, an unknown collected name has no matching rule
and emits nothing. Never use casts to turn that silent absence into a runtime
styling bug.

The generated file may contain one selector for several declarations or
combine compatible selectors during minification. Its formatting is not an
authored API. Verify behavior rather than editing its text.

---

## 7. Agent workflow

When implementing or changing a styled Maya UI, a coding agent must:

1. read `_karma/karma.ts` for the view root, stylesheet filename, assets
   directory, output directories, and TypeScript settings;
2. locate the single configured `styles.ts` source;
3. inspect its exported class type, overrides, compounds, and media
   constraints;
4. use existing built-in or application classes where they express the design;
5. add missing declarations or compounds to that same module;
6. import its `css` helper and route every `class` value through it;
7. use `css.when`/`css.cases` for finite reactive outcomes;
8. run the project type-check and tests;
9. run `brahma publish`; and
10. inspect the generated CSS and verify the page at narrow and wide viewport
    sizes, including interaction and reduced-motion states.

Before handoff, confirm:

- [ ] No authored `.css` file was created or changed by the agent.
- [ ] No inline or injected CSS was added.
- [ ] Every application class passes through the typed `css` helper.
- [ ] Every possible reactive styling outcome is statically declared.
- [ ] Custom rules and compounds live in the single configured `styles.ts`.
- [ ] The page links the generated stylesheet at the correct route-safe path.
- [ ] Type-check, build, browser behavior, and responsive states pass.
