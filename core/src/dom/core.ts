import {
  effect,
  valueIsSignal,
  type MaybeSignal,
  type Signal,
} from "../imported/index";
import type {
  AttributeKey,
  AttributeSignalsMap,
  AttributeValue,
  AttributeValueType,
  AttributesMap,
  Children,
  CustomEventKey,
  CustomEventValue,
  DomEventKey,
  DomEventValue,
  EventsMap,
  HtmlEventKey,
  HtmlNode,
  HtmlNodeProps,
  HtmlTagName,
  MaybeArray,
  Node,
} from "../types";
import {
  customEventKeys,
  eventKeys,
  htmlEventKeys,
  idGen,
  valueIsArray,
  valueIsChildren,
  valueIsChildrenProp,
  valueIsChildrenSignal,
  valueIsNode,
  valueIsSignalNode,
} from "../utils/index";

const attributeIsChildren = (
  propKey: string,
  propValue: any,
  tagName: string
): boolean => {
  if (propKey === "children") {
    if (valueIsChildrenProp(propValue)) return true;
    throw new Error(
      `Invalid children prop for node with tagName: ${tagName}\n\n ${JSON.stringify(
        propValue
      )}`
    );
  }
  return false;
};

const attributeIsUndefinedEvent = (propKey: string, propValue: any): boolean =>
  eventKeys.includes(propKey as DomEventKey) && propValue === undefined;

const attributeIsHtmlEvent = (propKey: string, propValue: any): boolean =>
  htmlEventKeys.includes(propKey as HtmlEventKey) &&
  typeof propValue === "function";

const attributeIsCustomEvent = (propKey: string, propValue: any): boolean =>
  customEventKeys.includes(propKey as CustomEventKey) &&
  typeof propValue === "function";

const attributeIsEvent = (propKey: string, propValue: any): boolean =>
  attributeIsUndefinedEvent(propKey, propValue) ||
  attributeIsHtmlEvent(propKey, propValue) ||
  attributeIsCustomEvent(propKey, propValue);

const handleEventProps = (htmlNode: HtmlNode, events: EventsMap): void => {
  Object.entries(events).forEach(([eventName, listenerFn]) => {
    if (attributeIsUndefinedEvent(eventName, listenerFn)) {
      // ignore as eventlistener is undefined
    } else if (attributeIsHtmlEvent(eventName, listenerFn)) {
      const eventKey = eventName.slice(2);
      htmlNode.addEventListener(eventKey, (e: Event) => {
        if (eventKey === "keypress") {
          e.preventDefault();
        }
        listenerFn(e);
      });
    } else if (attributeIsCustomEvent(eventName, listenerFn)) {
      if (eventName === "onunmount")
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

  const getAttrValueString = (attrValue: AttributeValue): string => {
    const attrValueString = valueIsSignal(attrValue)
      ? (attrValue as Signal<AttributeValueType>).value
      : (attrValue as AttributeValueType);

    return attrValueString === undefined ? "" : attrValueString;
  };

  const setAttribute = (
    htmlNode: HtmlNode,
    attrKey: string,
    attrValue: AttributeValue
  ): void => {
    const attrValueString = getAttrValueString(attrValue);

    if (attrKey === "value") {
      htmlNode.value = attrValueString;
    } else if (attrKey === "classname") {
      htmlNode.setAttribute("class", attrValueString);
    } else {
      htmlNode.setAttribute(attrKey, attrValueString);
    }
  };

  Object.entries(attributes).forEach((attrib) => {
    const [attrKey, attrVal] = attrib;
    const maybeSignalAttrVal = attrVal as AttributeValue;

    if (valueIsSignal(maybeSignalAttrVal)) {
      attribSignals[attrKey as AttributeKey] =
        maybeSignalAttrVal as Signal<AttributeValueType>;
      return;
    }
    setAttribute(htmlNode, attrKey, maybeSignalAttrVal);
  });

  const attrSignalsEffect = () => {
    Object.entries(attribSignals).forEach(([attrKey, attrValue]) => {
      setAttribute(htmlNode, attrKey, attrValue as Signal<AttributeValueType>);
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

      const newChildNodesCount = childNodes.length;
      while (newChildNodesCount < parentNode.childNodes.length) {
        const childNode = parentNode.childNodes[newChildNodesCount];
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
    } else if (attributeIsEvent(propKey, propValue)) {
      events[propKey as DomEventKey] = propValue as DomEventValue;
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
