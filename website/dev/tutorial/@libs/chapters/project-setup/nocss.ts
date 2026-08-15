import { m } from "@cyftec/maya/core";
import { Article, Bullets, Code, Note, Paragraphs, Section } from "../article";

export const NoCss = Article(
  m.H3({ children: "Style the app with NoCSS" }),
  Paragraphs(
    "NoCSS is Maya's recommended atomic styling system for your app's own elemental rules. You author a typed styles.ts module, use its css helper in Maya elements, and let Brahma generate styles.css from the class names collected while it builds the pages.",
    "The stylesheet filename and assets directory come from _karma/karma.ts. In the standard web scaffold, the source is dev/view/pages/assets/styles.ts and the generated asset is stage/assets/styles.css.",
    "NoCSS can coexist with a deliberate third-party style source, such as an icon package or syntax-highlighting theme. Give each source a clear job and avoid accidental cascade overlap.",
  ),
  Code(`import {
  defineCompoundClasses,
  getCss,
  type AppAtomicClassNames,
  type AppClassNames,
  type AtomicClassOverrides,
  type AtomicClassName,
} from "@cyftec/maya/nocss";

export const atomicClassOverrides = {
  default: {
    theme: "{ color: #ee4440; }",
  },
} as const satisfies AtomicClassOverrides;

type AppAtomicClassName = AppAtomicClassNames<
  AtomicClassName,
  typeof atomicClassOverrides
>;

export const compoundClasses = defineCompoundClasses<AppAtomicClassName>()({
  card: "theme pa3 br3 shadow-1",
});

export type ClassName = AppClassNames<
  AtomicClassName,
  typeof atomicClassOverrides,
  typeof compoundClasses
>;

export const css = getCss<ClassName, typeof compoundClasses>(compoundClasses);`),
  Section(
    "Use the typed helper",
    Code(`import { css } from "./assets/styles.js";

m.Article({
  class: css(
    "card",
    css.when(selected, "bw2", "bw1"),
  ),
  children: "Typed and collected",
});`),
    Bullets(
      "Use css for every class, including one static class.",
      "Use css.when for boolean style states.",
      "Use css.cases when one subject selects among several style states.",
      "Use css.ifNullable only when null or undefined needs a static fallback.",
      "Add missing declarations and reusable groups to the same styles.ts.",
      "For a single concern: use a matching atom, override an atom when its declaration does not fit, or add a missing atom.",
      "For a repeated combination: use an existing compound or create a flat compound from resolved atoms.",
    ),
  ),
  Note(
    "Coding agents may author application styles only through NoCSS. They must not write a CSS file, inline style, style element, injected CSS, raw class string, or another styling dependency. This is an agent-workflow rule: human application authors may choose a deliberate hybrid alongside NoCSS.",
  ),
);
