import {
  effect,
  valueIsSignal,
  type MaybeSignal,
  type Signal,
} from "../../utils/signal/index.ts";
import type {
  AttributeKey,
  AttributeSignalsMap,
  AttributeValue,
  AttributeValueType,
  AttributesMap,
  Child,
  ChildSignal,
  Children,
  ChildrenProp,
  ChildrenSignal,
  CustomEventKey,
  CustomEventValue,
  DomEventKey,
  DomEventValue,
  EventsMap,
  HtmlEventKey,
  HtmlNode,
  HtmlNodeProps,
  HtmlTagName,
  Props,
} from "../../index.types.ts";
import {
  currentPhaseIs,
  customEventKeys,
  eventKeys,
  htmlEventKeys,
  idGen,
  startPhase,
  valueIsArray,
  valueIsChildren,
  valueIsChildrenProp,
  valueIsChildrenSignal,
  valueIsHtmlNode,
  valueIsSignalChild,
} from "../../utils/common/index.ts";
import { startUnmountObserver } from "./unmount-observer.ts";

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
      if (eventName === "onmount") {
        // do nothing as it's handled in 'createHtmlNode' method
      }
      if (eventName === "onunmount") {
        startUnmountObserver();
        htmlNode.unmountListener = listenerFn as CustomEventValue;
      }
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

  const getAttrValue = (attributeValue: AttributeValue): string | boolean => {
    const attrValue: AttributeValueType = valueIsSignal(attributeValue)
      ? (attributeValue as Signal<AttributeValueType>).value
      : (attributeValue as AttributeValueType);

    return attrValue ?? "";
  };

  const setAttribute = (
    htmlNode: HtmlNode,
    attrKey: string,
    attributeValue: AttributeValue
  ): void => {
    const attrValue = getAttrValue(attributeValue);

    if (typeof attrValue === "boolean") {
      if (attrValue) htmlNode.setAttribute(attrKey, "");
      else htmlNode.removeAttribute(attrKey);
    } else if (attrKey === "value") {
      htmlNode.value = attrValue;
    } else if (attrKey === "classname") {
      htmlNode.setAttribute("class", attrValue);
    } else {
      htmlNode.setAttribute(attrKey, attrValue);
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

const getNodeFromChild = (child: MaybeSignal<Child>): HtmlNode | Text => {
  if (valueIsSignalChild(child)) {
    const nonSignalChild = (child as ChildSignal).value;
    return getNodeFromChild(nonSignalChild);
  }

  if (valueIsHtmlNode(child)) {
    return child as HtmlNode;
  }

  if (typeof child !== "string") {
    throw new Error(`Invalid child. Type of child: ${typeof child}`);
  }

  return document.createTextNode(child);
};

const handleChildrenProp = (
  parentNode: HtmlNode,
  childrenProp?: ChildrenProp
) => {
  if (!childrenProp) return;

  if (valueIsChildrenSignal(childrenProp)) {
    effect(() => {
      const childrenSignal = childrenProp as ChildrenSignal;
      const childrenSignalValue = childrenSignal.value;
      const children = (
        valueIsArray(childrenSignalValue)
          ? childrenSignalValue
          : [childrenSignalValue]
      ) as Array<Child>;
      children.forEach((child, index) => {
        const prevChildNode = parentNode.childNodes[index];
        const newChildNode = getNodeFromChild(child);
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

      const newChildrenCount = children.length;
      while (newChildrenCount < parentNode.childNodes.length) {
        const childNode = parentNode.childNodes[newChildrenCount];
        if (childNode) parentNode.removeChild(childNode);
      }
    });
  }

  if (valueIsChildren(childrenProp)) {
    const children = childrenProp as Children;
    const signalledChildren: { index: number; childSignal: ChildSignal }[] = [];
    const sureArrayChildren = (
      valueIsArray(children) ? children : [children]
    ) as Array<MaybeSignal<Child>>;

    sureArrayChildren.forEach((maybeSignalChild, index) => {
      if (valueIsSignalChild(maybeSignalChild)) {
        signalledChildren.push({
          index,
          childSignal: maybeSignalChild as ChildSignal,
        });
      }
      if (currentPhaseIs("mount")) return;
      const childNode = getNodeFromChild(maybeSignalChild);
      parentNode.appendChild(childNode);
    });

    if (signalledChildren.length) {
      signalledChildren.forEach(({ index, childSignal }) => {
        effect(() => {
          if (!childSignal.value) return;
          if (currentPhaseIs("mount")) return;
          const newChildNode = getNodeFromChild(childSignal.value);
          const prevChildNode = parentNode.childNodes[index];

          if (prevChildNode && newChildNode) {
            parentNode.replaceChild(newChildNode, prevChildNode);
          } else if (!prevChildNode && newChildNode) {
            parentNode.appendChild(newChildNode);
          } else {
            console.error(
              `No child found for node with tagName: ${parentNode.tagName}`
            );
          }
        });
      });
    }
  }
};

const getNodesEventsAndAttributes = (
  props: HtmlNodeProps,
  tagName: string
): {
  childrenProp: ChildrenProp | undefined;
  events: EventsMap;
  attributes: AttributesMap;
} => {
  let childrenProp: ChildrenProp | undefined = undefined;
  const events: EventsMap = {};
  const attributes: AttributesMap = {};

  Object.entries(props).forEach(([propKey, propValue]) => {
    if (propKey === "children") {
      if (valueIsChildrenProp(propValue))
        childrenProp = propValue as ChildrenProp;
      else
        throw new Error(
          `Invalid children prop for node with tagName: ${tagName}\n\n ${JSON.stringify(
            propValue
          )}`
        );
    } else if (attributeIsEvent(propKey, propValue)) {
      events[propKey as DomEventKey] = propValue as DomEventValue;
    } else {
      attributes[propKey as AttributeKey] = propValue as string;
    }
  });

  return { childrenProp, events, attributes };
};

export const createHtmlNode = (
  tagName: HtmlTagName,
  props: Props
): HtmlNode => {
  const nodeId = idGen.getNewId();

  const htmlNode = currentPhaseIs("mount")
    ? (document.querySelector(`[data-node-id="${nodeId}"]`) as HtmlNode)
    : (document.createElement(tagName) as HtmlNode);
  htmlNode.nodeId = nodeId;
  htmlNode.unmountListener = undefined;
  const htmlNodeProps: HtmlNodeProps = valueIsChildrenProp(props)
    ? { children: props as ChildrenProp }
    : (props as HtmlNodeProps);
  htmlNodeProps["data-node-id"] = htmlNode.nodeId.toString();

  const { childrenProp, events, attributes } = getNodesEventsAndAttributes(
    htmlNodeProps,
    htmlNode.tagName
  );
  handleEventProps(htmlNode, events);
  handleAttributeProps(htmlNode, attributes);
  handleChildrenProp(htmlNode, childrenProp);

  if (
    currentPhaseIs("mount") &&
    typeof props === "object" &&
    // deno-lint-ignore no-prototype-builtins
    props.hasOwnProperty("onmount")
  ) {
    const onMount = (props as HtmlNodeProps).onmount as CustomEventValue;
    if (onMount && typeof onMount === "function") onMount();
  }

  /**
   * Mount (Dom Access) phase completes with finally accessing 'html' node,
   * and (app) Run phase starts after that
   */
  if (tagName === "html" && currentPhaseIs("mount")) {
    startPhase("run");
  }

  return htmlNode;
};
