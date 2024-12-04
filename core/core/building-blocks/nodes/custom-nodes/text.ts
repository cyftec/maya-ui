import {
  derived,
  drstr,
  valueIsSignal,
  type MaybeSignal,
  type Signal,
} from "../../../../signal";
import type { CustomNodeText, TextNode } from "../../../types";

export const customeNodeText: CustomNodeText = (text, ...exprs) => {
  const getTextNode = (textValue: string) => {
    const textNode = document.createTextNode(textValue) as TextNode;
    textNode.nodeId = 0;
    textNode.unmountListener = undefined;
    return textNode;
  };

  let node;

  if (typeof text === "string") {
    node = getTextNode(text);
  }

  if (valueIsSignal(text)) {
    node = derived(() => getTextNode((text as Signal<string>).value));
  }

  if (Array.isArray(text) && exprs.length) {
    const inputSignal = drstr(text as TemplateStringsArray, ...exprs);
    node = derived(() => getTextNode(inputSignal.value));
  }

  return node as typeof text extends string ? TextNode : MaybeSignal<TextNode>;
};
