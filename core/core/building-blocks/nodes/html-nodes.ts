import { createHtmlNode } from "../../dom/index";
import type {
  HtmlNodeProps,
  HtmlNodesMap,
  NodesMap,
  NodeTagName,
} from "../../types";
import { htmlTagNames } from "../../utils/index";
import {
  customeNodeFor,
  customeNodeIf,
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
  For: customeNodeFor,
  If: customeNodeIf,
  Switch: customeNodeSwitch,
};
