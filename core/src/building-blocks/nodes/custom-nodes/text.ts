import {
  derived,
  drstr,
  valueIsSignal,
  type Signal,
} from "../../../imported/index";
import type { CustomNodeText, TextNode } from "../../../types";

export const customeNodeText: CustomNodeText = (text, ...exprs) => {
  const getTextNode = (textValue: string) => {
    const textNode = document.createTextNode(textValue) as TextNode;
    textNode.nodeId = 0;
    textNode.unmountListener = undefined;
    return textNode;
  };

  if (valueIsSignal(text)) {
    return derived(() => getTextNode((text as Signal<string>).value));
  } else if (Array.isArray(text) && exprs.length) {
    return customeNodeText(drstr(text as TemplateStringsArray, ...exprs));
  } else {
    return getTextNode(text as string);
  }
};
