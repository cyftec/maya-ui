import { derived, valueIsSignal } from "../imported/index";
import { createHtmlNode } from "../dom/index";
import type {
  HtmlNode,
  HtmlNodeProps,
  HtmlNodesMap,
  MaybeSignalProps,
  MaybeSignalsComponentFn,
  NodesMap,
  NodeTagName,
  SureSignalProps,
  SureSignalsComponentFn,
} from "../types";
import { htmlTagNames } from "../utils/index";
import { forCustomNode, textCustomNode } from "./custom-nodes/index";

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
  Text: textCustomNode,
  For: forCustomNode,
};

export function Component<P>(
  comp: SureSignalsComponentFn<P>
): MaybeSignalsComponentFn<P> {
  return function (props: MaybeSignalProps<P>): HtmlNode {
    const allProps: SureSignalProps<P> = Object.entries(props).reduce(
      (map, [key, value]) => {
        map[key as keyof P] = (
          valueIsSignal(value) || typeof value === "function"
            ? value
            : derived(() => value)
        ) as SureSignalProps<P>[keyof P];

        return map;
      },
      {} as SureSignalProps<P>
    );

    return comp(allProps);
  };
}
