import {
  derived,
  effect,
  valueIsSignal,
  type MaybeSignal,
  type Signal,
} from "@ckzero/maya-signal";
import { valueIsMayaNode } from "./common.ts";
import { eventKeys, htmlEventKeys, mayaEventKeys } from "./constants.ts";
import { mountUnmountObserver } from "./mutations.ts";
import type {
  AttributeKey,
  AttributeSignalsMap,
  AttributeValue,
  AttributesMap,
  Child,
  ChildSignal,
  ChildrenProp,
  ChildrenSignalProp,
  DomEventKey,
  EventsMap,
  HtmlElementTagName,
  HtmlEventKey,
  MayaElement,
  MayaElementProps,
  MayaEventKey,
  MayaEventValue,
  MayaNode,
  MayaTextElement,
  MaybeChildSignal,
  NodeChildProp,
  TextChildProp,
} from "./types.ts";

const idGen = () => {
  let elId = 0;
  return {
    getNewId: () => ++elId,
    resetIdCounter: () => (elId = 0),
  };
};

const { getNewId, resetIdCounter } = idGen();

const phaseHelper = () => {
  let buildPhase = false;
  let domAccessPhase = false;
  return {
    isBuildPhase: () => buildPhase,
    isDomAccessPhase: () => domAccessPhase,
    enableBuildPhase: () => {
      resetIdCounter();
      buildPhase = true;
    },
    disableBuildPhase: () => {
      resetIdCounter();
      buildPhase = false;
    },
    enableDomAccessPhase: () => (domAccessPhase = true),
    disableDomAccessPhase: () => (domAccessPhase = false),
  };
};
const {
  isBuildPhase,
  isDomAccessPhase,
  enableBuildPhase,
  disableBuildPhase,
  enableDomAccessPhase,
  disableDomAccessPhase,
} = phaseHelper();

export const generateStaticHtml = (page: () => MayaElement): string => {
  enableBuildPhase();
  const htmlPageNode = page();
  disableBuildPhase();
  return htmlPageNode?.outerHTML;
};

export const runScript = (page: () => MayaElement): void => {
  mountUnmountObserver.observe(document.body, {
    childList: true,
    subtree: true,
  });
  setTimeout(() => {
    enableDomAccessPhase();
    page();
    disableDomAccessPhase();
  });
};

const getPropValue = <T>(prop: MaybeSignal<T> | (() => T)): MaybeSignal<T> => {
  if (typeof prop === "string" || valueIsMayaNode(prop) || valueIsSignal(prop))
    return prop as MaybeSignal<T>;

  if (typeof prop === "function") {
    const signalledProp = derived(prop as () => T);
    return signalledProp as Signal<T>;
  }

  console.log(typeof prop, prop);
  throw new Error(
    "prop passed in component should be only string, signal-object or function"
  );
};

const getMayaTextNode = (text: string): MayaTextElement => {
  const textNode = document.createTextNode(text) as MayaTextElement;
  textNode.mayaId = undefined;
  textNode.unmountListener = undefined;
  return textNode;
};

const getDomNode = (child: MaybeChildSignal): MayaNode => {
  const maybeSignalChild =
    typeof child === "string"
      ? getMayaTextNode(child)
      : valueIsSignal(child)
      ? getDomNode((child as Signal<string | MayaElement>).value)
      : (child as MayaElement);

  return maybeSignalChild;
};

const attributeIsEvent = (attrKey: string, attrValue: any): boolean =>
  eventKeys.includes(attrKey as DomEventKey) && typeof attrValue === "function";

const attributeIsHtmlEvent = (attrKey: string, attrValue: any): boolean =>
  htmlEventKeys.includes(attrKey as HtmlEventKey) &&
  attributeIsEvent(attrKey, attrValue);

const attributeIsMayaEvent = (attrKey: string, attrValue: any): boolean =>
  mayaEventKeys.includes(attrKey as MayaEventKey) &&
  attributeIsEvent(attrKey, attrValue);

const handleAttributeProps = (
  el: MayaElement,
  attributes: AttributesMap
): void => {
  const attribSignals: AttributeSignalsMap = {};

  const getAttrValueString = (attrValue: MaybeSignal<string>): string =>
    valueIsSignal(attrValue)
      ? getAttrValueString((attrValue as Signal<string>).value)
      : (attrValue as string);

  const setAttribute = (
    el: MayaElement,
    attrKey: string,
    attrValue: MaybeSignal<string>
  ): void => {
    if (attrKey === "value") {
      el.value = getAttrValueString(attrValue);
    } else {
      el.setAttribute(attrKey, getAttrValueString(attrValue));
    }
  };

  Object.entries(attributes).forEach((attrib) => {
    const [attrKey, attrVal] = attrib;
    const maybeSignalAttrVal = getPropValue<string>(attrVal as AttributeValue);

    if (valueIsSignal(maybeSignalAttrVal)) {
      attribSignals[attrKey as AttributeKey] =
        maybeSignalAttrVal as Signal<string>;
    } else {
      setAttribute(el, attrKey, maybeSignalAttrVal);
    }
  });

  const attrSignalsEffect = () => {
    Object.entries(attribSignals).forEach(([attrKey, attrValue]) => {
      setAttribute(el, attrKey, attrValue as Signal<string>);
    });
  };

  if (isBuildPhase()) {
    attrSignalsEffect();
    return;
  }

  effect(attrSignalsEffect);
};

const handleChildrenProps = (el: MayaElement, childrenProp: ChildrenProp) => {
  const childProp = childrenProp.children;
  if (childrenProp.type === "childrenSignal") {
    const nodesListSignal = childProp as ChildrenSignalProp;
    const nodesListSignalEffect = () => {
      nodesListSignal.value.forEach((node, index) => {
        const prevChildNode = el.childNodes[index];
        const newChildNode = getDomNode(node);
        if (prevChildNode && newChildNode) {
          el.replaceChild(newChildNode, prevChildNode);
        } else if (newChildNode) {
          el.appendChild(newChildNode);
        } else {
          console.error(
            `No child found for element with tagName: ${el.tagName}`
          );
        }
      });
      for (
        let i = nodesListSignal.value.length;
        i < el.childNodes.length;
        i++
      ) {
        el.removeChild(el.childNodes[i]);
      }
    };

    if (isBuildPhase()) {
      nodesListSignalEffect();
    } else {
      effect(nodesListSignalEffect);
    }
  } else if (childrenProp.type === "innerText") {
    const maybeTextSignal = getPropValue(childProp as TextChildProp);
    const textSignalEffect = () => {
      const innerText = valueIsSignal(maybeTextSignal)
        ? (maybeTextSignal as Signal<string>).value
        : (maybeTextSignal as string);
      el.textContent = innerText;
    };
    if (isBuildPhase()) {
      textSignalEffect();
    } else {
      effect(textSignalEffect);
    }
  } else if (childrenProp.type === "children") {
    const children = childProp as NodeChildProp[];
    const fixedSignalNodes: { index: number; signalNode: ChildSignal }[] = [];
    const sanitisedChildren = children
      .filter((child) => !!child)
      .map((child) => getPropValue<Child>(child));

    sanitisedChildren.forEach((maybeSignalChild, index) => {
      if (valueIsSignal(maybeSignalChild)) {
        fixedSignalNodes.push({
          index,
          signalNode: maybeSignalChild as ChildSignal,
        });
      }
      const childNode = getDomNode(maybeSignalChild);
      el.appendChild(childNode);
    });

    if (fixedSignalNodes.length) {
      fixedSignalNodes.forEach(({ index, signalNode }) => {
        const fixedSignalNodeEffect = () => {
          const newChildNode = getDomNode(signalNode.value);
          if (!newChildNode) return;
          const prevChildNode = el.childNodes[index];

          if (prevChildNode && newChildNode) {
            el.replaceChild(newChildNode, prevChildNode);
          } else if (newChildNode) {
            el.appendChild(newChildNode);
          } else {
            console.error(
              `No child found for element with tagName: ${el.tagName}`
            );
          }
        };
        if (isBuildPhase()) {
          fixedSignalNodeEffect();
        } else {
          effect(fixedSignalNodeEffect);
        }
      });
    }
  } else {
    if (!childProp) {
      // console.log(`No children found for element with tagName: ${el.tagName}`);
      return;
    } else {
      throw new Error(
        `Invalid children prop type: ${childrenProp.type} for element with tagName: ${el.tagName}`
      );
    }
  }
};

const handleEventProps = (el: MayaElement, events: EventsMap): void => {
  Object.entries(events).forEach(([eventName, listenerFn]) => {
    if (attributeIsHtmlEvent(eventName, listenerFn)) {
      const eventKey = eventName.slice(2);
      el.addEventListener(eventKey, (e: Event) => {
        if (eventKey === "keypress") {
          e.preventDefault();
        }
        listenerFn(e);
      });
    } else if (
      attributeIsMayaEvent(eventName, listenerFn) &&
      eventName === "onunmount"
    ) {
      el.unmountListener = listenerFn as MayaEventValue;
    } else {
      console.error(
        `Invalid event key: ${eventName} for element with tagName: ${el.tagName}`
      );
    }
  });
};

const getNodesEventsAndAttributes = (
  props: MayaElementProps
): {
  children: ChildrenProp;
  events: EventsMap;
  attributes: AttributesMap;
} => {
  const children: ChildrenProp = {} as ChildrenProp;
  const events: EventsMap = {};
  const attributes: AttributesMap = {};

  Object.entries(props).forEach(([propKey, propValue]) => {
    if (propKey === "innerText") {
      children["type"] = "innerText";
      children["children"] = propValue as TextChildProp;
    } else if (propKey === "children") {
      if (Array.isArray(propValue)) {
        children["type"] = "children";
        children["children"] = propValue as NodeChildProp[];
      } else if (
        valueIsSignal(propValue) &&
        Array.isArray((propValue as Signal<any>).value)
      ) {
        children["type"] = "childrenSignal";
        children["children"] = propValue as ChildrenSignalProp;
      }
    } else if (attributeIsEvent(propKey, propValue)) {
      events[propKey as DomEventKey] = propValue as (event: Event) => void;
    } else {
      attributes[propKey as AttributeKey] = propValue as string;
    }
  });

  return { children, events, attributes };
};

export const createEl = (
  tagName: HtmlElementTagName,
  props: MayaElementProps
): MayaElement => {
  const elementId = getNewId();
  const el = isDomAccessPhase()
    ? (document.querySelector(`[data-maya-id="${elementId}"]`) as MayaElement)
    : (document.createElement(tagName) as MayaElement);
  el.mayaId = elementId;
  el.unmountListener = undefined;
  props["data-maya-id"] = el.mayaId.toString();

  // console.log("\n\n");
  // console.log(el.tagName);
  const { children, events, attributes } = getNodesEventsAndAttributes(props);
  handleAttributeProps(el, attributes);
  handleChildrenProps(el, children);
  handleEventProps(el, events);
  // console.log("------------------------------");
  // console.log("\n\n");

  return el;
};
