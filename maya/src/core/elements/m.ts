import type {
  HTML5TagName,
  MayaElement,
  MayaTagName,
  PascalCase,
} from "../types.ts";
import { htmlTagNames, mathMlTagNames } from "../utils/index.ts";
import {
  forElement,
  ifElement,
  switchElement,
} from "./custom-elements/index.ts";
import { getMayaElement } from "./element.ts";

type IntrinsicElementsMap = {
  [T in HTML5TagName as PascalCase<T>]: MayaElement<T>;
};

type CustomElementsMap = {
  For: typeof forElement;
  If: typeof ifElement;
  Switch: typeof switchElement;
};

type MayaElementsMap = IntrinsicElementsMap & CustomElementsMap;

const intrinsicElementsMap = [...htmlTagNames, ...mathMlTagNames].reduce<
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

const customElementsMap: CustomElementsMap = {
  For: forElement,
  If: ifElement,
  Switch: switchElement,
};

export const m: MayaElementsMap = {
  ...intrinsicElementsMap,
  ...customElementsMap,
};
