import {
  getCss,
  type AppClassNames,
  type AtomicClassOverrides,
  type BaseClassName,
  type ClassNamesPhrase,
  type MediaConstraintsOverrides,
} from "@cyftec/maya/nocss";

/**
 * This file is an example app stylesheet source. Brahma reads its exported
 * maps at build time and writes a sibling styles.css file; the maps themselves
 * are not needed by the browser bundle.
 */
export const overriddenMediaConstraints = {
  ns: { minWidth: "30em" },
  m: { minWidth: "30em", maxWidth: "60em" },
  l: { minWidth: "60em" },
} as const satisfies MediaConstraintsOverrides;

export const overriddenBaseClasses = {
  default: {
    theme: "{ color: #ee4440 }",
    "bg-theme": "{ background-color: #ee4440 }",
  },
} as const satisfies AtomicClassOverrides;

export const compoundClasses = {
  card: "bg-theme pa2 b--light-silver br4",
} as const;

export type { ClassNamesPhrase };
export type ClassName = AppClassNames<
  BaseClassName,
  typeof overriddenBaseClasses,
  typeof compoundClasses
>;
export const css = getCss<ClassName>();
