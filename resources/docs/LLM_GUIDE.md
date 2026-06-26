# Maya Framework - Complete LLM Instruction Guide

This guide provides comprehensive instructions for any LLM to generate application source code using the Maya web development framework.

## Table of Contents

1. [Framework Overview](#framework-overview)
2. [Project Structure](#project-structure)
3. [Core Concepts](#core-concepts)
4. [Element System](#element-system)
5. [Component System](#component-system)
6. [Reactivity with Signals](#reactivity-with-signals)
7. [Custom Elements](#custom-elements)
8. [Event Handling](#event-handling)
9. [Styling and Attributes](#styling-and-attributes)
10. [Three-Phase System](#three-phase-system)
11. [CLI Usage](#cli-usage)
12. [Configuration (karma.ts)](#configuration-karmats)
13. [Code Examples](#code-examples)
14. [Best Practices](#best-practices)

---

## Framework Overview

Maya is a reactive web development framework built with TypeScript, Node.js, and Bun.js. It uses a signal-based reactivity system from `@cyftech/signal` and immutable array operations from `@cyftech/immutjs`.

### Architectural Philosophy

Maya is designed around the belief that the web platform is already powerful enough to build modern applications without the complexity of contemporary frontend ecosystems. For detailed architectural philosophy, see [ARCHITECTURE.md](./ARCHITECTURE.md).

**Core Principles:**

- **MPA First:** Multi-Page Applications are first-class, not Single-Page Applications. Interactivity is layered onto pages rather than pages being layered onto a client-side application runtime.
- **Static Deployment:** Applications should run from static hosting (CDNs, GitHub Pages, object storage) without requiring application servers whenever possible.
- **Browser Native:** Leverage browser capabilities (HTML, CSS, JavaScript, DOM APIs) rather than replacing them with framework abstractions.
- **Signals for Reactivity:** Use signals for targeted updates without Virtual DOM diffing.
- **Simplicity Over Abstraction:** Prefer browser-native solutions over framework abstractions. Complexity should be optional.

**What Maya Is Not:**

Maya is not:

- Another React clone
- Another Vue clone
- Another Angular clone
- Another Virtual DOM framework

Maya occupies the middle ground between plain HTML/CSS/JS and modern frontend frameworks. The primary comparison is not "React vs Maya" but "Plain HTML/CSS/JS vs Modern Frontend Frameworks."

### Key Dependencies

- `@cyftech/signal` - Signal-based reactivity system
- `@cyftech/immutjs` - Immutable array mutation detection
- `@mufw/maya` - Core Maya framework package
- `@mufw/brahma` - CLI tool for Maya apps

### Architecture

- **Maya** (`/maya` folder) - Core framework implementation
- **Brahma** (`/brahma` folder) - CLI tool for app generation, development, and deployment

### Implementation Status

This guide describes the current implementation of Maya. Some architectural features mentioned in [ARCHITECTURE.md](./ARCHITECTURE.md) are not yet fully implemented:

**Fully Implemented:**

- ✅ Build → Mount → Run lifecycle
- ✅ Signal-based reactivity
- ✅ Element getters and DOM creation
- ✅ MPA routing (file-system based)
- ✅ Static deployment
- ✅ Custom elements (For, If, Switch)
- ✅ Basic security sanitization (href, style)

**Partially Implemented:**

- ⚠️ PWA support: Scaffolding exists, but service worker has no cache logic (currently only logs "service-worker")
- ⚠️ Forms: Native forms work, but no dedicated form abstraction
- ⚠️ Async operations: Query helper exists, but no comprehensive cache/retry system
- ⚠️ Security: Only href and style are sanitized

**Not Implemented (External/Future):**

- ❌ KVDB persistence layer (mentioned in architecture, external to this repo)
- ❌ Comprehensive offline caching strategies
- ❌ Global state management system
- ❌ Advanced form validation abstraction

For implementation gaps, see the "Architecture Vs Implementation" table in [ARCHITECTURE.md](./ARCHITECTURE.md).

---

## Project Structure

A typical Maya application has the following structure:

```
my-maya-app/
├── dev/                      # Source directory (configurable in karma.ts)
│   ├── controller            # Main page entry point
│   ├── models
│   └── view/                 # Source directory buildable to static html (configurable in karma.ts)
│       ├── elements/         # Reusable elemental components
│       │   ├── textbox.ts
│       │   ├── button.ts
│       │   └── index.ts
│       ├── components/       # Reusable complex components created using elments
│       │   ├── header.ts
│       │   ├── footer.ts
│       │   └── index.ts
│       ├── page.ts           # Main page entry point of current parent directory, built as index.html
│       ├── about.page.ts     # Additional page, built as about.html
│       ├── other/            # Other page, built as other/index.html
│       │   └── page.ts
│       ├── manifest.ts       # PWA manifest (if applicable)
│       ├── sw.ts             # service worker javascript file (if applicable)
│       └── CNAME             # CNAME (if applicable) to mention domain names
├── karma.ts                 # Configuration file (CRITICAL - do not rename exports)
├── stage/                   # Staging build directory (auto-generated)
├── prod/                    # Production build directory (auto-generated)
├── package.json             # Dependencies (auto-generated)
├── bun.lockb                # Lock file (auto-generated)
└── .gitignore              # Git ignore (auto-generated)
```

### Critical File: karma.ts

The `karma.ts` file contains app configuration and MUST export two specific variables:

- `projectFileNames` - File name mappings
- `config` - Karma configuration object

**DO NOT CHANGE the exported variable names** - the CLI depends on these exact names.

---

## Core Concepts

### 1. Signal-Based Reactivity

Maya uses signals from `@cyftech/signal` for reactive state management:

- `signal(initialValue)` - Creates a reactive signal
- `signal.value` - Access current value
- `signal.value = newValue` - Update value (triggers reactivity)
- `derive(() => ...)` - Create derived signals
- `effect(() => ...)` - Side effects that run when dependencies change
- `tmpl` - Template literal with signal interpolation
- `op` - Signal operations (e.g., `op(signal).ternary(trueValue, falseValue)`)
- `trap` - Signal trap, handy methods for creating derived signal based on the original data type

Examples of `trap`

- `op(anySignal).ternary(trueValue, falseValue)`
- `const { propertySignal } = op(objectSignal).props()`
- `const propertySignal = op(objectSignal).prop("propertyKey")`
- `const itemAtIndex0 = op(arraySignal).at(0)`

### 2. Element Getters

Maya elements return "element getters" - functions that when called, return the actual DOM element:

```typescript
const elementGetter = m.Div({ children: "Hello" });
const actualElement = elementGetter(); // Returns HTMLElement
```

### 3. Three-Phase System

Maya operates in three distinct phases:

1. **BUILD** - Generates static HTML with unique element IDs
2. **MOUNT** - Attaches JavaScript components to existing DOM nodes
3. **RUN** - Reactive updates to in-memory DOM nodes

---

## Element System

### HTML Elements

All standard HTML tags are available as capitalized properties on the `m` object:

```typescript
import { m } from "@mufw/maya";

// Available elements (all HTML5 tags):
m.Html, m.Head, m.Body, m.Div, m.Span, m.P, m.H1, m.H2, m.H3,
m.A, m.Button, m.Input, m.Form, m.Img, m.Script, m.Link,
m.Meta, m.Title, m.Style, m.Ul, m.Li, m.Table, m.Tr, m.Td,
m.Section, m.Article, m.Header, m.Footer, m.Nav, m.Aside,
m.Video, m.Audio, m.Canvas, m.Svg, m.Textarea, m.Select,
m.Option, m.Label, m.Fieldset, m.Legend, m.Datalist, m.Output,
m.Progress, m.Meter, m.Details, m.Summary, m.Dialog, m.Menu,
m.Code, m.Pre, m.Blockquote, m.Strong, m.Em, m.Mark, m.Small,
m.Sub, m.Sup, m.Time, m.Data, m.Br, m.Hr, m.Wbr, // and many more
```

### HTML Element equivalent Maya Element

All elements follow this pattern:

// HTML Element
<tagname attribkey="attrib-value"></tagname>

// Equivalent Maya Element

```typescript
m.Tagname({ attribkey: "attrib-value" });
```

// Rules for HTML Equivalent Maya Element and its attributes

1. Element name is capitalized and used with 'm.' prefix (e.g., div → m.Div)
2. Maya element is a function which takes 3 types of arguments,
   a. Single Maya element (as a child)
   b. Array of Maya Elements (as children)
   c. Attribute Object
3. Children can also be passed in Attribute Object in 3 ways with 'children' as attribute key for passing children,
   a. children: Single Maya element
   b. children: Array of Maya Elements
   c. children: String or Signalified String Object (text content)
   e.g. children: "Text content" | m.ChildElement() | [m.ChildElement(), "text"]
4. HTML Attribute keys and Event names should be exactly same in Maya (e.g., id → id, class → class, style → style, onclick → onclick)
5. The string HTML Atribute value equivalent in Maya is either string or Signalified Object of string
6. The value of an event attribute in Maya should not be a string, unlike that in HTML but an actual (event listener) function. e.g. the
   - HTML <button onclick="someFn()">click me</button>
   - In Maya it should be actual function passed to the event attribute
   ````typescript
   m.Button({ onclick: function someFn(){}, children: "click me" })```
   ````
7. 2 cusom events are also there which can be passed in Maya atrributes object
   a. onmount: Function to be called when element is created
   b. onunmount: Function to be called when element is destroyed

```typescript

// HTML example
<div
  id="container"
  class="parent-class card"
>
  <h3>My Blog Title</h3>
  <p
    style="background-color: yellow;"
  >
    Highlighted Paragraph.
  </p>
  <button onclick="onButtonClick()">Click me</button>
  <ul>
    Some list items
    <li>Item 1</li>
    <li>Item 2</li>
    <li>Item 3</li>
  <ul>
</div>
<script>
  function onButtonClick(){
    console.log("button clicked")
  }
</script>

// Equivalent of same HTML code in Maya will be as below
m.Div({
  id: "container",
  class: "parent-class card",
  children: [
    m.H3("My Blog Title"),
    m.P({
      style: "background-color: yellow;",
      children: "Highlighted Paragraph.",
    }),
    m.Button({
      onclick: onButtonClick,
      children: "Click me",
    }),
    m.Ul([
      "Some list items",
      m.Li("Item 1"),
      m.Li("Item 2"),
      m.Li("Item 3"),
    ]),
  ],
})
m.Script(`
  function onButtonClick(){
    console.log("button clicked")
  }
`)
```

### Element Usage Pattern Summary

All elements follow this pattern:

```typescript
m.CapitalisedHtmlElementName({
  // Attributes (HTML attributes) as object key value pairs
  id: "my-id",
  class: "my-class",
  style: "color: red;",
  href: "/path",

  // Events (HTML events)
  onclick: (event: Event) => {
    /* handle click */
  },
  oninput: (event: Event) => {
    /* handle input */
  },

  // Custom events
  onmount: (element: MHtmlElement) => {
    /* runs after mount */
  },
  onunmount: (element: MHtmlElement) => {
    /* runs before unmount */
  },

  // Children
  children: "Text content" | m.ChildElement() | [m.ChildElement(), "text"],
});
```

### Children as Direct Argument

For convenience, children can be passed as the only argument:

```typescript
m.Div("Hello World"); // Equivalent to m.Div({ children: "Hello World" })
m.Div([m.Span("A"), m.Span("B")]); // Multiple children
```

---

## Component System

### Creating Components

Use the `component()` higher-order function to create reusable components:

```typescript
import { component, m } from "@mufw/maya";
import { signal } from "@cyftech/signal";

type ButtonProps = {
  label: string;
  onclick: (event: Event) => void;
  disabled?: boolean;
};

const Button = component<ButtonProps>(({ label, onclick, disabled }) => {
  const isHovered = signal(false);

  const onMouseEnter = () => (isHovered.value = true);

  const onMouseLeave = () => (isHovered.value = false);

  return m.Button({
    disabled,
    onclick,
    onmouseenter: onMouseEnter,
    onmouseleave: onMouseLeave,
    children: label,
  });
});

// Usage
m.Div({
  children: Button({
    label: "Click me",
    onclick: () => console.log("Clicked"),
  }),
});
```

### Component Props Handling

The `component()` wrapper normalizes props for internal use:

- **Signals and functions:** Passed through unchanged
- **Plain datatypes like strings, number, boolean, array, objects, etc are converted to non-signal-bjects:** Converted to non-signal representations with `getNonSignalObject`

Inside the component, access prop values with `.value`:

```typescript
const Button = component<ButtonProps>(({ label }) => {
  // label is a signal - access with .value
  return m.Button({ children: label.value });
});
```

This keeps component internals signal-friendly while maintaining reactivity.

---

## Reactivity with Signals

### Basic Signal Usage

```typescript
import { signal } from "@cyftech/signal";

const count = signal(0);

// Read value
console.log(count.value); // 0

// Update value
count.value = 1;

// Use in Maya elements
m.Div({ children: count }); // Automatically updates when count changes
```

### Signal in Attributes

```typescript
const colorCssClass = signal("red"); // can and should be used directly in tmpl`` as it is string signal
const isActive = signal(true); // to be used inside an evaluator function calling isActive.value because it's not a string signal

m.Div({
  class: isActive, // Signal can be used directly
  children: "Content",
});

// With template strings
import { tmpl } from "@cyftech/signal";
m.Div({
  class: tmpl`base-class ${colorCssClass} ${() => (isActive.value ? "active" : "inactive")}`,
  children: "Content",
});
```

### Signal in Children

```typescript
const text = signal("Hello");

m.Div({ children: text }); // Updates when text changes

// With derived content
import { derive } from "@cyftech/signal";
const upperText = derive(() => text.value.toUpperCase());
m.Div({ children: upperText });
```

### Derived Signals

```typescript
import { derive, signal } from "@cyftech/signal";

const firstName = signal("John");
const lastName = signal("Doe");

const fullName = derive(() => `${firstName.value} ${lastName.value}`);
m.Div({ children: fullName });
```

### Signal Operations

```typescript
import { op, signal } from "@cyftech/signal";

const isVisible = signal(true);

m.Div({
  class: op(isVisible).ternary("visible", "hidden"),
  children: "Content",
});
```

---

## Custom Elements

### For Element - List Rendering

The `For` element renders lists with optional mutable node tracking:

```typescript
import { m } from "@mufw/maya";
import { signal } from "@cyftech/signal";

// Simple list (non-mutable)
const items = signal(["Apple", "Banana", "Cherry"]);

m.For({
  subject: items,
  map: (item) => m.Div({ children: item }),
});

// Mutable list (preserves DOM nodes on updates)
type Task = { id: number; text: string; done: boolean };
const tasks = signal<Task[]>([
  { id: 1, text: "Task 1", done: false },
  { id: 2, text: "Task 2", done: true },
]);

m.For({
  subject: tasks,
  itemKey: "id", // Required for mutable lists - must be unique
  map: (task) => {
    // When itemKey is passed, the argument item in map function is a signal
    // Access properties with .value: task.value.text, task.value.done
    // If itemKey is not passed, then the argument item is plain JS datatype
    return m.Div({
      children: task.value.text,
      style: task.value.done ? "text-decoration: line-through;" : "",
    });
  },
});

// With injection (insert child at specific position)
m.For({
  subject: items,
  n: 2, // Insert at index 2
  nthChild: m.H3({ children: "Section Header" }),
  map: (item) => m.Div({ children: item }),
});
```

**Key Points for For Element:**

- Without `itemKey`: List is recreated on any change (simple but less efficient)
- With `itemKey`: DOM nodes are preserved, only individual item signals update (efficient)
- `itemKey` must be a property with unique values across all items
- Items must be objects when using `itemKey`

### If Element - Conditional Rendering

```typescript
import { m } from "@mufw/maya";
import { signal } from "@cyftech/signal";

const isLoggedIn = signal(false);

m.If({
  subject: isLoggedIn,
  isTruthy: () => m.Div({ children: "Welcome back!" }),
  isFalsy: () => m.Div({ children: "Please log in" }),
});

// With signal subject
const user = signal<{ name: string } | null>(null);

m.If({
  subject: user,
  isTruthy: (u) => m.Div({ children: `Hello, ${u.name}` }),
  isFalsy: () => m.Div({ children: "Not logged in" }),
});
```

### Switch Element - Pattern Matching

```typescript
import { m } from "@mufw/maya";
import { signal } from "@cyftech/signal";

const view = signal("home");

m.Switch({
  subject: view,
  cases: {
    home: () => m.Div({ children: "Home Page" }),
    about: () => m.Div({ children: "About Page" }),
    contact: () => m.Div({ children: "Contact Page" }),
  },
  defaultCase: () => m.Div({ children: "404 Not Found" }),
});

// With custom matcher
const status = signal(200);

m.Switch({
  subject: status,
  caseMatcher: (value, caseKey) => {
    if (caseKey === "success") return value >= 200 && value < 300;
    if (caseKey === "error") return value >= 400;
    return false;
  },
  cases: {
    success: () => m.Div({ children: "Success!" }),
    error: () => m.Div({ children: "Error!" }),
  },
});
```

---

## Event Handling

### HTML Events

All standard HTML events are supported with the `on` prefix:

```typescript
m.Button({
  onclick: (event: Event) => {
    console.log("Clicked!", event);
  },
  oninput: (event: Event) => {
    console.log("Input changed", event);
  },
  onsubmit: (event: Event) => {
    event.preventDefault(); // Prevent default form submission
    console.log("Form submitted");
  },
  children: "Click me",
});
```

**Available HTML Events:**

- Mouse: `onclick`, `ondblclick`, `onmousedown`, `onmouseup`, `onmouseover`, `onmouseout`, `onmousemove`
- Keyboard: `onkeydown`, `onkeypress`, `onkeyup`
- Form: `onsubmit`, `onreset`, `onchange`, `oninput`, `oninvalid`, `onselect`
- Focus: `onfocus`, `onblur`
- Window/Document: `onload`, `onresize`, `onscroll`, `onerror`
- Media: `onplay`, `onpause`, `onended`, `onprogress`, `ontimeupdate`
- Drag & Drop: `ondrag`, `ondrop`, `ondragover`, `ondragstart`, `ondragend`

### Custom Events

#### onmount

Runs after the element is mounted to the DOM (only in MOUNT and RUN phases):

```typescript
m.Div({
  onmount: (element: MHtmlElement) => {
    console.log("Element mounted!", element);
    element.focus(); // Auto-focus on mount
  },
  children: "Content",
});
```

#### onunmount

Runs before the element is removed from the DOM:

```typescript
m.Div({
  onunmount: (element: MHtmlElement) => {
    console.log("Element will be unmounted", element);
    // Cleanup resources, remove event listeners, etc.
  },
  children: "Content",
});
```

**Important:** `onmount` does NOT run during the BUILD phase. Use it for browser-specific logic like accessing `window`, `document`, `location`, etc.

---

## Styling and Attributes

### HTML Attributes

All standard HTML attributes are supported:

```typescript
m.Input({
  type: "text",
  placeholder: "Enter text",
  required: true,
  disabled: false,
  maxlength: 100,
  autocomplete: "off",
});
```

### Boolean Attributes

Boolean attributes can be set with boolean values:

```typescript
m.Button({
  disabled: isDisabled, // Signal or boolean
  children: "Click",
});

m.Input({
  required: true,
  checked: isChecked,
});
```

### Data Attributes

Custom data attributes are supported:

```typescript
m.Div({
  "data-id": "123",
  "data-role": "button",
  children: "Content",
});
```

### Style Attribute

The `style` attribute accepts CSS strings:

```typescript
m.Div({
  style: "color: red; background: blue; padding: 10px;",
  children: "Styled content",
});
```

**Security Note:** The `style` attribute is sanitized to prevent XSS attacks. Patterns like `url()`, `expression()`, and `javascript:` are blocked.

### Security Considerations

Maya includes targeted sanitization for security-sensitive attributes:

**Current Sanitization Scope:**

- **href attribute:** Blocks `javascript:`, `data:`, `vbscript:`, `file:` protocols
- **style attribute:** Blocks `url()`, `expression()`, `javascript:` patterns

**Limitations:**

Maya does not currently provide:

- Full HTML sanitization
- Comprehensive attribute sanitization
- Content Security Policy generation
- XSS protection for all contexts

**Best Practices:**

- Always validate and sanitize user input on the server
- Use Content Security Policy headers
- Be cautious with dynamic content
- Prefer text content over HTML-like operations

### Class Attribute

The `class` attribute can be:

- A string
- A signal
- A template literal with signals

```typescript
// String
m.Div({ class: "container", children: "Content" });

// Signal
const isActive = signal(true);
m.Div({ class: isActive, children: "Content" });

// Template literal
import { tmpl } from "@cyftech/signal";
m.Div({
  class: tmpl`base ${isActive ? "active" : "inactive"}`,
  children: "Content",
});
```

### Href Attribute Security

The `href` attribute is sanitized to prevent XSS:

- Blocked: `javascript:`, `data:`, `vbscript:`, `file:`
- Allowed: `http:`, `https:`, `mailto:`, `tel:`, etc.

```typescript
m.A({
  href: "/path", // Safe
  // href: "javascript:alert('xss')" // This will throw an error
  children: "Link",
});
```

---

## Three-Phase System

### Phase 1: BUILD

- Runs in Node.js environment (no browser APIs available)
- Generates static HTML with unique `data-elem-id` attributes
- Each element gets a unique ID for later mounting
- HTML structure is serialized to string

**What works in BUILD:**

- Element creation
- Signal initialization
- Static content rendering

**What doesn't work in BUILD:**

- Browser APIs (`window`, `document`, `location`, etc.)
- `onmount` events (they don't run)
- DOM manipulation beyond creation

### Phase 2: MOUNT

- Runs in browser environment after page load
- Existing HTML nodes are found using `data-elem-id`
- JavaScript components attach to DOM nodes
- `onmount` events execute
- `data-elem-id` attributes are removed

**What works in MOUNT:**

- All browser APIs
- `onmount` events
- DOM attachment

### Phase 3: RUN

- Normal reactive operation
- Signal updates trigger DOM changes
- Event handlers respond to user interaction
- `onunmount` events run when elements are removed

### Phase Detection in Code

You can check the current phase:

```typescript
import { phase } from "@mufw/maya/utils";

if (phase.currentIs("build")) {
  // Build phase logic
}

if (phase.currentIs("mount")) {
  // Mount phase logic
}

if (phase.currentIs("run")) {
  // Run phase logic
}
```

### Best Practice for Browser APIs

Use `onmount` for browser-specific logic:

```typescript
// ❌ WRONG - Will fail in BUILD phase
m.Div({
  children: location.href,
});

// ✅ CORRECT - Only runs in MOUNT/RUN phases
m.Div({
  onmount: (el) => {
    el.innerText = location.href;
  },
  children: "",
});
```

---

## CLI Usage

### Installation

```bash
npm install -g @mufw/brahma
# or
bun install -g @mufw/brahma
```

### Create New App

```bash
brahma create <app-name> [--web|--ext|--pwa]
```

**Examples:**

```bash
brahma create my-app              # Default web app
brahma create my-app --web        # Web app
brahma create my-extension --ext  # Browser extension
brahma create my-pwa --pwa        # Progressive Web App
```

### Install Dependencies

```bash
cd <app-name>
brahma install              # Install all dependencies
brahma install <package>    # Install specific package
```

### Start Development Server

```bash
brahma stage
```

- Builds the app
- Starts local server (default port 3000)
- Watches for file changes
- Auto-rebuilds on changes
- Press `q` + `Enter` to quit

### Build for Production

```bash
brahma publish
```

- Creates optimized production build
- Minifies JavaScript
- For extensions: creates ZIP file

### Reset Configuration

```bash
brahma reset              # Soft reset (preserves some config)
brahma reset --hard       # Hard reset (full reset)
```

### Uninstall Packages

```bash
brahma uninstall              # Remove all generated files
brahma uninstall <package>    # Remove specific package
```

### Help

```bash
brahma help
brama --help
```

### Version

```bash
brahma version
brahma --version
```

---

## Configuration (karma.ts)

The `karma.ts` file is the heart of Maya app configuration. It must export two variables:

### projectFileNames

Defines file name mappings used throughout the app:

```typescript
export const projectFileNames = {
  buildable: {
    mayaSrcDir: "dev", // Source directory
    pageFile: "page.ts", // Page file extension
    manifestFile: "manifest.ts", // PWA manifest file
  },
  static: {
    sourceDir: "dev", // Source directory
    karmaTypesFile: "karma-types.ts",
  },
  systemGenerated: {
    dsStoreDir: ".DS_Store",
  },
  generated: {
    stagingDir: "stage", // Staging build directory
    publishDir: "prod", // Production build directory
    bunLockFile: "bun.lock",
    bunLockBFile: "bun.lockb",
    gitIgnoreFile: ".gitignore",
    dotVscodeDir: ".vscode",
    nodeModulesDir: "node_modules",
    packageJsonFile: "package.json",
  },
} as const satisfies ProjectFileNames;
```

### config

Main configuration object:

```typescript
export const config: KarmaConfig = {
  brahma: {
    version: "0.1.31", // CLI version (must match installed)
    build: {
      mode: "web", // "web" | "ext" | "pwa"
      skipErrorAndBuildNext: false, // Continue building on errors?
      ignoreDelimiter: "@", // Prefix for files to ignore during build
      sourceDirName: "dev", // Source directory name
      mayaSrcDir: "dev", // Maya source directory
      buildablePageFileName: "page.ts",
      buildableManifestFileName: "manifest.ts",
      stagingDirName: "stage", // Staging directory
      publishDirName: "prod", // Production directory
    },
    serve: {
      port: 3000, // Dev server port
      redirectOnStart: true, // Redirect to index on start?
      reloadPageOnFocus: false, // Reload when window regains focus?
      watchDir: "dev", // Directory to watch for changes
      serveDir: "stage", // Directory to serve
    },
  },
  packageJson: {
    dependencies: {
      "@mufw/maya": "latest",
    },
  },
  vscode: {
    settings: {
      "deno.enable": false,
      "files.exclude": {
        "karma-types.ts": true,
        stage: false,
        prod: false,
        "bun.lock": true,
        "bun.lockb": true,
        ".gitignore": true,
        ".vscode": true,
        node_modules: true,
        "package.json": true,
      },
    },
  },
  git: {
    ignore: [
      ".DS_Store",
      "karma-types.ts",
      "bun.lock",
      "bun.lockb",
      ".vscode",
      "node_modules",
      "package.json",
      "/stage",
    ],
  },
};
```

### Important Notes

- **DO NOT** change exported variable names (`projectFileNames`, `config`)
- Version must match installed Brahma CLI version
- File names in `projectFileNames` are used throughout the codebase
- Changes require running `brahma install` to take effect

---

## Code Examples

### Example 1: Simple Counter

```typescript
import { signal } from "@cyftech/signal";
import { m } from "@mufw/maya";

const count = signal(0);

export default m.Html({
  lang: "en",
  children: [
    m.Head({
      children: [
        m.Title("Counter App"),
        m.Meta({ charset: "UTF-8" }),
        m.Meta({
          name: "viewport",
          content: "width=device-width, initial-scale=1.0",
        }),
      ],
    }),
    m.Body({
      children: [
        m.Script({ src: "main.js", defer: true }),
        m.Div({
          children: [
            m.H1({ children: "Counter" }),
            m.Div({ children: count }),
            m.Button({
              onclick: () => (count.value = count.value + 1),
              children: "Increment",
            }),
            m.Button({
              onclick: () => (count.value = count.value - 1),
              children: "Decrement",
            }),
          ],
        }),
      ],
    }),
  ],
});
```

### Example 2: Todo List with For Element

```typescript
import { signal } from "@cyftech/signal";
import { m, component } from "@mufw/maya";

type Todo = { id: number; text: string; done: boolean };

const todos = signal<Todo[]>([
  { id: 1, text: "Learn Maya", done: false },
  { id: 2, text: "Build app", done: false },
]);

const newTodoText = signal("");

const TodoItem = component<{ todo: Todo }>(({ todo }) => {
  const isDone = signal(todo.done);

  return m.Div({
    style: isDone ? "text-decoration: line-through; opacity: 0.7;" : "",
    children: [
      m.Input({
        type: "checkbox",
        checked: isDone,
        onchange: () => (isDone.value = !isDone.value),
      }),
      m.Span({ children: todo.text }),
    ],
  });
});

export default m.Html({
  lang: "en",
  children: [
    m.Head({
      children: [
        m.Title("Todo App"),
        m.Meta({ charset: "UTF-8" }),
        m.Meta({
          name: "viewport",
          content: "width=device-width, initial-scale=1.0",
        }),
      ],
    }),
    m.Body({
      children: [
        m.Script({ src: "main.js", defer: true }),
        m.Div({
          children: [
            m.H1({ children: "Todo List" }),
            m.Div({
              children: [
                m.Input({
                  type: "text",
                  placeholder: "Add todo...",
                  oninput: (e) => {
                    newTodoText.value = (e.target as HTMLInputElement).value;
                  },
                }),
                m.Button({
                  onclick: () => {
                    if (newTodoText.value.trim()) {
                      todos.value = [
                        ...todos.value,
                        {
                          id: Date.now(),
                          text: newTodoText.value,
                          done: false,
                        },
                      ];
                      newTodoText.value = "";
                    }
                  },
                  children: "Add",
                }),
              ],
            }),
            m.For({
              subject: todos,
              itemKey: "id",
              map: (todo) => TodoItem({ todo }),
            }),
          ],
        }),
      ],
    }),
  ],
});
```

### Example 3: Form with Validation

```typescript
import { signal, derive } from "@cyftech/signal";
import { m, tmpl } from "@mufw/maya";

const email = signal("");
const password = signal("");

const isValidEmail = derive(() =>
  /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email.value),
);
const canSubmit = derive(
  () => isValidEmail.value && password.value.length >= 8,
);

export default m.Html({
  lang: "en",
  children: [
    m.Head({
      children: [
        m.Title("Login Form"),
        m.Meta({ charset: "UTF-8" }),
        m.Meta({
          name: "viewport",
          content: "width=device-width, initial-scale=1.0",
        }),
      ],
    }),
    m.Body({
      children: [
        m.Script({ src: "main.js", defer: true }),
        m.Form({
          onsubmit: (e) => {
            e.preventDefault();
            console.log("Form submitted", {
              email: email.value,
              password: password.value,
            });
          },
          children: [
            m.Div({
              children: [
                m.Label({ children: "Email:" }),
                m.Input({
                  type: "email",
                  value: email,
                  oninput: (e) => {
                    email.value = (e.target as HTMLInputElement).value;
                  },
                }),
                m.Span({
                  style: tmpl`color: ${isValidEmail ? "green" : "red"}`,
                  children: isValidEmail ? "✓ Valid" : "✗ Invalid",
                }),
              ],
            }),
            m.Div({
              children: [
                m.Label({ children: "Password:" }),
                m.Input({
                  type: "password",
                  value: password,
                  oninput: (e) => {
                    password.value = (e.target as HTMLInputElement).value;
                  },
                }),
              ],
            }),
            m.Button({
              type: "submit",
              disabled: !canSubmit,
              children: "Login",
            }),
          ],
        }),
      ],
    }),
  ],
});
```

### Example 4: Data Fetching with Query

```typescript
import { m } from "@mufw/maya";
import { query } from "@mufw/maya/toolkit";

const { data, isLoading, error, runQuery } = query<User[]>(
  "https://api.example.com/users",
  undefined,
  () => console.log("Fetch complete"),
);

export default m.Html({
  lang: "en",
  children: [
    m.Head({
      children: [
        m.Title("Users"),
        m.Meta({ charset: "UTF-8" }),
        m.Meta({
          name: "viewport",
          content: "width=device-width, initial-scale=1.0",
        }),
      ],
    }),
    m.Body({
      children: [
        m.Script({ src: "main.js", defer: true }),
        m.Div({
          onmount: () => runQuery(),
          children: [
            m.Button({
              onclick: () => runQuery(),
              children: "Refresh",
            }),
            m.If({
              subject: isLoading,
              isTruthy: () => m.Div({ children: "Loading..." }),
            }),
            m.If({
              subject: error,
              isTruthy: () =>
                m.Div({
                  style: "color: red;",
                  children: tmpl`Error: ${() => error.value?.message}`,
                }),
            }),
            m.If({
              subject: data,
              isTruthy: () =>
                m.For({
                  subject: data,
                  itemKey: "id",
                  map: (user) =>
                    m.Div({
                      children: `${user.name} (${user.email})`,
                    }),
                }),
            }),
          ],
        }),
      ],
    }),
  ],
});
```

### Example 5: Reusable Component Library

```typescript
// @elements/button.ts
import { component, m, type DomEventValue } from "@mufw/maya";
import { signal, tmpl } from "@cyftech/signal";

type ButtonProps = {
  variant?: "primary" | "secondary" | "danger";
  size?: "small" | "medium" | "large";
  disabled?: boolean;
  onclick?: DomEventValue;
  children: string;
};

const Button = component<ButtonProps>(
  ({
    variant = "primary",
    size = "medium",
    disabled = false,
    onclick,
    children,
  }) => {
    const isHovered = signal(false);

    const baseStyles = "border-none cursor-pointer font-weight-bold";
    const variantStyles = {
      primary: "bg-blue-500 text-white hover:bg-blue-600",
      secondary: "bg-gray-200 text-gray-800 hover:bg-gray-300",
      danger: "bg-red-500 text-white hover:bg-red-600",
    };
    const sizeStyles = {
      small: "py-1 px-2 text-sm",
      medium: "py-2 px-4 text-base",
      large: "py-3 px-6 text-lg",
    };

    return m.Button({
      disabled,
      onclick,
      onmouseenter: () => (isHovered.value = true),
      onmouseleave: () => (isHovered.value = false),
      class: tmpl`${baseStyles} ${variantStyles[variant]} ${sizeStyles[size]}`,
      style: disabled ? "opacity: 0.5; cursor: not-allowed;" : "",
      children,
    });
  },
);

export { Button };

// @elements/card.ts
import { component, m } from "@mufw/maya";

type CardProps = {
  title?: string;
  children: any;
};

const Card = component<CardProps>(({ title, children }) => {
  return m.Div({
    class: "border rounded-lg shadow-md p-4",
    children: [
      title ? m.H3({ class: "text-lg font-bold mb-2", children: title }) : null,
      m.Div({ children }),
    ],
  });
});

export { Card };

// @elements/index.ts
export { Button } from "./button.ts";
export { Card } from "./card.ts";

// Usage in page.ts
import { m } from "@mufw/maya";
import { Button, Card } from "./@elements/index.ts";

export default m.Html({
  lang: "en",
  children: [
    m.Head({
      children: [
        m.Title("Component Demo"),
        m.Meta({ charset: "UTF-8" }),
        m.Meta({
          name: "viewport",
          content: "width=device-width, initial-scale=1.0",
        }),
      ],
    }),
    m.Body({
      children: [
        m.Script({ src: "main.js", defer: true }),
        m.Div({
          children: [
            Card({
              title: "Welcome",
              children: [
                m.P({ children: "This is a card component." }),
                Button({
                  variant: "primary",
                  children: "Click me",
                  onclick: () => console.log("Clicked"),
                }),
              ],
            }),
          ],
        }),
      ],
    }),
  ],
});
```

---

## Best Practices

### 1. Use Signals for State

Always use signals for any state that needs to trigger UI updates:

```typescript
// ✅ Good
const count = signal(0);

// ❌ Bad - won't trigger updates
let count = 0;
```

### 2. Keep Components Small

Break down complex UI into smaller, reusable components:

```typescript
// ✅ Good
const UserCard = component<User>(({ user }) => m.Div({ children: user.name }));
const UserList = component<User[]>(({ users }) =>
  m.For({ subject: users, map: UserCard }),
);

// ❌ Bad - too large
const BigComponent = component<BigProps>(({ ...manyProps }) => {
  // Hundreds of lines of JSX-like code
});
```

### 3. Use onmount for Browser APIs

Never use browser APIs directly in element creation:

```typescript
// ✅ Good
m.Div({
  onmount: (el) => {
    el.style.height = `${window.innerHeight}px`;
  },
  children: "Content",
});

// ❌ Bad - will fail in BUILD phase
m.Div({
  style: `height: ${window.innerHeight}px`,
  children: "Content",
});
```

### 4. Use itemKey for Lists

Always provide `itemKey` for lists of objects to enable efficient updates:

```typescript
// ✅ Good
m.For({
  subject: items,
  itemKey: "id",
  map: (item) => ItemComponent({ item }),
});

// ❌ Bad - inefficient
m.For({
  subject: items,
  map: (item) => ItemComponent({ item }),
});
```

### 5. Sanitize User Input

Maya sanitizes attributes automatically, but be careful with dynamic content:

```typescript
// ✅ Good - Maya handles sanitization
m.Div({ children: userInput });

// ⚠️ Be careful with innerHTML-like operations
// Maya doesn't have innerHTML, so this is less of a concern
```

### 6. Use TypeScript Types

Leverage TypeScript for type safety:

```typescript
// ✅ Good
type User = { id: number; name: string };
const UserCard = component<User>(({ user }) => m.Div({ children: user.name }));

// ❌ Bad - no type safety
const UserCard = component(({ user }) => m.Div({ children: user.name }));
```

### 7. Organize File Structure

Keep a clean file structure:

```
dev/
├── page.ts              # Main entry
├── @elements/           # Reusable components
│   ├── button.ts
│   ├── card.ts
│   └── index.ts
├── @utils/              # Utility functions
│   └── helpers.ts
├── @types/              # TypeScript types
│   └── index.ts
└── about.page.ts        # Additional pages
```

### 8. Use Derived Signals

Use derived signals for computed values:

```typescript
// ✅ Good
const firstName = signal("John");
const lastName = signal("Doe");
const fullName = derive(() => `${firstName.value} ${lastName.value}`);

// ❌ Bad - manual tracking
const firstName = signal("John");
const lastName = signal("Doe");
const fullName = signal(`${firstName.value} ${lastName.value}`);
// Need to manually update fullName when firstName/lastName changes
```

### 9. Handle Loading and Error States

Always handle loading and error states for async operations:

```typescript
// ✅ Good
(m.If({
  subject: isLoading,
  isTruthy: () => m.Div({ children: "Loading..." }),
}),
  m.If({
    subject: error,
    isTruthy: () => m.Div({ children: "Error occurred" }),
  }),
  m.If({
    subject: data,
    isTruthy: () => DataView({ data }),
  }));

// ❌ Bad - no loading/error handling
m.Div({ children: data });
```

### 10. Use CSS Classes Over Inline Styles

Prefer CSS classes over inline styles for better maintainability:

```typescript
// ✅ Good
m.Div({ class: "container p-4", children: "Content" });

// ⚠️ Acceptable for dynamic values
m.Div({
  class: "container",
  style: tmpl`padding: ${padding}px`,
  children: "Content",
});

// ❌ Bad - hardcoded inline styles
m.Div({ style: "padding: 16px; margin: 8px;", children: "Content" });
```

### 11. Clean Up Effects

Use `onunmount` to clean up resources:

```typescript
// ✅ Good
m.Div({
  onmount: (el) => {
    const interval = setInterval(() => console.log("Tick"), 1000);
    (el as any)._interval = interval;
  },
  onunmount: (el) => {
    clearInterval((el as any)._interval);
  },
  children: "Content",
});
```

### 12. Passing signals to attributes and children IS A MUST for reactivity

```typescript
const cssClasses = signal("red p-4");
const content = signal("Content");

// ✅ Good
m.Div({ class: cssClasses, children: content });

// ⚠️ Acceptable for inline signal computation
// tmpl already converts primitive values to string internally
m.Div({
  class: tmpl`m-3 ${cssClasses}`,
  children: content,
});

// ❌ Bad: Never unwrap signals when passing to tmpl
// signal returned from tmpl will never recompute if cssClasses changes
m.Div({
  class: tmpl`m-3 ${cssClasses.value}`,
  children: content,
});

// ⚠️ Acceptable style of unwrapping inside tmpl
// use a method which returns unwrapped signal intead of plain unwrapped signal
m.Div({
  class: tmpl`m-3 ${() => cssClasses.value}`,
  children: content,
});

// ❌ Bad: Never unwrap signals when passing to attributes
// class attribute will never react to any changes in cssClasses signal
// children attribute will never react to any changes in content signal
m.Div({ class: cssClasses.value, children: content.value });
```

### 13. Use 'tmpl' instead of 'derive' method for derived string signals

```typescript
const cssClasses = signal("br3 p-2");

// ✅ Good, always prefer this
// cssClasses already computed for deriving final derived signal
m.Div({
  class: tmpl`m-3 ${cssClasses}`,
  children: "content",
});

// ⚠️ Acceptable but not preferred
// cssClasses need to be unwrapped for deriving final derived signal
m.Div({
  class: derive(() => `m-3 ${cssClasses.value}`),
  children: "content",
});
```

---

## Common Patterns

### Pattern 1: Controlled Input

```typescript
const inputValue = signal("");

m.Input({
  value: inputValue,
  oninput: (e) => {
    inputValue.value = (e.target as HTMLInputElement).value;
  },
});
```

### Pattern 2: Toggle State

```typescript
const isOpen = signal(false);

m.Div({
  children: [
    m.Button({
      onclick: () => (isOpen.value = !isOpen.value),
      children: isOpen ? "Close" : "Open",
    }),
    m.If({
      subject: isOpen,
      isTruthy: () => m.Div({ children: "Content" }),
    }),
  ],
});
```

### Pattern 3: Array Operations

```typescript
const items = signal([1, 2, 3]);

// Add item
m.Button({
  onclick: () => {
    items.value = [...items.value, items.value.length + 1];
  },
  children: "Add",
});

// Remove item
m.Button({
  onclick: () => {
    items.value = items.value.slice(0, -1);
  },
  children: "Remove",
});
```

### Pattern 4: Form Submission

```typescript
const formData = signal({ name: "", email: "" });

m.Form({
  onsubmit: (e) => {
    e.preventDefault();
    console.log("Submit:", formData.value);
  },
  children: [
    m.Input({
      value: formData.value.name,
      oninput: (e) => {
        formData.value = {
          ...formData.value,
          name: (e.target as HTMLInputElement).value,
        };
      },
    }),
    m.Button({ type: "submit", children: "Submit" }),
  ],
});
```

### Pattern 5: Modal/Dialog

```typescript
const isModalOpen = signal(false);

m.Div({
  children: [
    m.Button({
      onclick: () => (isModalOpen.value = true),
      children: "Open Modal",
    }),
    m.If({
      subject: isModalOpen,
      isTruthy: () =>
        m.Div({
          style:
            "position: fixed; top: 0; left: 0; right: 0; bottom: 0; background: rgba(0,0,0,0.5);",
          children: m.Div({
            style: "background: white; padding: 20px; margin: 100px;",
            children: [
              m.H2({ children: "Modal" }),
              m.Button({
                onclick: () => (isModalOpen.value = false),
                children: "Close",
              }),
            ],
          }),
        }),
    }),
  ],
});
```

---

## Troubleshooting

### Issue: "Can't find variable: window" during build

**Cause:** Using browser APIs during BUILD phase
**Solution:** Move browser-specific logic to `onmount` event

### Issue: Elements not updating when signal changes

**Cause:** Signal not properly connected to element
**Solution:** Ensure signal is used directly in element props or children

### Issue: List items flickering on update

**Cause:** Not using `itemKey` in For element
**Solution:** Add `itemKey` prop with unique identifier

### Issue: onmount not firing

**Cause:** Running in BUILD phase
**Solution:** `onmount` only fires in MOUNT and RUN phases

### Issue: Style attribute not applying

**Cause:** Invalid CSS or security violation
**Solution:** Check for blocked patterns (url(), expression(), javascript:)

### Issue: CLI version mismatch

**Cause:** karma.ts version doesn't match installed CLI
**Solution:** Update karma.ts version or install matching CLI version

---

## Additional Resources

### Package Documentation

- `@cyftech/signal` - Signal reactivity system
- `@cyftech/immutjs` - Immutable array operations
- `@mufw/maya` - Core Maya framework
- `@mufw/brahma` - CLI tool

### TypeScript Types

All types are exported from `@mufw/maya`:

```typescript
import type {
  Child,
  Children,
  MHtmlElement,
  MHtmlElementGetter,
  Props,
  PropsOrChildren,
  MayaAppPhase,
} from "@mufw/maya";
```

---

## When to Use Maya

Maya is particularly suited for:

- Business applications and dashboards
- Productivity tools and editors
- PWAs and offline-capable applications
- Content-heavy websites
- Static-hosted applications
- Applications that benefit from simple deployment

Maya may not be the best choice for:

- Applications requiring complex SPA routing
- Applications requiring server-side rendering
- Applications requiring advanced form abstractions
- Applications requiring comprehensive offline caching (currently)

### Architectural Tradeoffs

Maya prioritizes:

- Simplicity over framework abstraction depth
- Deployability over SPA purity
- Browser alignment over server-centric architectures
- Infrastructure reduction over operational complexity

---

## Contributor Guidelines

When contributing to Maya or applications built with Maya:

### Preserve the Philosophy

- Do not make Maya more SPA-first, server-first, or Virtual-DOM-centric
- Prefer browser-native solutions over framework abstractions
- Keep build output deployable as static assets
- Maintain the MPA-first architecture

### Before Adding Abstractions

Ask whether HTML, CSS, JavaScript, DOM APIs, service workers, storage APIs, or static hosting conventions already solve the problem.

### Document Discrepancies

If code disagrees with [ARCHITECTURE.md](./ARCHITECTURE.md), document the discrepancy rather than silently changing the architecture.

For detailed contributor guidance, see [ARCHITECTURE.md](./ARCHITECTURE.md).

---

## Summary

Maya is a signal-based reactive framework that:

- Uses a three-phase system (BUILD → MOUNT → RUN)
- Provides HTML elements via the `m` object
- Supports custom elements (For, If, Switch)
- Uses signals from `@cyftech/signal` for reactivity
- Requires a `karma.ts` configuration file
- Uses the Brahma CLI for development workflow

Key principles:

- Always use signals for reactive state
- Use `onmount` for browser-specific logic
- Provide `itemKey` for efficient list updates
- Keep components small and reusable
- Handle loading and error states
- Organize code with clear file structure

This guide provides all necessary information for an LLM to generate Maya application source code effectively.
