import type {
  Children,
  MayaTagName,
  MHtmlElementGetter,
  PropsOrChildren,
  PropsForTag,
  VoidHtmlTagName,
} from "../index.types.ts";
import { htmlTagNames, mathMlTagNames } from "../utils/index.ts";
import { elementGetter } from "./element.ts";
import {
  forElement,
  ifElement,
  switchElement,
} from "./custom-elements/index.ts";

type MayaElement<T extends MayaTagName> = T extends VoidHtmlTagName
  ? (props?: PropsForTag<T>) => MHtmlElementGetter
  : {
      (props?: PropsForTag<T>): MHtmlElementGetter;
      (children: Children): MHtmlElementGetter;
    };
type MayaElementsMap = {
  [T in MayaTagName as PascalCase<T>]: MayaElement<T>;
};
type PascalCase<T extends string> = T extends `${infer Head}-${infer Tail}`
  ? `${Capitalize<Head>}${PascalCase<Tail>}`
  : Capitalize<T>;
const mayaElementsMap = [...htmlTagNames, ...mathMlTagNames].reduce<Record<string, unknown>>(
  (map, htmlTagName) => {
    const mayaTagName = htmlTagName
      .split("-")
      .map((part) => part.charAt(0).toUpperCase() + part.slice(1))
      .join("") as PascalCase<typeof htmlTagName>;
    const mHtmlComp = (propsOrChildren?: PropsOrChildren) =>
      elementGetter(htmlTagName, propsOrChildren);
    map[mayaTagName] = mHtmlComp;
    return map;
  },
  {},
) as MayaElementsMap;

type CustomElementsMap = {
  For: typeof forElement;
  If: typeof ifElement;
  Switch: typeof switchElement;
};
const customElementsMap: CustomElementsMap = {
  For: forElement,
  If: ifElement,
  Switch: switchElement,
};

type ElementsMap = MayaElementsMap & CustomElementsMap;
export const m: ElementsMap = {
  ...mayaElementsMap,
  ...customElementsMap,
};
