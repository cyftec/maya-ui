import type {
  Children,
  HtmlTagName,
  MHtmlElementGetter,
  PropsOrChildren,
  PropsForTag,
  VoidHtmlTagName,
} from "../index.types.ts";
import { htmlTagNames } from "../utils/index.ts";
import { elementGetter } from "./element.ts";
import {
  forElement,
  ifElement,
  switchElement,
} from "./custom-elements/index.ts";

type MayaElement<T extends HtmlTagName> = T extends VoidHtmlTagName
  ? (props?: PropsForTag<T>) => MHtmlElementGetter
  : {
      (props?: PropsForTag<T>): MHtmlElementGetter;
      (children: Children): MHtmlElementGetter;
    };
type MayaElementsMap = {
  [T in HtmlTagName as Capitalize<T>]: MayaElement<T>;
};
const mayaElementsMap = htmlTagNames.reduce<Record<string, unknown>>(
  (map, htmlTagName) => {
    const mayaTagName = htmlTagName
      .split("")
      .map((char, index) => (!index ? char.toUpperCase() : char))
      .join("") as Capitalize<typeof htmlTagName>;
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
