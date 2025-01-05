import { htmlTagNames } from "../../utils/index.ts";
import { createHtmlNode } from "../dom/index.ts";
import type {
  HtmlNodesMap,
  NodesMap,
  NodeTagName,
  Props,
} from "../../index.types.ts";
import {
  customeNodeFor,
  customeNodeIf,
  customeNodeSwitch,
} from "./custom-nodes/index.ts";

const htmlNodesMap: HtmlNodesMap = htmlTagNames.reduce((map, htmlTagName) => {
  const nodeTagName = htmlTagName
    .split("")
    .map((char, index) => (!index ? char.toUpperCase() : char))
    .join("") as NodeTagName;
  map[nodeTagName] = (props: Props) => createHtmlNode(htmlTagName, props);
  return map;
}, {} as HtmlNodesMap);

export const m: NodesMap = {
  ...htmlNodesMap,
  For: customeNodeFor,
  If: customeNodeIf,
  Switch: customeNodeSwitch,
};
