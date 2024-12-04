import {
  derived,
  dstr,
  valueIsSignal,
  type DerivedSignal,
  type Signal,
} from "../../../../signal";
import type { CustomNodeText, TextNode } from "../../../types";

export const customNodeText: CustomNodeText = (text, ...exprs) => {
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

  if (Array.isArray(text)) {
    const inputSignal = dstr(text as TemplateStringsArray, ...exprs);
    node = derived(() => getTextNode(inputSignal.value));
  }

  return node as typeof text extends string
    ? TextNode
    : DerivedSignal<TextNode>;
};
