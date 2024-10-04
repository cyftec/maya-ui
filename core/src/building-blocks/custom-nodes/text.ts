import { derived, valueIsSignal, type Signal } from "../../imported/index";
import type { TextCustomNode, TextNode } from "../../types";

export const textCustomNode: TextCustomNode = (text) => {
  const getTextNode = (textValue: string) => {
    const textNode = document.createTextNode(textValue) as TextNode;
    textNode.nodeId = 0;
    textNode.unmountListener = undefined;
    return textNode;
  };

  if (valueIsSignal(text)) {
    return derived(() => getTextNode((text as Signal<string>).value));
  } else {
    return getTextNode(text as string);
  }
};
