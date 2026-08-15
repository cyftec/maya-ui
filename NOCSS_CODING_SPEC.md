# Maya NoCSS Coding Specification

**Status:** normative styling contract

**Audience:** coding agents and engineers building Maya applications

**Read with:** [`MAYA_APP_CODING_SPEC.md`](./MAYA_APP_CODING_SPEC.md) and the applicable domain profile

NoCSS is Maya's self-contained styling system. Application code declares typed class names in TypeScript, Brahma observes which names are used while building the pages, and the NoCSS compiler writes the minified application stylesheet. The authored source remains TypeScript; `styles.css` is generated output.

---

## 1. Coding-agent contract

For coding agents, NoCSS is the only permitted way to author CSS-based styles in a Maya application. This restriction does not apply to human contributors.

A coding agent MUST:

1. use the project's configured NoCSS `styles.ts` as the single stylesheet source;
2. import its typed `css` helper and pass every `class` value through it;
3. express custom declarations, responsive constraints, and reusable class groups through the NoCSS configuration maps;
4. preserve the generated `styles.css` link required by the page; and
5. build the app and verify the generated stylesheet and the rendered result.

A coding agent MUST NOT:

- create or edit an authored `.css` file;
- use an inline `style` attribute or property;
- generate `style` or SVG style-element content;
- inject CSS text at runtime;
- introduce another CSS framework, preprocessor, CSS module, or styling dependency;
- put a raw class string directly in a Maya element;
- hide an unknown class with a cast, `any`, or a broad `string`; or
- edit generated staging or production CSS.

Existing human-authored CSS that is unrelated to the task may remain. When an agent is asked to change an existing style, the changed behavior must be moved into NoCSS rather than extending the old stylesheet.

Canvas context properties such as `fillStyle`, `strokeStyle`, shadows, and fonts control canvas pixels rather than DOM CSS. They remain valid inside a canvas renderer. Style the canvas element, HUD, menus, and other DOM through NoCSS.

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

With that configuration, Brahma recognizes one stylesheet source inside the app view and emits it as:

```text
dev/view/pages/assets/styles.ts  ->  stage/assets/styles.css
                                  ->  docs/assets/styles.css (production)
```

Paths vary when Karma changes `appViewDir`, `assetsDirName`, or the publish directory. Read the project configuration instead of assuming the example paths. Only one file whose basename equals `buildableStylesheetFileName` may exist inside `appViewDir`; Brahma rejects multiple configuration files.

`brahma create` installs the initial NoCSS probe. If that source is missing or damaged, `brahma reset --stylesheet` restores the configured probe and overwrites the existing file. Do not run that reset against intentional stylesheet changes without preserving them first.

The page still links the generated asset:

```ts
m.Link({ rel: "stylesheet", href: "/assets/styles.css" });
```

That link consumes NoCSS output. It does not authorize a second handwritten stylesheet.

---

## 3. Stylesheet module

A NoCSS stylesheet module exports its configuration, derives the complete class-name type, and creates one typed helper:

```ts
import {
  defineCompoundClasses,
  getCss,
  type AppAtomicClassNames,
  type AppClassNames,
  type AtomicClassOverrides,
  type AtomicClassName,
  type ClassNamesPhrase,
  type MediaConstraintsOverrides,
} from "@cyftec/maya/nocss";

export const mediaConstraintsOverrides = {
  ns: { minWidth: "30em" },
  m: { minWidth: "30em", maxWidth: "60em" },
  l: { minWidth: "60em" },
} as const satisfies MediaConstraintsOverrides;

export const atomicClassOverrides = {
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

type AppAtomicClassName = AppAtomicClassNames<
  AtomicClassName,
  typeof atomicClassOverrides
>;

export const compoundClasses = defineCompoundClasses<AppAtomicClassName>()({
  card: "bg-theme pa3 br3",
  action: "ph3 pv2 br2 focus-theme",
});

export type { ClassNamesPhrase };
export type ClassName = AppClassNames<
  AtomicClassName,
  typeof atomicClassOverrides,
  typeof compoundClasses
>;

export const css = getCss<ClassName, typeof compoundClasses>(compoundClasses);
```

Keep the atomic maps `as const`. Define compounds with `defineCompoundClasses()` so TypeScript validates their values where they are declared.

### 3.1 Base and overridden classes

`AtomicClassName` contains Maya's built-in atomic classes, including responsive `-ns`, `-m`, and `-l` variants. Use editor completion on `css("...")` and the `ClassName` type to discover available names.

`atomicClassOverrides` has four optional groups:

- `default`: rules without a media query;
- `ns`: rules within the not-small constraint;
- `m`: rules within the medium constraint; and
- `l`: rules within the large constraint.

An override with an existing name replaces that built-in declaration. A new name adds an application class. A selector suffix such as `:hover`, `:focus`, or `:focus-visible` belongs on the configuration key, while application code uses only the class portion:

```ts
// styles.ts
export const atomicClassOverrides = {
  default: {
    "action:hover": "{ background-color: #eee; }",
    "action:focus-visible": "{ outline: .1875rem solid currentColor; }",
  },
} as const satisfies AtomicClassOverrides;

// component.ts
m.Button({ class: css("action"), children: "Save" });
```

Declarations include their surrounding braces. Custom properties, logical properties, grid, and other class-level browser CSS declarations belong inside these typed NoCSS rules when the built-in classes do not cover the requirement.

### 3.2 Responsive constraints

The default media groups are:

- `ns`: `min-width: 30em`;
- `m`: `min-width: 30em` and `max-width: 60em`; and
- `l`: `min-width: 60em`.

`mediaConstraintsOverrides` partially replaces those boundaries. Use the responsive class registered for the matching group, such as `pa2-ns`, `pa2-m`, or a custom `page-grid-ns`. Do not branch the initial Maya tree from `window.innerWidth` merely to change layout.

### 3.3 Compound classes

`compoundClasses` is a typed map from a reusable UI-role name to known atomic classes:

```ts
export const compoundClasses = defineCompoundClasses<AppAtomicClassName>()({
  surface: "bg-white near-black pa3",
  card: "bg-white near-black pa3 br3 shadow-1",
});
```

Calling `css("card")` returns `"bg-white near-black pa3 br3 shadow-1"` for the element's `class` attribute and registers those five atoms. A compound name is never written to the DOM or emitted as a selector in `styles.css`; it is an authoring-map key only.

`defineCompoundClasses()` validates every entry at its declaration: its name cannot shadow an atom, its value must be a literal phrase of two or more known atoms, and it cannot reference another compound. Repeat the atomic phrase when two roles overlap; compounds are deliberately flat.

**Hard rule:** a `compoundClasses` entry must name a meaningful UI role and must contain two or more atomic class names. Never put an atomic alias such as `"theme-col": "c-orange"`, `"fg7": "flex-7"`, or `"bg-pale": "bg-paper"` in `compoundClasses`; use the real atom directly.

#### 3.3.1 Purpose and decision rule

NoCSS has two deliberately different concepts. Their names are literal:

- An **atomic class** is the vocabulary for one visual concern: a factory utility such as `flex`, `flex-column`, `lh-solid`, `pa3`, or `white`; or a narrowly scoped application addition such as `c-orange` when that exact value is absent. The factory is the first and normal source of this vocabulary.
- A **compound class** is a readable TypeScript map key which _clubs multiple atomic class names together_. For example, `"footer-logo-copy": "flex flex-column lh-solid"`. It introduces no new visual primitive, DOM class, or CSS declaration of its own.

The authoring decision is therefore:

1. The factory supplies the broad, reusable atomic vocabulary. Use it first.
2. If a needed property/value is absent, add a narrowly scoped atomic override to `atomicClassOverrides`. This is how an app can tune an existing atom or add a new one without changing the factory; use that atom directly.
3. Use `compoundClasses` only to club two or more atoms under a readable, reusable UI-role name such as `footer-logo-copy` or `docs-nav`.

Do not turn `compoundClasses` into a compatibility layer for names from a deleted stylesheet. If an old class maps to exactly one atom, replace its use with that atom and delete the old name. If it maps to several atoms and describes a UI role, it is a compound. If it needs a property/value missing from the factory, add an atomic override first and then, only when useful, include it in a compound.

Agents migrating a site must inventory the factory before creating overrides and review every compound against this rule. Rendering equivalently is not enough: a one-atom compound or a component-sized override defeats the atomic vocabulary, reuse, and auditability that NoCSS is designed to provide.

Prefer a compound when a meaningful UI role repeatedly uses the same group of atomic rules. Prefer an overridden atomic class when the application needs a declaration the built-in vocabulary does not provide.

Use this decision tree for every styling need:

1. For one visual concern, use an existing atomic class when it matches. If an existing atom needs a different declaration, override that atom. If no atom exists, add one narrowly scoped atomic override and use it directly.
2. For a combination of concerns, use an existing compound when it matches. Otherwise, first resolve each concern through step 1, then create a flat compound from those atoms.

---

## 4. Applying classes

Import `css` from the app stylesheet module, not directly from the Maya package. The app helper carries its exact class-name vocabulary:

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
m.Main({ class: "center mw8 pa3" }); // Forbidden for agents.
```

Calling `css` validates each word, expands any compound key to its atomic phrase, registers only those atoms for build-time generation, and returns a value suitable for Maya's reactive `class` attribute.

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

`css` combines validated class phrases. Inputs may be literal classes, previously validated `ClassNamesPhrase` values, nullish optional values, or compatible signals. Empty and nullish inputs are omitted. If any input is a signal, the result is a derived signal.

```ts
const tone = signal<"green" | "red">("green");
const classes = css("pa3 br2", tone);
```

Use a narrow `ClassName` or `ClassNamesPhrase` type at API boundaries. A broad `string` is intentionally rejected because NoCSS cannot prove its words exist.

### 5.2 `css.when(condition, truthyPhrase, falsyPhrase)`

`css.when` selects between two class phrases and registers both outcomes during the static build:

```ts
class: css("pa3", css.when(selected, "bg-blue white", "bg-white black"));
```

Use it for a boolean visual state. Use `""` when one branch adds no class.

### 5.3 `css.cases(subject, cases, defaultPhrase?)`

`css.cases` maps class phrases to matching subject values. It uses the first match and registers every declared class phrase plus the optional default:

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

Case values may themselves be compatible signals. Omit the default when no match should produce an empty class phrase.

### 5.4 `css.ifNullable(value, fallbackPhrase)`

`css.ifNullable` uses its fallback only when the first value is `null` or `undefined`. An empty phrase remains empty:

```ts
class: css.ifNullable(optionalTone, "near-black");
```

The fallback is static and registered during the build. For a finite set of future signal values, prefer `css.when` or `css.cases` so every possible rule is generated.

### 5.5 Static-build completeness

Brahma can emit only classes registered while statically building the app. `css.when` and `css.cases` deliberately register all declared outcomes. A direct signal passed to `css` or `css.ifNullable` registers the value observed during the build, but a new value first encountered later in the browser cannot add a rule to the already generated stylesheet.

Therefore, model finite runtime styling states with `css.when` or `css.cases`. Do not rely on a direct broad signal, user input, server text, or string interpolation to reveal a new class after mount.

---

## 6. Build behavior

For each app build, Brahma:

1. clears the NoCSS usage registry;
2. bundles and statically renders every Maya page;
3. collects class names passed through the app's `css` helper;
4. imports the configured `styles.ts` maps;
5. validates compounds, then selects only the registered atomic rules;
6. wraps responsive groups in their media queries;
7. writes and minifies `styles.css` under the configured output assets directory.

Unknown names are rejected by the typed helper during type-checking. The compiler also rejects unknown collected names, invalid compound maps, and any compound name that reaches it unexpanded. There is no silent omission path.

The generated stylesheet contains atomic selectors only. A compound such as `card: "ba br4 pa3"` may cause `.ba`, `.br4`, and `.pa3` to be emitted when used, but it can never cause `.card` to be emitted.

The generated file may contain one selector for several declarations or combine compatible selectors during minification. Its formatting is not an authored API. Verify behavior rather than editing its text.

---

## 7. Agent workflow

When implementing or changing a styled Maya UI, a coding agent must:

1. read `_karma/karma.ts` for the view root, stylesheet filename, assets directory, output directories, and TypeScript settings;
2. locate the single configured `styles.ts` source;
3. inspect its exported class type, overrides, compounds, and media constraints;
4. use existing built-in or application classes where they express the design;
5. add missing declarations or compounds to that same module;
6. import its `css` helper and route every `class` value through it;
7. use `css.when`/`css.cases` for finite reactive outcomes;
8. run the project type-check and tests;
9. run `brahma publish`; and
10. inspect the generated CSS and verify the page at narrow and wide viewport sizes, including interaction and reduced-motion states.

Before handoff, confirm:

- [ ] No authored `.css` file was created or changed by the agent.
- [ ] No inline or injected CSS was added.
- [ ] Every application class passes through the typed `css` helper.
- [ ] Every possible reactive styling outcome is statically declared.
- [ ] Custom rules and compounds live in the single configured `styles.ts`.
- [ ] The page links the generated stylesheet at the correct route-safe path.
- [ ] Type-check, build, browser behavior, and responsive states pass.

## 8. Migrating an existing stylesheet to NoCSS

NoCSS is straightforward for a new page because the author begins with typed classes. Converting an inherited CSS site is a deliberate refactor, not a mechanical file rename: a traditional stylesheet can express global rules, descendant selectors, arbitrary media queries, and keyframes independently of the element tree, while NoCSS emits rules for the classes that the application explicitly registers.

### 8.1 What an agent should inspect first

Before changing source, inventory all of the following:

1. the configured stylesheet source and generated stylesheet destination in `_karma/karma.ts`;
2. every authored stylesheet, including `@import` rules and third-party stylesheets linked from route heads;
3. every `class` attribute, reusable `className`/`classNames` prop, dynamic class interpolation, and inline `style` attribute; and
4. each selector that is not already a built-in atomic class: component roots, state selectors, descendant selectors, breakpoint overrides, global rules, and animation rules.

Treat the stylesheet as a design inventory rather than as code to paste into a TypeScript object. Record which classes represent a reusable role, which are one-off declarations, and which styles belong on currently unclassified child elements.

### 8.2 Recommended conversion order

1. Create or restore the one configured `styles.ts` source and export the normal typed `css` helper.
2. Search the base atomic factory before authoring anything. A component role such as `footer-logo-copy` should be a flat compound recipe such as `"flex flex-column lh-solid"`, never a pasted `{ display: flex; ... }` override. Define reusable visual roles with `defineCompoundClasses`; add an `atomicClassOverrides` entry only for a genuinely missing, single-purpose property/value (for example, a project colour token, a grid template, or a pseudo-state primitive). Then use that atom from a compound.
3. Change every live `class` attribute to `css(...)`. Change reusable prop boundaries from `string` to `ClassNamesPhrase` (or the helper result type when a reactive class value is intentionally accepted).
4. Replace finite dynamic interpolation such as `` `tone-${status}` `` with `css.when` or `css.cases`, so the build registers every outcome.
5. For a former descendant selector such as `.card h3`, put a meaningful typed class on that `h3` and define the rule directly. This makes styling ownership explicit and lets the compiler see the class.
6. Replace layout breakpoints with the `ns`, `m`, and `l` groups where they fit. Prefer intrinsically responsive grid and flex declarations when the old design only needed a fluid layout.
7. Remove the authored stylesheet and any external stylesheet used only for application presentation. Preserve the generated `/assets/styles.css` link; it is the build output consumed by the routes.
8. Type-check, publish, inspect the generated CSS, and test the mounted site at narrow and wide viewports plus its interactive states.

### 8.3 Current boundary of the public NoCSS model

`atomicClassOverrides` emits a class selector, optionally followed by a pseudo selector in the map key. It is well suited to missing atomic declarations, `:hover`, `:focus-visible`, and the three configured responsive groups. Component roles should compose those atoms in `compoundClasses`. It does not currently model arbitrary global selectors, descendant/combinator selectors, `@keyframes`, or arbitrary at-rules as first-class NoCSS configuration.

Do not bypass that boundary with a handwritten CSS file, a style attribute, or runtime-injected CSS. First decide whether the desired result can be expressed by adding explicit classes to the Maya tree and using the existing responsive groups. If it cannot—for example, a design fundamentally needs keyframes or a new at-rule—treat it as a NoCSS capability gap and extend the framework and its compiler deliberately, with types and tests, before using it in an app.

### 8.4 Lessons from a full-site migration

- The existing documentation is clear about normal NoCSS authoring, typed classes, and static-build completeness. It previously left the migration sequence implicit; this section supplies that missing route.
- The TypeScript errors are useful migration guidance, not friction to bypass: each unknown legacy class identifies a missing declared rule, and each broad `string` prop identifies a component boundary that hides styling ownership.
- The important migration judgement is distinguishing a _role_ from an _atom_. Roles such as `hero-title`, `footer-logo-copy`, and `docs-nav` belong as keys in `compoundClasses`; calling `css("hero-title")` expands them before markup is emitted. The underlying display, spacing, type, colour, and interaction pieces should come from the factory first, followed by narrowly named custom atoms only when the factory has no equivalent. A large component-shaped CSS string in `atomicClassOverrides` is a failed migration even if it renders correctly: it gives up the reuse and auditability that NoCSS is for.
- Visual fidelity usually requires small markup changes. Adding a semantic class to an image, heading, code block, or card item is clearer and safer than retaining a broad ancestor selector.
- A stylesheet import can hide dependencies such as Tachyons, syntax highlighting, or web-font CSS. Removing it requires an explicit decision: use NoCSS built-ins, add equivalent NoCSS declarations, change the asset strategy, or accept the intentional visual change. Never leave an accidental styling dependency behind.
- A full conversion should be considered complete only when no live authored stylesheet or inline style remains, all live class values pass through the typed helper, the generated stylesheet contains the registered rules, and browser verification confirms the resulting design remains usable.
