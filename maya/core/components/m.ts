import type {
  ChildrenOrProps,
  MHtmlElementGetter,
  MHtmlTagName,
} from "../../index.types.ts";
import { htmlTagNames } from "../../utils/index.ts";
import { getElementGetter } from "../dom/index.ts";
import {
  forComponent,
  ifComponent,
  switchComponent,
  type ForComponent,
  type IfComponent,
  type SwitchComponent,
} from "./custom-components/index.ts";

type MHtmlComponent = (childrenOrProps: ChildrenOrProps) => MHtmlElementGetter;
type MHtmlComponentsMap = {
  [key in MHtmlTagName]: MHtmlComponent;
};

const mHtmlComponentsMap: MHtmlComponentsMap = htmlTagNames.reduce(
  (map, htmlTagName) => {
    const mHtmlTagName = htmlTagName
      .split("")
      .map((char, index) => (!index ? char.toUpperCase() : char))
      .join("") as MHtmlTagName;
    const mHtmlComp: MHtmlComponent = (childrenOrProps: ChildrenOrProps) =>
      getElementGetter(htmlTagName, childrenOrProps);
    map[mHtmlTagName] = mHtmlComp;
    return map;
  },
  {} as MHtmlComponentsMap
);

type CustomComponentsMap = {
  For: ForComponent;
  If: IfComponent;
  Switch: SwitchComponent;
};

const customComponentsMap: CustomComponentsMap = {
  For: forComponent,
  If: ifComponent,
  Switch: switchComponent,
};

type ComponentsMap = MHtmlComponentsMap & CustomComponentsMap;

export const m: ComponentsMap = {
  ...mHtmlComponentsMap,
  ...customComponentsMap,
};
