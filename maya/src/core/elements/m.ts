import type {
  HtmlTagName,
  MathMlTagName,
  MayaElement,
  MayaTagName,
  PascalCase,
  SvgMayaElement,
  SvgTagAliasName,
  UnaliasedSvgTagName,
} from "../types.ts";
import {
  htmlTagNames,
  mathMlTagNames,
  svgTagAliases,
  svgTagNames,
} from "../utils/index.ts";
import {
  forElement,
  ifElement,
  switchElement,
} from "./custom-elements/index.ts";
import { getMayaElement, getSvgMayaElement } from "./element.ts";

type IntrinsicElementsMap = {
  [T in
    | HtmlTagName
    | UnaliasedSvgTagName
    | MathMlTagName as PascalCase<T>]: MayaElement<T>;
};

type SvgAliasedElementsMap = {
  [T in SvgTagAliasName]: SvgMayaElement<(typeof svgTagAliases)[T]>;
};

type CustomElementsMap = {
  For: typeof forElement;
  If: typeof ifElement;
  Switch: typeof switchElement;
};

type MayaElementsMap = IntrinsicElementsMap &
  SvgAliasedElementsMap &
  CustomElementsMap;

const intrinsicElementsMap = [
  ...htmlTagNames,
  ...svgTagNames,
  ...mathMlTagNames,
].reduce<
  Record<string, unknown>
>((map, html5TagName) => {
  const mayaElement = getMayaElement(html5TagName);
  const mayaTagName: MayaTagName = html5TagName
    .split("-")
    .map((part) => part.charAt(0).toUpperCase() + part.slice(1))
    .join("") as PascalCase<typeof html5TagName>;
  map[mayaTagName] = mayaElement;
  return map;
}, {}) as IntrinsicElementsMap;

const svgAliasedElementsMap = Object.entries(svgTagAliases).reduce<
  Record<string, unknown>
>((map, [mayaTagName, svgTagName]) => {
  map[mayaTagName] = getSvgMayaElement(svgTagName);
  return map;
}, {}) as SvgAliasedElementsMap;

const customElementsMap: CustomElementsMap = {
  For: forElement,
  If: ifElement,
  Switch: switchElement,
};

export const m: MayaElementsMap = {
  ...intrinsicElementsMap,
  ...svgAliasedElementsMap,
  ...customElementsMap,
};
