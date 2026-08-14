import { m } from "@cyftec/maya/core";
import { Article, Bullets, Code, Note, Paragraphs, Section } from "../article";

export const NoCss = Article(
  m.H3({ children: "Style the app with NoCSS" }),
  Paragraphs(
    "NoCSS is Maya's application styling system. You author a typed styles.ts module, use its css helper in Maya elements, and let Brahma generate styles.css from the class names collected while it builds the pages.",
    "The stylesheet filename and assets directory come from _karma/karma.ts. In the standard web scaffold, the source is dev/view/pages/assets/styles.ts and the generated asset is stage/assets/styles.css.",
  ),
  Code(`import {
  getCss,
  type AppClassNames,
  type AtomicClassOverrides,
  type BaseClassName,
} from "@cyftec/maya/nocss";

export const overriddenBaseClasses = {
  default: {
    theme: "{ color: #ee4440; }",
  },
} as const satisfies AtomicClassOverrides;

export const compoundClasses = {
  card: "theme pa3 br3 shadow-1",
} as const;

export type ClassName = AppClassNames<
  BaseClassName,
  typeof overriddenBaseClasses,
  typeof compoundClasses
>;

export const css = getCss<ClassName>();`),
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
    ),
  ),
  Note(
    "Coding agents may author application styles only through NoCSS. They must not write a CSS file, inline style, style element, injected CSS, raw class string, or another styling dependency. This restriction does not apply to humans.",
  ),
);
