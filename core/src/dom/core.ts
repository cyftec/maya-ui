import {
  derived,
  effect,
  valueIsSignal,
  type MaybeSignal,
  type Signal,
} from "../imported/index";
import {
  valueIsArray,
  valueIsChildren,
  valueIsChildrenProp,
  valueIsChildrenSignal,
  valueIsNode,
  valueIsSignalNode,
  customEventKeys,
  eventKeys,
  htmlEventKeys,
  idGen,
} from "../utils/index";
import type {
  AttributeKey,
  AttributeSignalsMap,
  AttributeValue,
  AttributesMap,
  Children,
  CustomEventKey,
  CustomEventValue,
  DomEventKey,
  EventsMap,
  HtmlEventKey,
  HtmlNode,
  HtmlNodeProps,
  HtmlTagName,
  MaybeArray,
  Node,
  TextComponent,
  TextNode,
} from "../types";

const attributeIsChildren = (
  propKey: string,
  propValue: any,
  tagName: string
): boolean => {
  if (propKey === "children") {
    if (valueIsChildrenProp(propValue)) return true;
    throw new Error(`Invalid children prop for node with tagName: ${tagName}`);
  }
  return false;
};

const attributeIsEvent = (
  propKey: string,
  propValue: any,
  tagName: string
): boolean => {
  if (eventKeys.includes(propKey as DomEventKey)) {
    if (typeof propValue === "function") return true;
    throw new Error(`Invalid event for node with tagName: ${tagName}`);
  }
  return false;
};

const attributeIsHtmlEvent = (
  propKey: string,
  propValue: any,
  tagName: string
): boolean =>
  htmlEventKeys.includes(propKey as HtmlEventKey) &&
  attributeIsEvent(propKey, propValue, tagName);

const attributeIsCustomEvent = (
  propKey: string,
  propValue: any,
  tagName: string
): boolean =>
  customEventKeys.includes(propKey as CustomEventKey) &&
  attributeIsEvent(propKey, propValue, tagName);

const handleEventProps = (htmlNode: HtmlNode, events: EventsMap): void => {
  Object.entries(events).forEach(([eventName, listenerFn]) => {
    if (attributeIsHtmlEvent(eventName, listenerFn, htmlNode.tagName)) {
      const eventKey = eventName.slice(2);
      htmlNode.addEventListener(eventKey, (e: Event) => {
        if (eventKey === "keypress") {
          e.preventDefault();
        }
        listenerFn(e);
      });
    } else if (
      attributeIsCustomEvent(eventName, listenerFn, htmlNode.tagName) &&
      eventName === "onunmount"
    ) {
      htmlNode.unmountListener = listenerFn as CustomEventValue;
    } else {
      console.error(
        `Invalid event key: ${eventName} for node with tagName: ${htmlNode.tagName}`
      );
    }
  });
};

const handleAttributeProps = (
  htmlNode: HtmlNode,
  attributes: AttributesMap
): void => {
  const attribSignals: AttributeSignalsMap = {};

  const getAttrValueString = (attrValue: MaybeSignal<string>): string =>
    valueIsSignal(attrValue)
      ? (attrValue as Signal<string>).value
      : (attrValue as string);

  const setAttribute = (
    htmlNode: HtmlNode,
    attrKey: string,
    attrValue: MaybeSignal<string>
  ): void => {
    if (attrKey === "value") {
      htmlNode.value = getAttrValueString(attrValue);
    } else if (attrKey === "classname") {
      htmlNode.setAttribute("class", getAttrValueString(attrValue));
    } else {
      htmlNode.setAttribute(attrKey, getAttrValueString(attrValue));
    }
  };

  Object.entries(attributes).forEach((attrib) => {
    const [attrKey, attrVal] = attrib;
    const maybeSignalAttrVal = attrVal as AttributeValue;

    if (valueIsSignal(maybeSignalAttrVal)) {
      attribSignals[attrKey as AttributeKey] =
        maybeSignalAttrVal as Signal<string>;
      return;
    }
    setAttribute(htmlNode, attrKey, maybeSignalAttrVal);
  });

  const attrSignalsEffect = () => {
    Object.entries(attribSignals).forEach(([attrKey, attrValue]) => {
      console.log(attrKey, attrValue);
      setAttribute(htmlNode, attrKey, attrValue as Signal<string>);
    });
  };

  effect(attrSignalsEffect);
};

const getDomNode = (node: MaybeSignal<Node>): Node =>
  valueIsNode(node)
    ? (node as Node)
    : valueIsSignalNode(node)
    ? (node as Signal<Node>).value
    : (node as Node);

const handleChildrenProps = (parentNode: HtmlNode, children?: Children) => {
  if (!children) return;

  if (valueIsChildrenSignal(children)) {
    effect(() => {
      const childrenSignal = children as Signal<MaybeArray<Node>>;
      const childrenSignalValue = childrenSignal.value;
      const childNodes = valueIsArray(childrenSignalValue)
        ? childrenSignalValue
        : [childrenSignalValue];
      childNodes.forEach((node, index) => {
        const prevChildNode = parentNode.childNodes[index];
        const newChildNode = node;
        if (prevChildNode && newChildNode) {
          parentNode.replaceChild(newChildNode, prevChildNode);
        } else if (newChildNode) {
          parentNode.appendChild(newChildNode);
        } else {
          console.error(
            `No child found for node with tagName: ${parentNode.tagName}`
          );
        }
      });
      for (let i = childNodes.length; i < parentNode.childNodes.length; i++) {
        const childNode = parentNode.childNodes[i];
        if (childNode) parentNode.removeChild(childNode);
      }
    });
  }

  if (valueIsChildren(children)) {
    const childNodes = children as MaybeArray<MaybeSignal<Node>>;
    const fixedSignalNodes: { index: number; signalNode: Signal<Node> }[] = [];
    const sanitisedChildren = valueIsArray(childNodes)
      ? childNodes
      : [childNodes];

    sanitisedChildren.forEach((maybeSignalChild, index) => {
      if (valueIsSignalNode(maybeSignalChild)) {
        fixedSignalNodes.push({
          index,
          signalNode: maybeSignalChild as Signal<Node>,
        });
        return;
      }
      if (window.isDomAccessPhase) return;
      const childNode = getDomNode(maybeSignalChild);
      parentNode.appendChild(childNode);
    });

    if (fixedSignalNodes.length) {
      fixedSignalNodes.forEach(({ index, signalNode }) => {
        const updateSignalledNodes = () => {
          const newChildNode = signalNode.value;
          if (!newChildNode) return;
          const prevChildNode = parentNode.childNodes[index];

          if (prevChildNode && newChildNode) {
            parentNode.replaceChild(newChildNode, prevChildNode);
          } else if (newChildNode) {
            parentNode.appendChild(newChildNode);
          } else {
            console.error(
              `No child found for node with tagName: ${parentNode.tagName}`
            );
          }
        };
        effect(updateSignalledNodes);
      });
    }
  }
};

const getNodesEventsAndAttributes = (
  props: HtmlNodeProps,
  tagName: string
): {
  children: Children | undefined;
  events: EventsMap;
  attributes: AttributesMap;
} => {
  let children: Children | undefined = undefined;
  const events: EventsMap = {};
  const attributes: AttributesMap = {};

  Object.entries(props).forEach(([propKey, propValue]) => {
    if (attributeIsChildren(propKey, propValue, tagName)) {
      children = propValue as Children;
    } else if (attributeIsEvent(propKey, propValue, tagName)) {
      events[propKey as DomEventKey] = propValue as (event: Event) => void;
    } else {
      attributes[propKey as AttributeKey] = propValue as string;
    }
  });

  return { children, events, attributes };
};

export const createHtmlNode = (
  tagName: HtmlTagName,
  props: HtmlNodeProps
): HtmlNode => {
  const nodeId = idGen.getNewId();
  const htmlNode = window.isDomAccessPhase
    ? (document.querySelector(`[data-node-id="${nodeId}"]`) as HtmlNode)
    : (document.createElement(tagName) as HtmlNode);
  htmlNode.nodeId = nodeId;
  htmlNode.unmountListener = undefined;
  props["data-node-id"] = htmlNode.nodeId.toString();

  // console.log("\n\n");
  // console.log(htmlNode.tagName);
  const { children, events, attributes } = getNodesEventsAndAttributes(
    props,
    htmlNode.tagName
  );
  handleEventProps(htmlNode, events);
  handleAttributeProps(htmlNode, attributes);
  handleChildrenProps(htmlNode, children);
  // console.log("------------------------------");
  // console.log("\n\n");

  return htmlNode;
};

export const createTextNode: TextComponent = (text) => {
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
