import type {
  PropsOrChildren,
  HtmlTagName,
  MHtmlElementGetter,
} from "../../index.types.ts";
import { htmlTagNames } from "../../utils/index.ts";
import { createElementGetter } from "../dom/index.ts";
import {
  forElement,
  ifElement,
  switchElement,
  type ForElement,
  type IfElement,
  type SwitchElement,
} from "./custom-elements/index.ts";

type MayaTagName = Capitalize<HtmlTagName>;
type MayaElement = (propsOrChildren?: PropsOrChildren) => MHtmlElementGetter;
type MayaElementsMap = {
  [key in MayaTagName]: MayaElement;
};
const mayaElementsMap: MayaElementsMap = htmlTagNames.reduce(
  (map, htmlTagName) => {
    const mayaTagName = htmlTagName
      .split("")
      .map((char, index) => (!index ? char.toUpperCase() : char))
      .join("") as MayaTagName;
    const mHtmlComp: MayaElement = (propsOrChildren?: PropsOrChildren) =>
      createElementGetter(htmlTagName, propsOrChildren);
    map[mayaTagName] = mHtmlComp;
    return map;
  },
  {} as MayaElementsMap
);

type CustomElementsMap = {
  For: ForElement;
  If: IfElement;
  Switch: SwitchElement;
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
