# The Portable Maya Application Specification

**Status:** normative agent handoff document  
**Audience:** coding agents and engineers who may have no access to the Maya source repository, its documentation site, or example applications  
**Primary packages:** `@cyftec/maya`, `@cyftec/signal`, and `@cyftec/brahma`  
**Required core import path:** `@cyftec/maya/core`

This file is designed to stand alone. A coding agent should be able to receive only this file and produce a conventional, maintainable, pixel-accurate Maya application that Brahma can compile. It also describes the observable framework contract in enough detail for an independent implementation of the same programming model.

Maya is not React with different names. It has no JSX, virtual DOM, component rerender loop, or client-side hydration algorithm. A Maya page is a TypeScript program that declares a DOM tree with maya-node getters. Brahma executes that program once in a build environment to emit static HTML, executes it again in the browser to attach behavior to that same HTML, and then lets signals update individual attributes or child positions directly.

---

## 1. Normative language

The words **MUST**, **MUST NOT**, **SHOULD**, **SHOULD NOT**, and **MAY** are requirements:

- **MUST / MUST NOT**: required for a valid conventional Maya app.
- **SHOULD / SHOULD NOT**: the strong default; deviate only for a documented reason.
- **MAY**: optional.

When this document distinguishes a current implementation detail from a stable authoring rule, app authors should follow the authoring rule. Framework implementers should preserve the documented observable behavior unless intentionally publishing a breaking change.

---

## 2. Non-negotiable rules for coding agents

Read these before generating any Maya code.

1. Import `m`, `component`, `fragment`, and core DOM types from **`@cyftec/maya/core`**. Do not import them from `@cyftec/maya`.
2. Every reusable unit that returns Maya UI **MUST** be declared with `component()` or `fragment()`. Do not create ordinary functions that accept props and return `m.Div(...)`, `m.Button(...)`, arrays of children, or other UI.
3. Declare component prop fields as their simple domain types. For example, write `label: string`, not `label: Signal<string> | string`, and `selected?: boolean`, not a hand-built union of every reactive form.
4. Let `component()` and `fragment()` normalize ordinary props. Inside their definition, a plain prop and a signal-backed prop share a signalified interface, so current values are consistently available through `.value`.
5. Keep state ownership explicit. Pass a plain value prop plus an intent callback such as `value: number` and `onChange(next: number)` instead of giving a component a caller-owned mutable signal.
6. Functions, callbacks, and Maya node getters pass through prop normalization. Call callbacks normally; do not use `.value` on them.
7. Use `component()` when the reusable unit returns one Maya child. Use `fragment()` when it can return multiple siblings or a broader `Children` value.
8. A route entry file exports one default Maya root node-getter, normally a node-getter returned by `m.Html(...)` element's invocation.
9. Never use `innerHTML`. Express text as children and structure as `m.*` elements.
10. Do not read `window`, `document`, element layout, random numbers, the current time, browser storage, or location while constructing the initial page tree. Build and browser mount must construct the same tree in the same node-getter order.
11. Use `onmount`, events, or browser-only non-page scripts for browser APIs.
12. Numbers and booleans are not text children. Convert them to strings, `tmpl` output, or another string-valued signal.
13. Use `undefined`, `m.If`, or `m.Switch` for conditional UI. Do not use `null` as a child.
14. Put visual styling in copied CSS files and use semantic class names. Inline styles are acceptable for small stateful values but are not the primary styling system.
15. Make pages accessible and responsive by construction: semantic HTML, keyboard-operable controls, visible focus, labels, sensible source order, reduced-motion support, and layouts that survive narrow and wide viewports.

### 2.1 The anti-pattern that agents must stop generating

This is ordinary TypeScript, but it is not conventional Maya component code:

```ts
// ❌ Do not make reusable UI with a plain function.
type ButtonProps = {
  label: string;
  coloured?: boolean;
};

export function Button(props: ButtonProps) {
  return m.Button({
    class: props.coloured ? "button button--coloured" : "button",
    children: props.label,
  });
}
```

It forces the author to reason about whether each incoming field is plain or signal-backed, bypasses Maya's prop normalization, and encourages inconsistent component APIs.

Use this instead:

```ts
import { component, m } from "@cyftec/maya/core";
import { tmpl } from "@cyftec/maya/signal";

type ButtonProps = {
  label: string;
  coloured?: boolean;
  onTap: (event: MouseEvent) => void;
};

export const Button = component<ButtonProps>(({ label, coloured, onTap }) =>
  m.Button({
    type: "button",
    class: tmpl`button ${() =>
      coloured?.value ? "button--coloured" : "button--plain"}`,
    onclick: onTap,
    children: label,
  }),
);
```

At a call site, both forms below are valid:

```ts
import { signal } from "@cyftec/maya/signal";

const liveLabel = signal("Save changes");

Button({ label: "Cancel", onTap: closeDialog });
Button({ label: liveLabel, coloured: true, onTap: saveChanges });
```

Inside `Button`, `label` always has a `.value`. If the caller provided a signal, passing the normalized `label` object directly as `children` also preserves fine-grained reactivity. Reading `label.value` while constructing the tree obtains a snapshot; read it in an event, an effect, `derive`, `tmpl`, or a signal-aware child/attribute path when updates must remain reactive.

### 2.2 The only acceptable ordinary functions near UI

Plain functions are appropriate for non-UI work such as formatting, parsing, validation, calculations, class-name composition, request conversion, or domain transformations:

```ts
const formatPrice = (value: number, currency: string): string =>
  new Intl.NumberFormat("en", { style: "currency", currency }).format(value);
```

A route entry may also assemble state and default-export a component invocation. The prohibition is specifically against reusable, prop-accepting plain functions that produce Maya UI.

---

## 3. Mental model: build, mount, and run

Maya has three relevant phases.

### 3.1 Build phase

Brahma loads a page module in a DOM-capable build environment, resets Maya's element counter, sets the phase to build, invokes the default-exported root node-getter, serializes the root node's `outerHTML`, and prepends `<!DOCTYPE html>`.

During this pass:

- `m.*` maya-node-getters create DOM nodes.
- stable `data-elem-id` markers are written into the generated HTML.
- signal values provide initial text and attributes.
- event handlers are not usefully interactive.
- `onmount` is not called.
- browser-only APIs cannot be assumed.

### 3.2 Mount phase

The emitted page loads its matching JavaScript bundle. Maya resets the same element counter and calls the same root node-getter again. Each node-getter locates the already-rendered node with its matching `data-elem-id`, attaches listeners and effects, and removes the temporary marker after mounting.

This is deterministic attachment, not HTML reconciliation. Build and mount must invoke node-getters in the same order.

### 3.3 Run phase

After mount, source-signal writes synchronously notify dependent effects. Maya mutates only the relevant text node, child position, or attribute. Components are not rerun as a rendering strategy, and there is no virtual-tree diff.

### 3.4 The deterministic-tree invariant

The initial build pass and browser mount pass **MUST** produce an equivalent node-getter call sequence.

Never do this at module load or component construction time:

```ts
// ❌ Build and browser can choose different branches.
const compact = window.innerWidth < 720;
const seed = Math.random();
const greeting = Date.now() % 2 ? "Hello" : "Welcome";
```

Use stable initial state, then adapt after mount:

```ts
import { component, m } from "@cyftec/maya/core";
import { signal } from "@cyftec/maya/signal";

const ViewportAwarePanel = component<{}>(() => {
  const compact = signal(false);

  return m.Section({
    class: compact.when.truthy().then("panel panel--compact", "panel"),
    onmount: () => {
      const media = window.matchMedia("(max-width: 45rem)");
      const synchronize = () => {
        compact.value = media.matches;
      };

      synchronize();
      media.addEventListener("change", synchronize);
    },
    children: "Viewport-aware content",
  });
});
```

For most layout adaptation, CSS media/container queries are better than JavaScript because they avoid lifecycle and cleanup concerns entirely.

---

## 4. Package imports

Use subpath imports explicitly:

```ts
import {
  component,
  fragment,
  m,
  type Child,
  type Children,
  type MayaNode,
  type MayaNodeGetter,
} from "@cyftec/maya/core";

import {
  compute,
  derive,
  dispose,
  effect,
  nullable,
  op,
  promstates,
  receive,
  signal,
  tmpl,
  transmit,
  value,
  type DerivedSignal,
  type Signal,
  type SourceSignal,
} from "@cyftec/maya/signal";

import { query } from "@cyftec/maya/toolkit";
```

`@cyftec/maya/signal` re-exports the signal system used by Maya. Application code can use that path consistently. Do not rely on a root `@cyftec/maya` export: the package contract is organized around subpaths.

---

## 5. The UI type system

The conceptual types are:

```ts
type RawChild = undefined | string;
type Child = RawChild | MayaNodeGetter;

// Conceptual, simplified form. The real type also accepts signalified variants.
type Children = Child | Child[] | Signal<Child> | Signal<Child[]>;

type AttributeValue = string | boolean | undefined;
```

An `MayaNodeGetter` is a callable object:

```ts
type MayaNodeGetter = (() => MayaNode) & {
  isMayaNodeGetter: true;
};
```

This matters because `m.Div(...)` does not immediately hand application code a stable mounted node. It returns a getter used in both build and mount. Calling a getter again during run can create a fresh node rather than retrieve the mounted one. For a mounted reference, capture it with `onmount` or use an event's `currentTarget`.

### 5.1 Valid and invalid children

Valid:

```ts
m.P({ children: "Static text" });
m.P({ children: tmpl`Count: ${count}` });
m.Div({ children: [m.Strong({ children: "Name" }), " — Maya"] });
m.Div({ children: undefined });
```

Invalid or misleading:

```ts
m.P({ children: 42 }); // ❌ Convert to "42" or a string signal.
m.P({ children: true }); // ❌ Boolean is not rendered text.
m.P({ children: null }); // ❌ Use undefined or conditional elements.
```

### 5.2 Element factory naming

Supported HTML, SVG, and MathML tag names are exposed as PascalCase members of `m`. SVG names that collide with HTML or Maya custom elements use the `Svg` prefix described in Section 22:

```ts
m.Html(...);
m.Head(...);
m.Meta(...);
m.Body(...);
m.Main(...);
m.H1(...);
m.Button(...);
m.Input(...);
m.Svg(...);
m.Path(...);
m.Circle(...);
m.SvgTitle(...);
m.Math(...);
m.Mfrac(...);
```

Props use HTML attribute spelling, not React property spelling:

```ts
m.Label({ for: "email", children: "Email address" });
m.Div({ class: "card", "data-state": "ready", "aria-live": "polite" });
m.Meta({
  "http-equiv": "content-security-policy",
  content: "default-src 'self'",
});
```

Use `class`, not `className`; `for`, not `htmlFor`; lower-case event names such as `onclick` and `oninput`.

### 5.3 Void elements

The following elements must not receive children:

`area`, `base`, `basefont`, `br`, `col`, `embed`, `frame`, `hr`, `img`, `input`, `link`, `meta`, `param`, `source`, `track`, and `wbr`.

```ts
m.Img({ src: "/assets/hero.webp", alt: "Dashboard preview" });
m.Input({ id: "email", name: "email", type: "email" });
```

### 5.4 Element references

Capture the actual mounted node within a component-local closure:

```ts
import { component, m, type MayaNode } from "@cyftec/maya/core";

type SearchBoxProps = { label: string };

export const SearchBox = component<SearchBoxProps>(({ label }) => {
  let inputNode: MayaNode<HTMLInputElement> | undefined;

  return m.Div({
    class: "search-box",
    children: [
      m.Label({ for: "site-search", children: label }),
      m.Input({
        id: "site-search",
        type: "search",
        onmount: (element) => {
          inputNode = element as MayaNode<HTMLInputElement>;
        },
      }),
      m.Button({
        type: "button",
        onclick: () => inputNode?.focus(),
        children: "Focus search",
      }),
    ],
  });
});
```

Do not store per-instance element references in a shared module variable.

---

## 6. `component()` and `fragment()`

These helpers are the standard Maya component boundary. They provide a disciplined external prop contract and a normalized internal prop interface.

### 6.1 `component()`

Use `component<P>()` when exactly one `Child` is returned:

```ts
import { component, m } from "@cyftec/maya/core";

type AvatarProps = {
  name: string;
  src: string;
  size?: "small" | "medium" | "large";
};

export const Avatar = component<AvatarProps>(({ name, src, size }) =>
  m.Img({
    class: `avatar avatar--${size?.value ?? "medium"}`,
    src,
    alt: name,
    width: "48",
    height: "48",
  }),
);
```

`component()` is equivalent in purpose to a `fragment()` constrained to a single returned child.

The example above passes `src` and `name` directly so signal-backed callers remain reactive. The class expression reads `size.value` eagerly and is therefore a snapshot. If `size` should change at runtime, make the class signal-aware:

```ts
class: tmpl`avatar avatar--${() => size?.value ?? "medium"}`,
```

### 6.2 `fragment()`

Use `fragment<P, R>()` when returning multiple siblings or a value best typed as `Children`:

```ts
import { fragment, m, type Child, type Children } from "@cyftec/maya/core";

type FieldProps = {
  label: string;
  control: Child;
  hint?: string;
};

export const Field = fragment<FieldProps, Children>(
  ({ label, control, hint }) => [
    m.Label({ class: "field__label", children: label }),
    control,
    m.If({
      subject: hint,
      isTruthy: () => m.Small({ class: "field__hint", children: hint }),
    }),
  ],
);
```

Use `fragment()` even if the current implementation happens to return only one item when its semantic contract is a group that may grow.

### 6.3 External prop types and internal normalization

Write simple domain types:

```ts
type ButtonProps = {
  label: string;
  coloured?: boolean;
};
```

At a call site, ordinary fields accept either their plain value or a compatible signalified value. Conceptually:

```ts
Button({ label: "Publish", coloured: true });
Button({ label: signal("Publish"), coloured: signal(false) });
```

Inside the component definition:

- a plain value is wrapped as a non-reactive signalified object;
- an incoming source or derived signal stays signal-backed;
- both expose a current `.value`;
- functions pass through unchanged;
- Maya node getters pass through unchanged;
- child-shaped props receive child-compatible treatment;
- an omitted optional property may be `undefined` at runtime, so use `optional?.value` when it can be absent.

This means component code can consistently write:

```ts
const currentLabel = label.value;
const shouldColour = coloured?.value ?? false;
```

Do not pollute every prop declaration with `string | Signal<string>` unions. The wrapper already provides that external flexibility.

### 6.4 Reactive use versus snapshot use

The expression location determines whether later signal changes are observed.

```ts
export const StatusChip = component<{
  label: string;
  active: boolean;
}>(({ label, active }) =>
  m.Span({
    // Reactive: tmpl establishes signal dependencies.
    class: tmpl`status-chip ${() => (active.value ? "is-active" : "is-idle")}`,

    // Reactive: the signalified object itself is passed as a child.
    children: label,
  }),
);
```

This intentionally takes a snapshot:

```ts
children: label.value;
```

That is correct only when the initial value is all that is wanted. Reading `.value` inside an event is also correct because it reads the latest value at event time:

```ts
onclick: () => console.log(label.value),
```

### 6.5 State changes across a component boundary

Ordinary fields are value contracts. Preserve that contract and expose an intent callback when the child can request a change:

```ts
import { component, m } from "@cyftec/maya/core";
type QuantityStepperProps = {
  quantity: number;
  minimum?: number;
  onChange: (nextQuantity: number) => void;
};

export const QuantityStepper = component<QuantityStepperProps>(
  ({ quantity, minimum, onChange }) =>
    m.Div({
      class: "stepper",
      children: [
        m.Button({
          type: "button",
          onclick: () => {
            onChange(Math.max(minimum?.value ?? 0, quantity.value - 1));
          },
          children: "Decrease",
        }),
        m.Output({ children: tmpl`${quantity}` }),
        m.Button({
          type: "button",
          onclick: () => onChange(quantity.value + 1),
          children: "Increase",
        }),
      ],
    }),
);
```

The caller keeps mutation authority:

```ts
const quantity = signal(1);

QuantityStepper({
  quantity,
  minimum: 1,
  onChange: (nextQuantity) => {
    quantity.value = nextQuantity;
  },
});
```

This also avoids a current type-level sharp edge: runtime normalization recognizes incoming signals, but explicitly declaring a component prop itself as `SourceSignal<T>` does not reliably satisfy the generic mapped prop types for every `T`. Plain domain props plus callbacks are the stable convention.

### 6.6 `children` props

Declare a child slot with Maya's child types rather than `unknown`:

```ts
import { component, m, type Children } from "@cyftec/maya/core";

type CardProps = {
  title: string;
  children: Children;
};

export const Card = component<CardProps>(({ title, children }) =>
  m.Article({
    class: "card",
    children: [
      m.H2({ class: "card__title", children: title }),
      m.Div({ class: "card__body", children }),
    ],
  }),
);
```

An node getter is a function, but it is specifically recognized as a child and must not be invoked manually when passing it through.

### 6.7 Component design rules

- Keep state as close as possible to the component that owns it.
- Name event props by intent (`onSave`, `onDismiss`) and DOM events by Maya's DOM spelling (`onclick`, `oninput`).
- Prefer a small number of domain props over an open bag of DOM props.
- Preserve semantic HTML; do not turn every component into nested `div`s.
- Do not create wrapper components whose only purpose is avoiding one line of `m.*` code.
- Do create components for repeated structure, reusable behavior, accessible control patterns, or meaningful visual primitives.
- Put component styles beside the app's CSS architecture and keep class contracts explicit.

---

## 7. Elements, attributes, and events

### 7.1 Static and reactive attributes

Attributes accept plain values or compatible signals. Static values are written immediately. Signal-backed attributes register effects during browser mount and update in run phase.

```ts
const busy = signal(false);
const destination = signal("/account");

m.A({
  class: busy.when.truthy().then("link is-busy", "link"),
  href: destination,
  "aria-busy": busy.when.truthy().then("true", "false"),
  children: "Account",
});
```

Current attribute behavior:

- boolean `true` creates an empty boolean attribute;
- boolean `false` removes that attribute;
- the `value` prop updates the DOM element's `.value` property and uses `""` for `undefined`;
- for other attributes, current runtime behavior can serialize `undefined` as an empty-string attribute rather than removing it.

Therefore, model truly absent non-boolean attributes deliberately. Prefer a conditional element or a defined safe fallback if the distinction between missing and empty matters.

### 7.2 URL and style safety

Maya rejects dangerous decoded and trimmed URL schemes in `href`, including `javascript:`, `data:`, `vbscript:`, and `file:`.

Inline style values are rejected when they contain dangerous constructs such as `url(`, `expression(`, or those unsafe schemes. Prefer classes and trusted external stylesheets. Do not try to bypass these protections.

### 7.3 DOM events

Event props begin with `on` and use lower-case DOM event names:

```ts
m.Form({
  onsubmit: (event) => {
    event.preventDefault();
    submitForm();
  },
  children: [
    m.Input({
      name: "query",
      type: "search",
      oninput: (event) => {
        const input = event.currentTarget as HTMLInputElement;
        search.value = input.value;
      },
    }),
  ],
});
```

Handlers must be functions. An invalid `on*` prop is rejected or logged rather than becoming a normal HTML attribute.

Current runtime compatibility note: the `onkeypress` path calls `preventDefault()` before invoking the supplied handler. Prefer `onkeydown` for modern keyboard behavior unless that `keypress` behavior is intentional.

### 7.4 `onmount` and `onunmount`

`onmount` is a Maya lifecycle event. In the browser, it is scheduled asynchronously after the node has mounted and receives the real element:

```ts
m.Dialog({
  onmount: (element) => {
    (element as HTMLDialogElement).showModal();
  },
  children: "Ready",
});
```

`onunmount` activates removal observation and is called when the element is removed. Maya's default unmount behavior disposes element-bound effects; a user handler composes with that cleanup.

```ts
m.Div({
  onunmount: () => {
    subscription.close();
  },
  children: "Live feed",
});
```

If `onmount` adds a global event listener or observer, the component should arrange corresponding cleanup. Prefer CSS or element-scoped events when possible.

### 7.5 Text, escaping, and raw markup

Text children are text nodes. This is the safe default and protects user content from becoming executable markup.

```ts
m.P({ children: userSuppliedText });
```

Maya apps **MUST NOT** use `innerHTML`. If rich user-authored content is a product requirement, parse and sanitize it in a separate trusted subsystem, then convert the sanitized structure into explicit Maya elements.

---

## 8. Styling for pixel-accurate applications

Pixel accuracy is mostly an explicit CSS and asset discipline. Maya imposes no visual abstraction layer; use the browser platform deliberately.

### 8.1 Required head setup

Every normal page should include at least:

```ts
m.Head({
  children: [
    m.Meta({ charset: "utf-8" }),
    m.Meta({
      name: "viewport",
      content: "width=device-width, initial-scale=1",
    }),
    m.Title({ children: "Application name" }),
    m.Link({ rel: "stylesheet", href: "/styles.css" }),
  ],
});
```

### 8.2 CSS foundation

A serious app should define:

- color, typography, spacing, radii, shadows, and motion as custom properties;
- an explicit box-sizing reset;
- consistent body margin, background, foreground, and font rendering;
- responsive type and spacing, often with `clamp()`;
- container widths and gutters;
- hover, active, disabled, error, loading, and empty states;
- visible `:focus-visible` treatment;
- reduced-motion behavior;
- stable media dimensions or `aspect-ratio` to prevent layout shift.

Recommended baseline:

```css
:root {
  color-scheme: light;
  --ink: #161616;
  --paper: #f7f5ef;
  --accent: #5b45ff;
  --space-1: 0.25rem;
  --space-2: 0.5rem;
  --space-3: 0.75rem;
  --space-4: 1rem;
  --space-6: 1.5rem;
  --space-8: 2rem;
  --radius: 0.875rem;
  --content: 72rem;
  font-family:
    Inter,
    ui-sans-serif,
    system-ui,
    -apple-system,
    BlinkMacSystemFont,
    "Segoe UI",
    sans-serif;
  font-synthesis: none;
  text-rendering: optimizeLegibility;
}

*,
*::before,
*::after {
  box-sizing: border-box;
}

html {
  min-width: 20rem;
  background: var(--paper);
}

body {
  min-height: 100vh;
  margin: 0;
  color: var(--ink);
  background: var(--paper);
}

button,
input,
textarea,
select {
  font: inherit;
}

img,
svg {
  display: block;
  max-width: 100%;
}

:focus-visible {
  outline: 3px solid color-mix(in srgb, var(--accent), white 25%);
  outline-offset: 3px;
}

@media (prefers-reduced-motion: reduce) {
  *,
  *::before,
  *::after {
    scroll-behavior: auto !important;
    animation-duration: 0.01ms !important;
    animation-iteration-count: 1 !important;
    transition-duration: 0.01ms !important;
  }
}
```

### 8.3 Pixel-perfect implementation procedure

When implementing from a design reference:

1. Inventory exact fonts, weights, icons, images, gradients, and breakpoints before coding.
2. Establish design tokens before component-specific rules.
3. Match semantic structure and source order first.
4. Match major layout geometry: container width, grid, gutters, alignment, and vertical rhythm.
5. Match type metrics: family, weight, size, line height, letter spacing, and wrapping width.
6. Match component geometry: padding, gap, border, radius, shadow, and state layers.
7. Implement responsive behavior explicitly; do not merely shrink desktop dimensions.
8. Compare screenshots at the same viewport and device-pixel ratio.
9. Use overlays or image-difference tooling to find drift.
10. Verify keyboard, focus, motion preferences, zoom, and real-content overflow after the visual match.

Do not replace a provided asset with an arbitrary emoji or mismatched icon. If an exact raster/vector asset is unavailable, create a faithful CSS/SVG primitive only when the design permits it, and document the substitution.

---

## 9. Signals and fine-grained reactivity

Signals are values with observable reads and writes. A source signal owns mutable state; a derived signal computes read-only state; an effect performs work when its initially discovered dependencies change.

### 9.1 Creating and updating state

```ts
import { signal } from "@cyftec/maya/signal";

const count = signal(0);
const message = signal("Ready");
const enabled = signal(true);
const profile = signal({ name: "Ari", role: "Designer" });
const tags = signal(["maya", "typescript"]);

count.value += 1;
message.value = "Saved";
enabled.toggle();
profile.set({ role: "Engineer" });
tags.push("signals");
```

Signal writes notify dependents synchronously. Values are stored through Maya's immutable data layer; reads provide cloned immutable-safe values rather than a mutable reference that should be edited in place.

Always write through the signal API:

```ts
// ✅ Replace through .value or a supplied mutator.
profile.value = { ...profile.value, name: "Mina" };
profile.set({ name: "Mina" });

// ❌ Do not assume mutating a read result changes the signal.
profile.value.name = "Mina";
```

When the initial value is nullable but the desired method family is known, the signal factory supports an optional non-null exemplar/type-guiding value. Prefer a well-typed explicit declaration when inference becomes unclear.

### 9.2 Reading values

Use `.value` when you know the input is signalified:

```ts
console.log(count.value);
```

Use `value(input)` when an API accepts either a signal or a plain value:

```ts
import { value, type MaybeSignal } from "@cyftec/maya/signal";

const double = (input: MaybeSignal<number>) => value(input) * 2;
```

Reading `.value` or calling `value()` within an active `derive`/`effect` registers the signal as a dependency.

### 9.3 Derived state

```ts
import { derive, tmpl } from "@cyftec/maya/signal";

const firstName = signal("Ada");
const lastName = signal("Lovelace");

const greeting1 = derive(() => `Welcome, ${firstName.value} ${lastName.value}`);
const greeting2 = tmpl`Welcome, ${firstName} ${lastName}.`;
```

A derived signal:

- has `type: "derived-signal"`;
- exposes read-only `.value` and `.prevValue`;
- recomputes synchronously when a dependency changes;
- can be disposed;
- receives type-specific read methods based on its initial value.

The callback may receive the old derived value:

```ts
const accumulated = derive((oldValue) => (oldValue ?? 0) + increment.value);
```

Avoid side effects inside a derivation. Its job is to calculate a value.

### 9.4 Effects

```ts
import { effect } from "@cyftec/maya/signal";

const countLogger = effect(() => {
  console.log(`Current count: ${count.value}`);
});

// Later:
countLogger.dispose();
```

An effect runs immediately and registers signal reads made during that initial run. Later writes rerun it synchronously.

Important dependency rule: the dependency set is established by the initial execution; it is not dynamically rebuilt on every rerun. Therefore this is unsafe if `details.value` is false initially:

```ts
effect(() => {
  if (details.value) {
    // This read may not be tracked if the branch was initially skipped.
    console.log(description.value);
  }
});
```

Read all dependencies unconditionally, then branch:

```ts
effect(() => {
  const showDetails = details.value;
  const currentDescription = description.value;

  if (showDetails) {
    console.log(currentDescription);
  }
});
```

Disposal is supported on effects and derived signals. Disposed dependencies may be removed lazily on a later source update, so application code should treat disposal as a semantic stop, not inspect internal listener arrays.

### 9.5 Template (`tmpl`)

`tmpl` is the preferred way to construct reactive strings:

```ts
const completed = signal(3);
const total = signal(8);
const summary = tmpl`${completed} of ${total} complete`;

m.P({ children: summary });
```

Interpolations may be signals, plain values, or functions. `null` and `undefined` interpolations become empty strings. Functions should be understood as a potential derived-signal getter method and reading dependent signals with `.value` ensures that final `tmpl` derived signal is reactive to the dependent signals which are used inside the Function:

```ts
const className = tmpl`card ${() => (selected.value ? "is-selected" : "")}`;
```

Getting the dependent signal's value with `${dependentSignal.value}` only gets the current snapshot of the signal and doesn't make the derived signal (with `tmpl`) reactive to the dependent signal. Use signal directly if it's a signal string, boolean or number, otherwise a Function if it's something complex and need to be derived with `.value`:

```ts
// ❌ Do not assume mutating a dependent signal changes the derived template signal.
const className = tmpl`card ${colorCssClass.value}`;

// ✅ Use primitive signals directly or derive through a function.
const className = tmpl`card ${colorCssClass}`;
const userProfile = tmpl`Profile: ${() => nameObject.value.firstName} (${country})`;
```

### 9.6 `compute`, `receive`, and `transmit`

`compute` derives a value from signal-or-value arguments:

```ts
const subtotal = compute(
  (unitPrice: number, quantity: number) => unitPrice * quantity,
  price, // price can be 20 or signal(20) or getNonSignalObject(20)
  amount, // amount can be 100 or signal(100) or getNonSignalObject(100)
);
```

`receive(receiver, ...transmitters)` creates one effect per transmitter and returns the effect array. Each transmitter's current value is immediately written into the source-signal receiver, and later changes continue to flow there.

`transmit(transmitter, ...receivers)` creates and returns one effect that broadcasts the transmitter's value to all source-signal receivers. Dispose the returned effect/effects to disconnect them. Use connectors only when synchronization is truly intended; a single source of truth plus derivations is easier to reason about.

### 9.7 Promise state

`promstates` converts an asynchronous operation into signals:

```ts
const [runSave, saveResult, saveError, isSaving] = promstates(
  async (payload: ProfileInput) => await saveProfile(payload),
);

m.Button({
  type: "button",
  disabled: isSaving,
  onclick: () => runSave(formState.value),
  children: isSaving.when.truthy().then("Saving…", "Save"),
});
```

On success, the result updates and the error clears. On failure, the error updates while a previous successful result may remain. Always render error and loading state independently rather than assuming the result is cleared.

### 9.8 Object signals

Object source signals provide:

- `.set(partial)` for a shallow patch;
- `.keys()` for a derived key list;
- `.get(key)` for a derived property;
- `.props()` for property-level derived signals.

```ts
const user = signal({ name: "Lin", online: false });
const name = user.get("name");
const { online } = user.props();

user.set({ online: true });
```

The current method is `.get("field")` or `.props()`. Do not generate the outdated `.prop(...)` spelling.

### 9.9 Array signals

Array source signals provide immutable-update versions of common mutators:

`copyWithin`, `fill`, `pop`, `push`, `reverse`, `shift`, `sort`, `splice`, `unshift`, `keep`, and `remove`.

These update the source using a new array and return `void`; do not rely on native-array mutator return values.

Read-only/derived operations include:

`at`, `concat`, `every`, `filter`, `find`, `findIndex`, `findLast`, `findLastIndex`, `length`, `map`, `reduce`, `reduceRight`, `some`, `toReversed`, `toSorted`, `toSpliced`, `lastItem`, and `partition`.

These return derived signals where appropriate:

```ts
const tasks = signal([
  { id: "a", title: "Audit", done: true },
  { id: "b", title: "Ship", done: false },
]);

const openTasks = tasks.filter((task) => !task.done);
const taskCount = tasks.length();
```

### 9.10 String, number, and boolean helpers

Boolean source signals provide `.toggle()`.

Number signals provide derived formatting and confinement helpers including:

`toExponential`, `toFixed`, `toPrecision`, `toLocaleString`, and `toConfined`.

String signals provide derived forms of:

`at`, `charAt`, `charCodeAt`, `codePointAt`, `concat`, `endsWith`, `includes`, `indexOf`, `lastIndexOf`, `padEnd`, `padStart`, `repeat`, `slice`, `startsWith`, `substring`, `trim`, `trimEnd`, `trimStart`, `length`, `localeCompare`, `normalize`, `replace`, `replaceAll`, `search`, `split`, `toLocaleLowerCase`, and `toLocaleUpperCase`.

Additional casing helpers are `lowercase()`, `Sentencecase()`, `TitleCase()`, and `UPPERCASE()`; their capitalization is significant.

### 9.11 Fluent logic

Signals expose readable derived logic, for example:

```ts
const visible = signal(true);
const role = signal("editor");
const score = signal(82);

const visibilityLabel = visible.when.truthy().then("Visible", "Hidden");
const canEdit = role.is.equalTo("editor");
const passing = score.is.greaterThanOrEqualTo(60);
const fallbackName = displayName.or("Anonymous");
```

Supported families include truthiness/falsiness, equality/inequality, number comparisons, and string/array length comparisons. Use TypeScript completion for the precise fluent spelling installed with the package; do not invent methods.

`nullable(input)` adds the same logical methods to a maybe-null primitive input. It accepts signalified `string`, `number`, `boolean`, `null`, or `undefined` values and is useful when optional chaining would otherwise interrupt a fluent condition:

```ts
const possiblyUndefinedNumber: SourceSignal<number> | undefined = count;
const label = nullable(possiblyUndefinedNumber)
  .when.greaterThan(0)
  .then("Tangible", "Intangible");
```

It returns an empty/non-useful logical surface for non-primitive data; use it only for primitives.

The `op(input)` utility provides a chainable alternative. Its exact generic chain operations are:

- `or`, `orNot`, `and`, `andNot`;
- `equals`, `notEquals`;
- `orBothEqual`, `orBothUnequal`, `andBothEqual`, `andBothUnequal`;
- `orThisIsLT`, `orThisIsLTE`, `orThisIsGT`, `orThisIsGTE`;
- `andThisIsLT`, `andThisIsLTE`, `andThisIsGT`, `andThisIsGTE`.

Result endpoints are `.result`, `.truthy`, `.falsy`, `.truthyFalsyPair`, and `.then(truthyValue, falsyValue)`.

Number operation chains additionally expose `add`, `sub`, `mul`, `div`, `mod`, `pow`, `isBetween`, `isLT`, `isLTE`, `isGT`, and `isGTE`. `isBetween(lower, upper, touchingLower = true, touchingUpper = true)` is inclusive by default.

String and array operation chains additionally expose `lengthBetween`, `lengthEquals`, `lengthNotEquals`, `lengthLT`, `lengthLTE`, `lengthGT`, and `lengthGTE`.

```ts
const total = op(price).mul(quantity).add(shipping).result;
const acceptable = op(total).isBetween(10, 100).truthy;
const hasUsefulQuery = op(searchText).lengthGTE(2).truthy;
```

### 9.12 Disposal

Dispose explicitly created long-lived derivations/effects when their lifetime is shorter than the application:

```ts
const doubled = derive(() => count.value * 2);
const watcher = effect(() => report(doubled.value));

dispose(watcher, doubled);
```

Element-bound reactive work created by Maya is disposed when the element unmounts. Application-created global effects remain the application's responsibility.

---

## 10. Declarative control flow

Use `m.If`, `m.Switch`, and `m.For` instead of constructing different initial trees with environment-dependent JavaScript.

### 10.1 `m.If`

```ts
const signedIn = signal(false);

m.If({
  subject: signedIn,
  isTruthy: () => m.P({ children: "Welcome back" }),
  isFalsy: () => m.A({ href: "/login", children: "Sign in" }),
});
```

Contract:

- `subject` may be a plain value or a signalified value.
- A signal subject yields a reactive child.
- A plain subject yields the selected child immediately.
- `isTruthy` and `isFalsy` are optional branch factories.
- A missing selected branch currently renders a hidden span (`display: none`) as a structural placeholder.

Use closures to read other values. Do not depend on an undocumented callback-argument shape.

### 10.2 `m.Switch`

```ts
const status = signal<"idle" | "loading" | "ready" | "error">("idle");

m.Switch({
  subject: status,
  cases: {
    idle: () => m.P({ children: "Choose an action" }),
    loading: () => m.P({ "aria-live": "polite", children: "Loading…" }),
    ready: () => m.P({ children: "Complete" }),
    error: () => m.P({ role: "alert", children: "Something went wrong" }),
  },
  defaultCase: () => m.P({ children: "Unknown state" }),
});
```

Normal matching stringifies the subject and compares it with case keys. A custom `caseMatcher(subjectValue, caseKey)` may override matching. With no match and no default, Maya uses a hidden-span placeholder.

### 10.3 Unkeyed `m.For`

Use unkeyed iteration for simple output where item identity and retained DOM state do not matter:

```ts
m.For({
  subject: tags,
  map: (tag) => m.Li({ children: tag }),
});
```

For an unkeyed list, the mapper receives plain item and index values. A signal subject produces a reactive child collection.

### 10.4 Keyed `m.For`

Use `itemKey` for object arrays when nodes must survive insertion, deletion, reorder, or item updates:

```ts
const tasks = signal([
  { id: "t-1", title: "Draft", done: false },
  { id: "t-2", title: "Review", done: true },
]);

m.Ul({
  class: "task-list",
  children: m.For({
    subject: tasks,
    itemKey: "id",
    map: (task, index) => {
      const { title, done } = task.props();

      return m.Li({
        class: done.when.truthy().then("task is-done", "task"),
        "data-index": tmpl`${index}`,
        children: title,
      });
    },
  }),
});
```

Keyed-list requirements:

- Items must be objects.
- The key property must exist and be unique within the list.
- The mapper receives a derived item signal and a derived index signal.
- Read a field with `task.get("title")` or destructure `task.props()`.
- Do not use the obsolete `.prop(...)` spelling.
- Matching keys preserve their existing element node and update item/index signals.
- The mapped getter is internally cached for that keyed item; application code should not implement its own node cache.

### 10.5 Insertion parameters

`m.For` supports `n` and `nthChild` together when its rendered group must be inserted at a particular child position. Supply both or neither. `n` must be non-negative; a value beyond the current child count appends.

Use ordinary layout structure whenever possible. Positional insertion is an advanced escape hatch, not a substitute for clear DOM composition.

---

## 11. Forms and state ownership

Maya inputs can use signals for their current `value`, but user input still needs an event handler to update the source signal.

```ts
import { component, m } from "@cyftec/maya/core";
import { signal, tmpl } from "@cyftec/maya/signal";

type NewsletterFormProps = {
  actionLabel: string;
  onSubscribe: (email: string) => Promise<void>;
};

export const NewsletterForm = component<NewsletterFormProps>(
  ({ actionLabel, onSubscribe }) => {
    const email = signal("");
    const error = signal<string | undefined>(undefined, "");
    const sending = signal(false);

    return m.Form({
      class: "newsletter",
      onsubmit: async (event) => {
        event.preventDefault();

        if (!email.value.includes("@")) {
          error.value = "Enter a valid email address.";
          return;
        }

        sending.value = true;
        error.value = undefined;

        try {
          await onSubscribe(email.value);
          email.value = "";
        } catch {
          error.value = "Subscription failed. Try again.";
        } finally {
          sending.value = false;
        }
      },
      children: [
        m.Label({ for: "newsletter-email", children: "Email address" }),
        m.Input({
          id: "newsletter-email",
          name: "email",
          type: "email",
          autocomplete: "email",
          required: true,
          value: email,
          "aria-describedby": "newsletter-error",
          oninput: (event) => {
            email.value = (event.currentTarget as HTMLInputElement).value;
          },
        }),
        m.Button({
          type: "submit",
          disabled: sending,
          children: tmpl`${() => (sending.value ? "Submitting…" : actionLabel.value)}`,
        }),
        m.P({
          id: "newsletter-error",
          role: "alert",
          children: error,
        }),
      ],
    });
  },
);
```

Form conventions:

- give every input an associated label;
- use a real `form` and `submit` event for submit behavior;
- call `preventDefault()` for client-handled submission;
- keep error copy in an `aria-live` or `role="alert"` region;
- use native input types, `required`, `autocomplete`, and constraints before recreating them;
- disable only when duplicate submission is harmful, and expose a visible loading label;
- focus the first invalid field for complex forms;
- never rely on placeholder text as the only label.

---

## 12. Data fetching

The toolkit exposes a lightweight GET helper:

```ts
import { query } from "@cyftec/maya/toolkit";

const { isLoading, data, error, runQuery, abortQuery, clearCache } = query<
  User[]
>("/api/users", undefined);
```

Treat `query` as a small request-state primitive, not a full server-state system. The current implementation does not provide a comprehensive caching, retry, deduplication, pagination, mutation, or background-refresh strategy. Its primary transport is GET. If an aborted query must be run again, prefer creating a fresh query instance because the current abort-controller lifecycle is limited.

For mutations or domain-specific transport, use `fetch` inside event/lifecycle code and model state with `promstates` or explicit signals.

Do not fetch during the page's build-time tree construction unless the build pipeline explicitly owns and stabilizes that data. Browser requests normally begin from an event or `onmount`.

---

## 13. Maya-compatible renderer blueprint

This section is for a reader implementing the framework contract from scratch. It is descriptive pseudocode, not application code.

### 13.1 Global phase and element identity

Maintain:

```ts
type Phase = "build" | "mount" | "run";

let phase: Phase = "build";
let elementCounter = 0;
```

Reset `elementCounter` before invoking a page root in both build and mount. Each node getter captures or obtains the next deterministic identifier in call order.

### 13.2 Element factory

Conceptual algorithm:

```ts
function createNodeGetter(tagName, props, namespace?) {
  const getter = () => {
    const id = nextElementId();
    let element;

    if (phase === "mount") {
      element = document.querySelector(`[data-elem-id="${id}"]`);
      assert(element, `Build/mount mismatch for ${tagName}#${id}`);
    } else {
      element = namespace
        ? document.createElementNS(namespace, tagName)
        : document.createElement(tagName);
    }

    element.elementId = id;
    element.effects = [];
    element.unmountListener = () => dispose(...element.effects);

    applyAttributes(element, props);
    attachChildren(element, props.children);
    attachEvents(element, props);

    if (phase === "build") {
      element.setAttribute("data-elem-id", String(id));
    }

    if (phase === "mount") {
      element.removeAttribute("data-elem-id");
    }

    return element;
  };

  getter.isMayaNodeGetter = true;
  return getter;
}
```

The current runtime creates a new node if a getter is invoked in run phase; therefore getters are construction handles, not stable element references.

The factory supplies the SVG namespace for every supported SVG member, including the `Svg*` collision aliases, and selects the MathML namespace for every supported MathML member. Namespace selection does not depend on the parent node already being attached.

### 13.3 Child attachment

For a static string, create a text node. For a node getter, invoke it and append the result. For arrays, attach members in order. For signal children, create an effect that replaces the DOM node(s) at the same insertion position. When a reactive array shrinks, remove trailing nodes previously owned by that signal child.

Do not use a virtual DOM. The signal-to-DOM effect owns the smallest relevant position.

### 13.4 Attribute attachment

For a plain attribute, set it during construction. For a signal attribute, establish an effect during mount and retain the effect on the element for unmount disposal.

Boolean handling is presence/removal. `value` writes the DOM property. URL/style sanitation runs before applying the value.

### 13.5 Event attachment

Recognize supported `on*` props. Convert the suffix to the native event name and attach the function with `addEventListener`. Handle `onmount` after mount and observe removals only when `onunmount` is used. Invalid event props should produce a clear diagnostic.

### 13.6 Component normalization

Conceptual `fragment` behavior:

```ts
function fragment(inner) {
  return (externalProps) => {
    const normalized = {};

    for (const [key, incoming] of Object.entries(externalProps)) {
      if (incoming === undefined) continue;

      if (isSignal(incoming) || typeof incoming === "function") {
        normalized[key] = incoming;
      } else if (isChildContract(key, incoming)) {
        normalized[key] = normalizeChild(incoming);
      } else {
        normalized[key] = nonSignalObject(incoming);
      }
    }

    return inner(normalized);
  };
}

function component(inner) {
  return fragment(inner); // with a one-Child return type constraint
}
```

The public TypeScript wrapper maps ordinary external properties to `MaybeSignal<T>` while preserving explicit signal types, callbacks, and children. The internal mapped type exposes signalified objects for ordinary values.

### 13.7 Signal engine

A minimal compatible engine needs:

1. source objects with synchronous `.value` get/set;
2. a global current-effect slot during initial dependency collection;
3. source reads that subscribe the current effect;
4. source writes that synchronously run subscribers;
5. derived signals backed by an internal source plus an effect;
6. effect/derived disposal;
7. type-specific methods layered over source, derived, and non-reactive signalified objects;
8. immutable-safe value storage/reads;
9. `value()` unwrapping and `tmpl` string derivation.

To match current behavior, dependencies are collected during an effect's initial execution and are not re-collected into a different set on later runs.

### 13.8 Build pipeline contract

For each page entry:

1. compile the TypeScript page for the build environment;
2. establish a DOM implementation;
3. set phase to build and reset IDs;
4. load the page module;
5. invoke its default export;
6. invoke the returned root node-getter;
7. serialize `<!DOCTYPE html>` plus root `outerHTML`;
8. compile the same page into its browser bundle;
9. ensure that bundle resets IDs, sets mount, invokes the page, and then enters run;
10. preserve all referenced/copied CSS and assets.

Fail loudly if the module has no default getter, the root is not an HTML element, or a mount marker cannot be found.

---

## 14. Brahma: project and build contract

Brahma is the Bun-first CLI that scaffolds, installs, stages, serves, and publishes Maya applications.

### 14.1 Prerequisites and installation

Install Bun, then install the CLI:

```sh
bun add --global @cyftec/brahma
brahma version
```

Create and run an app:

```sh
brahma create my-app --web
cd my-app
brahma install
brahma stage
```

Modes are `--web` (default), `--pwa`, and `--ext`.

The core commands and aliases are:

| Command                                      | Alias      | Purpose                                                                 |
| -------------------------------------------- | ---------- | ----------------------------------------------------------------------- |
| `brahma help`                                | `brahma h` | Show CLI help.                                                          |
| `brahma create <name> [--web\|--pwa\|--ext]` | `brahma c` | Create a scaffold.                                                      |
| `brahma install`                             | `brahma i` | Recreate generated config and install dependencies from `karma.ts`.     |
| `brahma install <package>`                   | `brahma i` | Add one package and synchronize it into `karma.ts`.                     |
| `brahma uninstall`                           | `brahma u` | Remove generated install artifacts.                                     |
| `brahma uninstall <package>`                 | `brahma u` | Remove one package and synchronize config.                              |
| `brahma stage`                               | `brahma s` | Build the staging directory, serve it, and watch source files.          |
| `brahma publish`                             | `brahma p` | Build the production output and minify page JavaScript.                 |
| `brahma reset [--soft\|--hard]`              | `brahma r` | Restore base Karma config; soft preserves app mode, hard resets to web. |
| `brahma version`                             | `brahma v` | Show Brahma and configured Maya versions.                               |
| `brahma version --v=<version>`               | `brahma v` | Change the globally installed Brahma version.                           |

`brahma install` without a package removes configured disposable install artifacts, generates `package.json` from `karma.maya`, runs Bun installation, and writes editor/git configuration. Keep authored source outside the disposable list.

### 14.2 Canonical directory layout

```text
my-app/
├── karma.ts
├── karma-types.ts
└── dev/
    ├── controllers.ts
    ├── models.ts
    ├── services/
    │   └── api.ts
    └── view/
        ├── elements/
        │   ├── Button.ts
        │   ├── Select.ts
        │   └── TextBox.ts
        ├── components/
        │   ├── SideNavigator.ts
        │   └── FeatureCard.ts
        └── pages/
            ├── assets/
            │   ├── fonts/
            │   └── images/
            ├── docs/
            │   └── page.ts
            ├── page.ts
            ├── CNAME
            └── styles.css
```

After `brahma stage`, the example maps to:

```text
stage/
├── assets/
│   ├── fonts/
│   └── images/
├── docs/
│   ├── index.html
│   └── main.js
├── index.html
├── main.js
├── CNAME
└── styles.css
```

Only `dev/view/pages` is the emitted static application. Reusable `elements` and `components` sit beside that boundary, while controllers, models, services, and other business logic can sit anywhere else under `dev`. A page can import all of them normally; Bun includes imported modules in the page bundle even though Brahma does not traverse those source directories as independent static output.

The directory responsibilities are intentionally different:

- `dev/view/elements`: small reusable interface primitives such as buttons, selects, text fields, badges, and accessible control wrappers. Every UI-producing export still uses `component()` or `fragment()`.
- `dev/view/components`: larger composed or domain-aware interface sections such as navigators, feature cards, forms, data panels, and dialogs. These can compose elements and other components.
- `dev/view/pages`: the public build tree. Route entries, route folders, copied styles/assets, `CNAME`, manifests, and independently emitted browser scripts belong here.
- the rest of `dev`: controllers, models, services, validation, data conversion, and other business logic that page bundles may import.

This layout deliberately avoids requiring an `@` prefix or another `ignoreDelimiter` convention for ordinary source modules. The configured delimiter remains available as an exceptional escape hatch for something located inside `appViewDir` that must not be emitted directly, but it is not the primary source-organization mechanism.

The essential boundary is `appViewDir: "dev/view/pages"`: files under `pages` define routes, independently emitted scripts, and copied public assets; files outside `pages` are private application source unless a page or emitted script imports them.

Imports from a root page are ordinary relative ESM imports—no delimiter prefix is involved:

```ts
import { Button } from "../elements/Button.js";
import { FeatureCard } from "../components/FeatureCard.js";
import { loadDashboard } from "../../controllers.js";
```

### 14.3 A self-contained `karma-types.ts`

A foreign project can use this exact type contract without importing from the Brahma repository:

```ts
export type AppMode = "web" | "ext" | "pwa";
export type KarmaResetMode = "soft" | "hard";

type FileNamesMap = Record<string, string>;

export type ProjectFileNames = {
  buildable: {
    appSrcDir: string;
    appViewDir: string;
    pageFile: `${string}.ts`;
    manifestFile: `${string}.ts`;
  } & FileNamesMap;
  static: {
    publishDir: string;
    dsStoreDir: ".DS_Store";
    karmaTypesFile: "karma-types.ts";
  } & FileNamesMap;
  disposable: {
    stagingDir: string;
  } & FileNamesMap;
};

export type Karma = {
  brahma: {
    build: {
      appSrcDir: string;
      appViewDir: string;
      skipErrorAndBuildNext: boolean;
      ignoreDelimiter: string;
      buildablePageFileName: string;
      buildableManifestFileName: string;
      stagingDir: string;
      publishDir: string;
      disposable: string[];
    };
    serve: {
      port: number;
      redirectOnStart: boolean;
      reloadPageOnFocus: boolean;
      watchDir: string;
      serveDir: string;
    };
  };
  maya: {
    name: string;
    appType: AppMode;
    version?: string;
    description?: string;
    author?: string;
    license?: string;
    type?: "module";
    devDependencies?: Record<string, string>;
    dependencies: Record<string, string>;
  };
  git: {
    ignore: string[];
  };
  vscode: {
    settings: {
      "deno.enable": boolean;
      "files.exclude": Record<string, boolean>;
    };
  };
};
```

### 14.4 Canonical `karma.ts`

The named export **MUST** be called `karma`.

```ts
import type { Karma, ProjectFileNames } from "./karma-types.ts";

const files = {
  buildable: {
    appSrcDir: "dev",
    appViewDir: "dev/view/pages",
    pageFile: "page.ts",
    manifestFile: "manifest.ts",
  },
  static: {
    publishDir: "prod",
    dsStoreDir: ".DS_Store",
    karmaTypesFile: "karma-types.ts",
    gitIgnoreFile: ".gitignore",
  },
  disposable: {
    stagingDir: "stage",
    dotVscodeDir: ".vscode",
    nodeModulesDir: "node_modules",
    bunLockFile: "bun.lock",
    bunLockBFile: "bun.lockb",
    packageJsonFile: "package.json",
  },
} as const satisfies ProjectFileNames;

// Do not rename this export.
export const karma: Karma = {
  brahma: {
    build: {
      appSrcDir: files.buildable.appSrcDir,
      appViewDir: files.buildable.appViewDir,
      skipErrorAndBuildNext: false,
      ignoreDelimiter: "@",
      buildablePageFileName: files.buildable.pageFile,
      buildableManifestFileName: files.buildable.manifestFile,
      stagingDir: files.disposable.stagingDir,
      publishDir: files.static.publishDir,
      disposable: Object.values(files.disposable),
    },
    serve: {
      port: 3000,
      redirectOnStart: true,
      reloadPageOnFocus: false,
      watchDir: files.buildable.appSrcDir,
      serveDir: files.disposable.stagingDir,
    },
  },
  maya: {
    name: "my-maya-app",
    appType: "web",
    version: "0.1.0",
    description: "A Maya web application",
    type: "module",
    dependencies: {
      "@cyftec/maya": "0.0.14",
    },
    devDependencies: {
      "@types/bun": "latest",
      typescript: "latest",
    },
  },
  vscode: {
    settings: {
      "deno.enable": false,
      "files.exclude": {
        [files.static.karmaTypesFile]: true,
        [files.static.gitIgnoreFile]: true,
        [files.static.publishDir]: false,
        [files.disposable.stagingDir]: false,
        [files.disposable.bunLockFile]: true,
        [files.disposable.bunLockBFile]: true,
        [files.disposable.dotVscodeDir]: true,
        [files.disposable.nodeModulesDir]: true,
        [files.disposable.packageJsonFile]: true,
      },
    },
  },
  git: {
    ignore: [
      files.static.dsStoreDir,
      files.static.karmaTypesFile,
      files.disposable.bunLockFile,
      files.disposable.bunLockBFile,
      files.disposable.dotVscodeDir,
      files.disposable.nodeModulesDir,
      files.disposable.packageJsonFile,
      files.disposable.stagingDir,
    ],
  },
};
```

Version note: this specification describes the `0.0.14` Maya/Brahma contract. Pin both tools to a mutually compatible release for reproducible autonomous-agent work. If upgrading, update the pin only after compiling the reference tests in Section 20.

### 14.5 Configuration semantics

- `appSrcDir`: authored application root watched for changes.
- `appViewDir`: subtree Brahma recursively emits as the static application. The canonical value is `dev/view/pages`, keeping reusable UI and business logic outside the public-output boundary.
- `skipErrorAndBuildNext`: when `false`, a failed page stops the build process. Keep it `false` in CI and agent work so broken pages cannot be silently skipped.
- `ignoreDelimiter`: any file or directory whose basename starts with this delimiter is ignored as direct output. It is an optional exception mechanism, not a required prefix for components, elements, or business logic placed outside `appViewDir`.
- `buildablePageFileName`: suffix that identifies a page entry, conventionally `page.ts`.
- `buildableManifestFileName`: top-level source manifest name, conventionally `manifest.ts`.
- `stagingDir`: recreated development output.
- `publishDir`: recreated production output.
- `disposable`: generated/install paths Brahma may remove.
- `port`: staging server port.
- `redirectOnStart`: whether staging opens/redirects to the local app.
- `reloadPageOnFocus`: development-only focus reload behavior.
- `watchDir`: source path watched during staging.
- `serveDir`: built path served during staging.
- `maya`: the generated `package.json` shape, including dependency versions and app mode.
- `git.ignore` and `vscode.settings`: generated `.gitignore` and VS Code settings.

Treat the disposable list as destructive configuration. Never add authored assets, application source, or hand-maintained files to it.

---

## 15. File routing and output names

Brahma recursively scans `appViewDir`.

### 15.1 Folder routes

An unprefixed `page.ts` becomes `index.html` and `main.js` in the same relative directory:

| Source                                    | HTML output                        | JS (bundled) output             | URL                  |
| ----------------------------------------- | ---------------------------------- | ------------------------------- | -------------------- |
| `dev/view/pages/page.ts`                  | `prod/index.html`                  | `prod/main.js`                  | `/`                  |
| `dev/view/pages/docs/page.ts`             | `prod/docs/index.html`             | `prod/docs/main.js`             | `/docs/`             |
| `dev/view/pages/account/settings/page.ts` | `prod/account/settings/index.html` | `prod/account/settings/main.js` | `/account/settings/` |

Each page must load the bundle that Brahma will emit. An unprefixed page uses:

```ts
m.Script({ src: "main.js", defer: true });
```

The relative `main.js` is intentional: `/docs/index.html` loads `/docs/main.js`.

### 15.2 Prefixed sibling pages

A filename ending in `.page.ts` also matches the `page.ts` suffix. Its prefix controls output:

| Source                                 | HTML output               | JS (bundled) output          | URL                   |
| -------------------------------------- | ------------------------- | ---------------------------- | --------------------- |
| `dev/view/pages/contact.page.ts`       | `prod/contact.html`       | `prod/contact.main.js`       | `/contact.html`       |
| `dev/view/pages/legal/privacy.page.ts` | `prod/legal/privacy.html` | `prod/legal/privacy.main.js` | `/legal/privacy.html` |

A prefixed page must load the matching prefixed bundle:

```ts
m.Script({ src: "contact.main.js", defer: true });
```

If the script name is wrong, static HTML may appear but browser mount and reactivity will not run.

### 15.3 Other source files and assets

- Non-page `.ts` files inside the emitted tree compile to same-location `.js` files.
- Other files are copied with their names preserved.
- The configured top-level `manifest.ts` is imported and serialized to `manifest.json`.
- A nested file with the same name is not the special root manifest.
- Files/directories prefixed with the configured delimiter are not directly emitted, but can be bundled through imports. Canonical projects should rarely need this because private source lives outside `appViewDir`.
- Existing build directories are deleted and recreated.
- Empty output directories are removed.

Place reusable `elements`, composed `components`, controllers, models, services, and private libraries outside `appViewDir`. Put route entries, independently loaded scripts, and copied public assets inside `dev/view/pages`. This structural boundary is clearer than marking every source directory with an ignore prefix.

---

## 16. Route page anatomy

A page module default-exports a root getter. It should include its own complete document and matching script.

```ts
import { component, m } from "@cyftec/maya/core";

export default m.Html({
  lang: "en",
  children: [
    m.Head({
      children: [
        m.Meta({ charset: "utf-8" }),
        m.Meta({
          name: "viewport",
          content: "width=device-width, initial-scale=1",
        }),
        m.Title({ children: "Documentation" }),
        m.Link({ rel: "stylesheet", href: "/styles.css" }),
        m.Script({ src: "main.js", defer: true }),
      ],
    }),
    m.Body({
      children: m.Main({
        children: [
          m.H1({ children: "Documentation" }),
          m.A({ href: "/", children: "Return home" }),
        ],
      }),
    }),
  ],
});
```

Note that there is no need to make `m.Html` a component if it is being exported in default. But can be created as a component using `component` method if the page structure is same and is supposed to be used by many `page.ts` files.

Element factories also support child shorthand for non-void elements:

```ts
m.Title("Documentation");
m.P("A string child");
m.Div([m.Strong("Maya"), " application"]);
```

For agent-generated code, the `{ children: ... }` form is preferred when an element has any props or when explicitness improves maintenance.

---

## 17. Complete conventional web application

The following files form a minimal but production-shaped application. They demonstrate mandatory component boundaries, plain prop declarations, reactive prop forwarding, a keyed list, correct route scripts, external CSS, accessibility, and responsive behavior.

### 17.1 `dev/view/elements/Button.ts`

```ts
import { component, m } from "@cyftec/maya/core";
import { tmpl } from "@cyftec/maya/signal";

type ButtonProps = {
  label: string;
  pressed?: boolean;
  onPress: (event: MouseEvent) => void;
};

export const Button = component<ButtonProps>(({ label, pressed, onPress }) =>
  m.Button({
    type: "button",
    class: tmpl`action-button ${() => (pressed?.value ? "is-active" : "")}`,
    "aria-pressed": tmpl`${() => String(pressed?.value ?? false)}`,
    onclick: onPress,
    children: label,
  }),
);
```

### 17.2 `dev/view/components/FeatureCard.ts`

```ts
import { component, m } from "@cyftec/maya/core";

type FeatureCardProps = {
  eyebrow: string;
  title: string;
  description: string;
};

export const FeatureCard = component<FeatureCardProps>(
  ({ eyebrow, title, description }) =>
    m.Article({
      class: "feature-card",
      children: [
        m.P({ class: "feature-card__eyebrow", children: eyebrow }),
        m.H2({ class: "feature-card__title", children: title }),
        m.P({ class: "feature-card__description", children: description }),
      ],
    }),
);
```

### 17.3 `dev/view/pages/page.ts`

```ts
import { component, m } from "@cyftec/maya/core";
import { derive, signal, tmpl } from "@cyftec/maya/signal";
import { Button } from "../elements/Button.js";
import { FeatureCard } from "../components/FeatureCard.js";

type Feature = {
  id: string;
  eyebrow: string;
  title: string;
  description: string;
};

const features = signal<Feature[]>([
  {
    id: "components",
    eyebrow: "Composition",
    title: "Explicit component contracts",
    description: "Plain prop types become a consistent signalified interface.",
  },
  {
    id: "signals",
    eyebrow: "Reactivity",
    title: "Updates without rerenders",
    description:
      "Signals update the precise text, child, or attribute that changed.",
  },
  {
    id: "build",
    eyebrow: "Delivery",
    title: "Static output with live behavior",
    description:
      "Brahma builds complete HTML and mounts behavior deterministically.",
  },
]);

const demoActive = signal(false);
const interactionCount = signal(0);
const demoSummary = derive(() =>
  interactionCount.value === 0
    ? "The demo has not been activated."
    : `Activated ${interactionCount.value} time${
        interactionCount.value === 1 ? "" : "s"
      }.`,
);

export default m.Html({
  lang: "en",
  children: [
    m.Head({
      children: [
        m.Meta({ charset: "utf-8" }),
        m.Meta({
          name: "viewport",
          content: "width=device-width, initial-scale=1",
        }),
        m.Meta({
          name: "description",
          content: "A reference Maya application built with Brahma.",
        }),
        m.Title({ children: "Maya Reference App" }),
        m.Link({ rel: "stylesheet", href: "/styles.css" }),
        m.Script({ src: "main.js", defer: true }),
      ],
    }),
    m.Body({
      children: [
        m.A({
          class: "skip-link",
          href: "#content",
          children: "Skip to content",
        }),
        m.Header({
          class: "site-header shell",
          children: [
            m.A({
              class: "brand",
              href: "/",
              "aria-label": "Maya home",
              children: "maya",
            }),
            m.Nav({
              "aria-label": "Primary navigation",
              children: [
                m.A({ href: "/docs/", children: "Docs" }),
                m.A({
                  href: "https://signal.cyfer.tech",
                  children: "Signals",
                }),
              ],
            }),
          ],
        }),
        m.Main({
          id: "content",
          children: [
            m.Section({
              class: "hero shell",
              "aria-labelledby": "hero-title",
              children: [
                m.P({
                  class: "kicker",
                  children: "TypeScript · DOM · Signals",
                }),
                m.H1({
                  id: "hero-title",
                  children: "Build from the platform up.",
                }),
                m.P({
                  class: "hero__copy",
                  children:
                    "Maya emits complete HTML, then adds precise signal-driven interaction.",
                }),
                m.Div({
                  class: "hero__actions",
                  children: [
                    Button({
                      label: demoActive.when
                        .truthy()
                        .then("Demo active", "Activate demo"),
                      pressed: demoActive,
                      onPress: () => {
                        demoActive.toggle();
                        interactionCount.value += 1;
                      },
                    }),
                    m.A({
                      class: "text-link",
                      href: "/docs/",
                      children: "Read the docs",
                    }),
                  ],
                }),
                m.P({
                  class: tmpl`demo-status ${() => (demoActive.value ? "is-active" : "")}`,
                  "aria-live": "polite",
                  children: demoSummary,
                }),
              ],
            }),
            m.Section({
              class: "features shell",
              "aria-label": "Framework features",
              children: m.For({
                subject: features,
                itemKey: "id",
                map: (feature) => {
                  const { eyebrow, title, description } = feature.props();

                  return FeatureCard({ eyebrow, title, description });
                },
              }),
            }),
          ],
        }),
        m.Footer({
          class: "site-footer shell",
          children: "Built as a conventional Maya application.",
        }),
      ],
    }),
  ],
});
```

### 17.4 `dev/view/pages/docs/page.ts`

```ts
import { component, m } from "@cyftec/maya/core";

export default m.Html({
  lang: "en",
  children: [
    m.Head({
      children: [
        m.Meta({ charset: "utf-8" }),
        m.Meta({
          name: "viewport",
          content: "width=device-width, initial-scale=1",
        }),
        m.Title({ children: "Docs · Maya Reference App" }),
        m.Link({ rel: "stylesheet", href: "/styles.css" }),
        m.Script({ src: "main.js", defer: true }),
      ],
    }),
    m.Body({
      children: m.Main({
        class: "document shell",
        children: [
          m.A({ class: "text-link", href: "/", children: "← Home" }),
          m.P({ class: "kicker", children: "Documentation" }),
          m.H1({ children: "A real folder route." }),
          m.P({
            children:
              "This source file builds to /docs/index.html and /docs/main.js.",
          }),
        ],
      }),
    }),
  ],
});
```

### 17.5 `dev/view/pages/styles.css`

```css
:root {
  color-scheme: dark;
  --paper: #0c0d10;
  --surface: #15171c;
  --ink: #f5f2e9;
  --muted: #a8acb8;
  --line: #2d3038;
  --accent: #a4ff68;
  --content: 74rem;
  --radius: 1.25rem;
  font-family:
    Inter,
    ui-sans-serif,
    system-ui,
    -apple-system,
    BlinkMacSystemFont,
    "Segoe UI",
    sans-serif;
  font-synthesis: none;
  text-rendering: optimizeLegibility;
}

*,
*::before,
*::after {
  box-sizing: border-box;
}

html {
  min-width: 20rem;
  scroll-behavior: smooth;
  background: var(--paper);
}

body {
  min-height: 100vh;
  margin: 0;
  color: var(--ink);
  background:
    radial-gradient(
      circle at 75% 5%,
      rgb(164 255 104 / 0.12),
      transparent 26rem
    ),
    var(--paper);
}

a {
  color: inherit;
}

button {
  font: inherit;
}

.shell {
  width: min(calc(100% - 2rem), var(--content));
  margin-inline: auto;
}

.skip-link {
  position: fixed;
  z-index: 10;
  inset: 0 auto auto 0;
  padding: 0.75rem 1rem;
  color: var(--paper);
  background: var(--accent);
  transform: translateY(-120%);
}

.skip-link:focus {
  transform: translateY(0);
}

.site-header {
  display: flex;
  align-items: center;
  justify-content: space-between;
  min-height: 5rem;
  border-bottom: 1px solid var(--line);
}

.brand {
  color: var(--accent);
  font-size: 1.35rem;
  font-weight: 800;
  letter-spacing: -0.04em;
  text-decoration: none;
}

nav {
  display: flex;
  gap: clamp(1rem, 3vw, 2rem);
}

nav a,
.text-link {
  text-underline-offset: 0.3em;
}

.hero {
  display: grid;
  align-content: center;
  min-height: min(46rem, calc(100vh - 5rem));
  padding-block: clamp(5rem, 12vw, 10rem);
}

.kicker {
  margin: 0 0 1rem;
  color: var(--accent);
  font-size: 0.78rem;
  font-weight: 750;
  letter-spacing: 0.14em;
  text-transform: uppercase;
}

h1 {
  max-width: 12ch;
  margin: 0;
  font-size: clamp(3rem, 9vw, 7.5rem);
  line-height: 0.9;
  letter-spacing: -0.065em;
}

.hero__copy {
  max-width: 42rem;
  margin: 2rem 0 0;
  color: var(--muted);
  font-size: clamp(1.1rem, 2vw, 1.5rem);
  line-height: 1.55;
}

.hero__actions {
  display: flex;
  flex-wrap: wrap;
  align-items: center;
  gap: 1rem 1.5rem;
  margin-top: 2rem;
}

.action-button {
  min-height: 3.25rem;
  padding: 0.8rem 1.25rem;
  border: 1px solid var(--accent);
  border-radius: 999px;
  color: var(--paper);
  font-weight: 750;
  background: var(--accent);
  cursor: pointer;
  transition:
    transform 160ms ease,
    box-shadow 160ms ease;
}

.action-button:hover {
  transform: translateY(-2px);
  box-shadow: 0 0.75rem 2rem rgb(164 255 104 / 0.18);
}

.action-button.is-active {
  color: var(--accent);
  background: transparent;
}

.demo-status {
  min-height: 1.5rem;
  margin: 1rem 0 0;
  color: var(--muted);
}

.demo-status.is-active {
  color: var(--accent);
}

.features {
  display: grid;
  grid-template-columns: repeat(3, minmax(0, 1fr));
  gap: 1rem;
  padding-bottom: clamp(5rem, 10vw, 9rem);
}

.feature-card {
  min-height: 18rem;
  padding: clamp(1.5rem, 3vw, 2.25rem);
  border: 1px solid var(--line);
  border-radius: var(--radius);
  background: linear-gradient(145deg, rgb(255 255 255 / 0.045), transparent);
}

.feature-card__eyebrow {
  color: var(--accent);
  font-size: 0.75rem;
  font-weight: 750;
  letter-spacing: 0.12em;
  text-transform: uppercase;
}

.feature-card__title {
  max-width: 13ch;
  margin-top: 3rem;
  font-size: clamp(1.6rem, 3vw, 2.25rem);
  line-height: 1.05;
  letter-spacing: -0.045em;
}

.feature-card__description {
  color: var(--muted);
  line-height: 1.65;
}

.site-footer {
  padding-block: 2rem;
  border-top: 1px solid var(--line);
  color: var(--muted);
}

.document {
  padding-block: clamp(4rem, 10vw, 8rem);
}

.document h1 {
  margin-block: 2rem;
}

:focus-visible {
  outline: 3px solid var(--accent);
  outline-offset: 4px;
}

@media (max-width: 48rem) {
  .site-header {
    min-height: 4.25rem;
  }

  .features {
    grid-template-columns: 1fr;
  }

  .feature-card {
    min-height: auto;
  }
}

@media (prefers-reduced-motion: reduce) {
  html {
    scroll-behavior: auto;
  }

  *,
  *::before,
  *::after {
    animation-duration: 0.01ms !important;
    animation-iteration-count: 1 !important;
    transition-duration: 0.01ms !important;
  }
}
```

---

## 18. PWA and extension targets

### 18.1 Progressive web application

Set `karma.maya.appType` to `"pwa"`. The root `dev/view/pages/manifest.ts` is serialized to `manifest.json`:

```ts
import type { WebAppManifest } from "web-app-manifest";

const manifest: WebAppManifest = {
  name: "Maya Field App",
  short_name: "Field",
  start_url: "/",
  display: "standalone",
  theme_color: "#0c0d10",
  background_color: "#0c0d10",
  icons: [
    { src: "/assets/icon-192.png", sizes: "192x192", type: "image/png" },
    { src: "/assets/icon-512.png", sizes: "512x512", type: "image/png" },
  ],
};

export default manifest;
```

Add `web-app-manifest` types to dev dependencies. Every installable page head links the root manifest:

```ts
m.Link({ rel: "manifest", href: "/manifest.json" });
```

Place `app.ts` and `sw.ts` at `dev/view/pages/app.ts` and `dev/view/pages/sw.ts` so Brahma emits root-level `app.js` and `sw.js`. Load `app.js` on every relevant page:

```ts
m.Script({ src: "/app.js", defer: true });
```

`app.ts` can register the service worker in browser context:

```ts
if ("serviceWorker" in navigator) {
  window.addEventListener("load", () => {
    void navigator.serviceWorker.register("/sw.js");
  });
}
```

Implement explicit cache versioning, install/activate cleanup, request filtering, and offline fallbacks in `sw.ts`. A generated placeholder is not a production offline strategy.

### 18.2 Browser extension

Set `karma.maya.appType` to `"ext"` and include the browser/Chrome extension type dependency appropriate to the target. The root manifest can be typed as Manifest V3:

```ts
const manifest: chrome.runtime.ManifestV3 = {
  manifest_version: 3,
  name: "Maya Companion",
  version: "0.1.0",
  action: {
    default_popup: "popup.html",
  },
  background: {
    service_worker: "sw.js",
  },
  permissions: ["storage"],
};

export default manifest;
```

Use `popup.page.ts` for `popup.html` and load `popup.main.js` from that page. Ordinary `sw.ts` and `content-script.ts` compile to `sw.js` and `content-script.js`.

Extension globals belong in service workers, content scripts, event callbacks, or `onmount`, not page build-time construction. Request the minimum permissions. Production extension publish output is archived as a zip, and the unarchived production directory is removed by the current Brahma flow.

---

## 19. Accessibility, security, and quality baseline

An app is not complete because it compiles.

### 19.1 Accessibility

- Use one descriptive `h1` per page and a logical heading hierarchy.
- Use `button` for actions and `a` for navigation.
- Give icon-only controls an accessible name.
- Connect labels, help, and errors to form controls.
- Make all interaction keyboard-operable.
- Keep focus visible and move it intentionally after dialogs or route-like UI transitions.
- Use `aria-live` selectively for asynchronous status.
- Do not add redundant ARIA where native semantics already work.
- Preserve usable content and controls at 200% zoom and narrow widths.
- Honor reduced motion and sufficient color contrast.
- Give informative images meaningful `alt`; use empty `alt` for decorative images.

### 19.2 Security

- Never render user input through raw HTML.
- Validate and encode server-bound data.
- Treat external URLs and redirects as untrusted input.
- Keep dependencies pinned and reviewed.
- Do not place secrets in page modules or static outputs.
- Use a deployment-level Content Security Policy suitable for the target.
- For external links opened in a new context, use an appropriate `rel` contract.
- For extensions, minimize host and browser permissions.

### 19.3 Performance

- Serve compressed, dimensioned, appropriately sized images.
- Preload only genuinely critical assets.
- Prefer system fonts or subset/self-hosted web fonts with deliberate loading behavior.
- Avoid global effects when an element-bound signal is enough.
- Use keyed `m.For` for identity-sensitive lists. And for performance as well.
- Keep initial tree construction synchronous and deterministic.
- Avoid layout reads followed by writes in tight loops.
- Test static HTML with JavaScript unavailable; essential page meaning should still be present where the product permits.

---

## 20. Verification protocol for autonomous agents

An agent must not report completion until these checks pass.

### 20.1 Structural audit

- Every reusable UI producer is declared with `component()` or `fragment()`.
- `m` is imported from `@cyftec/maya/core`.
- Signals are imported from `@cyftec/maya/signal`.
- Every route default-exports a root getter.
- Every page loads its exact generated bundled js file name.
- No build-time browser globals or nondeterministic initial branching exist.
- No `innerHTML`, JSX, React idioms, `className`, or `htmlFor` exist.
- No number, boolean, or `null` children exist.
- Keyed lists have stable unique keys and use `.get()`/`.props()`.

Useful searches:

```sh
rg 'from "@cyftec/maya"' dev
rg 'className|htmlFor|innerHTML|Math\.random|Date\.now' dev
rg 'window\.|document\.|location\.' dev/view/pages -g '*page.ts'
rg 'function [A-Z].*\{' dev
```

Review every match; some browser-global matches inside `onmount` or events are valid, and some capitalized functions may be non-UI utilities. The searches are audits, not blind rewrite commands.

### 20.2 Build audit

Run:

```sh
brahma install
brahma publish
```

The command must exit successfully with `skipErrorAndBuildNext: false`. Confirm expected outputs:

```sh
find prod -maxdepth 4 -type f | sort
```

For each emitted HTML file:

- verify `<!DOCTYPE html>` and one complete `<html>` root;
- verify the referenced script exists at the resolved relative path;
- verify stylesheet and asset URLs resolve;
- verify no temporary `data-elem-id` assumption leaks into authored CSS or scripts.

### 20.3 Browser audit

Run `brahma stage` and test at least:

- 320×568, 390×844, 768×1024, 1280×800, and 1440×900;
- keyboard-only navigation;
- 200% browser zoom;
- light/dark or other declared themes;
- reduced-motion mode;
- slow network and failed-request states;
- empty, one-item, many-item, and overflow content;
- direct loading of every folder and prefixed route;
- refresh after direct route navigation;
- signal interactions after mount;
- list insert, delete, and reorder behavior when applicable.

Check the browser console for mount marker failures, invalid event diagnostics, network failures, and uncaught exceptions.

### 20.4 Visual comparison

When a reference exists, capture screenshots at identical viewport dimensions and compare with an overlay or pixel-difference image. Fix systematic discrepancies in this order:

1. missing/wrong assets and fonts;
2. page/container geometry;
3. type metrics and wrapping;
4. spacing and alignment;
5. borders, radii, shadows, gradients, and color;
6. responsive states;
7. interaction and motion states.

Do not claim “pixel perfect” based on visual memory.

### 20.5 Final handoff contents

Report:

- routes implemented;
- components added or changed;
- source and output locations;
- build command and result;
- browser viewports/interactions verified;
- accessibility checks performed;
- any deliberate deviation from the design or this specification.

---

## 21. Failure catalogue

### Page is static but buttons do nothing

The page probably loads the wrong bundle. `page.ts` needs `main.js`; `contact.page.ts` needs `contact.main.js`.

### Build throws “window/document/location is not defined”

Browser code ran during build-time tree construction. Move it into `onmount`, an event callback, or a separate browser-only script.

### Mount cannot find a `data-elem-id`

Build and mount invoked node getters in a different order. Remove nondeterminism and environment-dependent initial branching. Confirm both runs use identical initial state.

### A signal prop shows its first value but never updates

The component read `.value` eagerly while constructing the tree. Pass the signalified prop directly to the child/attribute or read it inside `tmpl`/`derive`.

### Optional prop access crashes

Omitted optional props can be absent after normalization. Use `optionalProp?.value ?? fallback`.

### A list loses focus or local element state on reorder

Use keyed `m.For` with a stable unique `itemKey`.

### A keyed mapper cannot read item fields

The keyed item is a derived object signal. Use `item.get("field")` or `item.props()`, not direct field access and not `.prop()`.

### Input state does not follow typing

Passing `value: state` updates DOM from the signal; it does not automatically update the signal from DOM. Add `oninput` and write `event.currentTarget.value` back.

### Calling a node getter returns the wrong node

Getters are construction/mount handles. Capture the mounted node with `onmount` or use `event.currentTarget`.

### An effect ignores a dependency that appears later

Dependencies are collected on the initial effect run. Read all possible dependencies unconditionally before branching.

### A reusable UI helper has inconsistent prop behavior

It was likely written as a plain function. Replace it with `component()` or `fragment()` and declare simple domain props.

### `null`, a number, or a boolean fails as a child

Maya children are strings, `undefined`, node getters, their arrays, or signalified versions. Convert display values to strings and use `m.If`/`m.Switch` for conditions.

---

## 22. Supported markup notes

Maya's exact HTML tag map is:

`a`, `abbr`, `acronym`, `address`, `applet`, `area`, `article`, `aside`, `audio`, `b`, `base`, `basefont`, `bdi`, `bdo`, `big`, `blockquote`, `body`, `br`, `button`, `canvas`, `caption`, `center`, `cite`, `code`, `col`, `colgroup`, `data`, `datalist`, `dd`, `del`, `details`, `dfn`, `dialog`, `dir`, `div`, `dl`, `dt`, `em`, `embed`, `fieldset`, `figcaption`, `figure`, `font`, `footer`, `form`, `frame`, `frameset`, `h1`, `h2`, `h3`, `h4`, `h5`, `h6`, `head`, `header`, `hgroup`, `hr`, `html`, `i`, `iframe`, `img`, `input`, `ins`, `kbd`, `label`, `legend`, `li`, `link`, `main`, `map`, `mark`, `menu`, `meta`, `meter`, `nav`, `noframes`, `noscript`, `object`, `ol`, `optgroup`, `option`, `output`, `p`, `param`, `picture`, `pre`, `progress`, `q`, `rp`, `rt`, `ruby`, `s`, `samp`, `script`, `search`, `section`, `select`, `slot`, `small`, `source`, `span`, `strike`, `strong`, `style`, `sub`, `summary`, `sup`, `table`, `tbody`, `td`, `template`, `textarea`, `tfoot`, `th`, `thead`, `time`, `title`, `tr`, `track`, `tt`, `u`, `ul`, `var`, `video`, and `wbr`.

The SVG map is:

`animate`, `animateMotion`, `animateTransform`, `circle`, `clipPath`, `defs`, `desc`, `ellipse`, `feBlend`, `feColorMatrix`, `feComponentTransfer`, `feComposite`, `feConvolveMatrix`, `feDiffuseLighting`, `feDisplacementMap`, `feDistantLight`, `feDropShadow`, `feFlood`, `feFuncA`, `feFuncB`, `feFuncG`, `feFuncR`, `feGaussianBlur`, `feImage`, `feMerge`, `feMergeNode`, `feMorphology`, `feOffset`, `fePointLight`, `feSpecularLighting`, `feSpotLight`, `feTile`, `feTurbulence`, `filter`, `foreignObject`, `g`, `image`, `line`, `linearGradient`, `marker`, `mask`, `metadata`, `mpath`, `path`, `pattern`, `polygon`, `polyline`, `radialGradient`, `rect`, `set`, `stop`, `svg`, `symbol`, `text`, `textPath`, `tspan`, `use`, and `view`.

Use the normal PascalCase factory name for these elements, such as `m.Svg`, `m.Path`, `m.LinearGradient`, and `m.FeGaussianBlur`. Five SVG names collide with an HTML factory or Maya's `m.Switch`; use `m.SvgA`, `m.SvgScript`, `m.SvgStyle`, `m.SvgSwitch`, and `m.SvgTitle` for those SVG elements. These factories create SVG-namespace nodes even when constructed outside an `m.Svg` parent. An HTML factory such as `m.Div` inside `m.ForeignObject` remains in the HTML namespace.

The MathML map is:

`annotation`, `annotation-xml`, `maction`, `math`, `merror`, `mfrac`, `mi`, `mmultiscripts`, `mn`, `mo`, `mover`, `mpadded`, `mphantom`, `mprescripts`, `mroot`, `mrow`, `ms`, `mspace`, `msqrt`, `mstyle`, `msub`, `msubsup`, `msup`, `mtable`, `mtd`, `mtext`, `mtr`, `munder`, `munderover`, and `semantics`.

SVG and MathML tags are namespace-aware. SVG attributes use their serialized, case-sensitive names—for example `viewBox`, `gradientUnits`, and `stroke-width`. MathML support follows the current MathML Core map; removed legacy elements such as `menclose` and `mfenced` and legacy attributes such as `mfrac.bevel` are intentionally rejected by the types.

HTML, SVG, and MathML attributes are typed per tag where the package can constrain them. Use valid values for `input.type`, `button.type`, `rel`, boolean attributes, SVG tag-specific fields, and MathML Core fields. Arbitrary `data-*` attributes are supported; ARIA is restricted to the known `aria-*` attribute map so misspellings such as `aria-labl` fail compilation. Treat TypeScript errors as specification feedback; do not silence them with broad casts unless interoperating with a real platform gap that has been documented.

---

## 23. Compact agent prompt contract

If this specification accompanies a separate product/design brief, the coding agent's operating contract is:

> Build the requested application in TypeScript using Maya's `m` API from `@cyftec/maya/core`, signals from `@cyftec/maya/signal`, and Brahma routing/build conventions. Declare every reusable UI unit with `component()` or `fragment()`—never a plain UI-returning function. Declare simple domain prop types and rely on normalized `.value` access; pass normalized props directly or through `tmpl`/`derive` where runtime reactivity is required. Produce deterministic build/mount trees, complete semantic HTML documents, exact matching route scripts, external responsive CSS, accessible interactions, and verified production output. Do not use JSX, virtual-DOM assumptions, raw HTML, React attribute names, build-time browser globals, nondeterministic initial trees, or unsupported child types. Compile and browser-test before reporting completion.

That paragraph is a summary, not a substitute for the preceding requirements.

---

## 24. Final authoring checklist

- [ ] Correct subpath imports, especially `@cyftec/maya/core`.
- [ ] All reusable UI uses `component()` or `fragment()`.
- [ ] Props are simple domain types, with callbacks for requested state changes.
- [ ] Reactive values are forwarded or read within reactive contexts; snapshots are intentional.
- [ ] Complete deterministic `m.Html` page roots.
- [ ] Correct `main.js` or `<prefix>.main.js` in every route.
- [ ] Valid Maya children only.
- [ ] Semantic markup, labels, keyboard behavior, focus, contrast, and reduced motion.
- [ ] Responsive CSS and exact assets.
- [ ] Keyed list identity where needed.
- [ ] Browser APIs confined to browser execution.
- [ ] Errors, loading, empty, disabled, and overflow states implemented.
- [ ] `brahma publish` succeeds without skipped errors.
- [ ] Every route and interaction verified in a browser.
- [ ] Pixel comparisons performed when a visual reference exists.

If every item is true, the result is not merely TypeScript that resembles Maya. It is a conventional Maya application that respects the framework's component, signal, DOM, lifecycle, and Brahma build contracts.
