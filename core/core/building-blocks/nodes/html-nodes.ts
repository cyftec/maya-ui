import { derived, valueIsSignal } from "../../../signal";
import { createHtmlNode } from "../../dom/index";
import type {
  HtmlNode,
  HtmlNodeProps,
  HtmlNodesMap,
  ComponentProps,
  Component,
  NodesMap,
  NodeTagName,
  SignalledProps,
  SignalledPropsComponent,
} from "../../types";
import { htmlTagNames, valueIsChildren } from "../../utils/index";
import {
  customeNodeIf,
  customeNodeFor,
  customNodeText,
  customeNodeSwitch,
} from "./custom-nodes/index";

const htmlNodesMap: HtmlNodesMap = htmlTagNames.reduce((map, htmlTagName) => {
  const nodeTagName = htmlTagName
    .split("")
    .map((char, index) => (!index ? char.toUpperCase() : char))
    .join("") as NodeTagName;
  map[nodeTagName] = (props: HtmlNodeProps) =>
    createHtmlNode(htmlTagName, props);
  return map;
}, {} as HtmlNodesMap);

export const m: NodesMap = {
  ...htmlNodesMap,
  Text: customNodeText,
  For: customeNodeFor,
  If: customeNodeIf,
  Switch: customeNodeSwitch,
};

export const component =
  <P>(signalledPropsComp: SignalledPropsComponent<P>): Component<P> =>
  (props: ComponentProps<P>): HtmlNode => {
    const signalledProps: SignalledProps<P> = Object.entries(props).reduce(
      (map, [key, value]) => {
        map[key as keyof P] = (
          valueIsChildren(value) ||
          valueIsSignal(value) ||
          value === undefined ||
          typeof value === "function"
            ? value
            : derived(() => value)
        ) as SignalledProps<P>[keyof P];

        return map;
      },
      {} as SignalledProps<P>
    );

    return signalledPropsComp(signalledProps);
  };
