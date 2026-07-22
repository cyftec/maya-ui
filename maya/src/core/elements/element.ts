import {
  effect,
  value,
  valueIsNonSignalObject,
  valueIsSignal,
  valueIsSignalifiedObject,
  type MaybeSignal,
  type NonSignal,
  type Signal,
  type SignalifiedObject,
} from "@cyftec/signal";
import type {
  AttributeKey,
  AttributeProps,
  AttributeValue,
  Child,
  Children,
  ChildrenArray,
  CustomEventKey,
  CustomEventValue,
  DomEventValue,
  EventProps,
  HTML5TagName,
  HtmlEventValue,
  MayaElement,
  MayaNode,
  MayaNodeGetter,
  NonSignalChild,
  NonSignalChildren,
  Props,
  PropsOrChildren,
  SignalAttributeProps,
  SignalChild,
  SignalChildOrChildren,
  SvgMayaElement,
  SvgTagName,
} from "../types";
import {
  decodeHTMLEntities,
  idGen,
  mathMlTagNames,
  phase,
  sanitizeAttributeValue,
  startUnmountObserver,
  svgTagNames,
  validChild,
  validChildren,
  validChildrenProp,
  validNonSignalChild,
  validPlainChildren,
  validSignalChild,
  validSignalChildOrChildren,
  valueIsArray,
  valueIsMayaNode,
} from "../utils";

const SVG_NAMESPACE = "http://www.w3.org/2000/svg";
const MATHML_NAMESPACE = "http://www.w3.org/1998/Math/MathML";
const createMayaNodeForTag = (
  tagName: HTML5TagName,
  namespaceURI?: string,
): MayaNode => {
  if (namespaceURI === SVG_NAMESPACE)
    return document.createElementNS(
      SVG_NAMESPACE,
      tagName,
    ) as unknown as MayaNode;
  if (mathMlTagNames.includes(tagName as (typeof mathMlTagNames)[number]))
    return document.createElementNS(
      MATHML_NAMESPACE,
      tagName,
    ) as unknown as MayaNode;

  if (svgTagNames.includes(tagName as (typeof svgTagNames)[number]))
    return document.createElementNS(
      SVG_NAMESPACE,
      tagName,
    ) as unknown as MayaNode;
  return document.createElement(tagName) as unknown as MayaNode;
};

const isEventPropKey = (propKey: string): boolean => propKey.startsWith("on");
const isCustomEventKey = (propKey: string): propKey is CustomEventKey =>
  propKey === "onmount" || propKey === "onunmount";

const attributeIsUndefinedEvent = (propKey: string, propValue: any): boolean =>
  isEventPropKey(propKey) && propValue === undefined;

const attributeIsHtmlEvent = (propKey: string, propValue: any): boolean =>
  isEventPropKey(propKey) &&
  !isCustomEventKey(propKey) &&
  typeof propValue === "function";

const attributeIsCustomEvent = (propKey: string, propValue: any): boolean =>
  isCustomEventKey(propKey) && typeof propValue === "function";

const attributeIsEvent = (propKey: string, propValue: any): boolean =>
  attributeIsUndefinedEvent(propKey, propValue) ||
  attributeIsHtmlEvent(propKey, propValue) ||
  attributeIsCustomEvent(propKey, propValue);

const handleEventProps = (mayaNode: MayaNode, eventProps: EventProps): void => {
  Object.entries(eventProps).forEach(([eventName, listenerFn]) => {
    if (attributeIsUndefinedEvent(eventName, listenerFn)) {
      // ignore as eventlistener is undefined
    } else if (attributeIsHtmlEvent(eventName, listenerFn)) {
      const eventKey = eventName.slice(2);
      mayaNode.addEventListener(eventKey, (e: Event) => {
        if (eventKey === "keypress") {
          e.preventDefault();
        }
        (listenerFn as HtmlEventValue)(e);
      });
    } else if (attributeIsCustomEvent(eventName, listenerFn)) {
      if (eventName === "onmount" && !phase.currentIs("build")) {
        const onMount = listenerFn as CustomEventValue;
        setTimeout(() => onMount(mayaNode), 0);
      }
      if (eventName === "onunmount") {
        startUnmountObserver();
        const topLevelUnmountListener = mayaNode.unmountListener;
        mayaNode.unmountListener = (currentNode: MayaNode) => {
          (listenerFn as CustomEventValue)(currentNode);
          if (typeof topLevelUnmountListener === "function")
            topLevelUnmountListener(currentNode);
        };
      }
    } else {
      console.error(
        `Invalid event key: ${eventName} for element with tagName: ${mayaNode.tagName}`,
      );
    }
  });
};

const setAttribute = (
  mayaNode: MayaNode,
  attrKey: string,
  attributePropValue: MaybeSignal<AttributeValue>,
): void => {
  const unsafeAttrValue = valueIsSignalifiedObject(attributePropValue)
    ? (attributePropValue as SignalifiedObject<AttributeValue>).value
    : (attributePropValue as AttributeValue);
  const attrValue = sanitizeAttributeValue(attrKey, unsafeAttrValue);

  if (typeof attrValue === "boolean") {
    if (attrValue) mayaNode.setAttribute(attrKey, "");
    else mayaNode.removeAttribute(attrKey);
  } else if (attrKey === "value") {
    mayaNode.value = attrValue || "";
  } else {
    mayaNode.setAttribute(attrKey, attrValue || "");
  }
};

const handleAttributeProps = (
  mayaNode: MayaNode,
  attributeProps: AttributeProps,
): void => {
  const signalAttributeProps: SignalAttributeProps = {};

  Object.entries(attributeProps).forEach((attributeProp) => {
    const [attrKey, attrVal] = attributeProp;
    if (valueIsSignal(attrVal)) {
      signalAttributeProps[attrKey as AttributeKey] =
        attrVal as Signal<AttributeValue>;
    }
    setAttribute(mayaNode, attrKey, attrVal);
  });

  const attributesUpdator = effect(() => {
    Object.entries(signalAttributeProps).forEach((signalAttributeProp) => {
      const [attrKey, attrVal] = signalAttributeProp;
      const signalAttrVal = (attrVal as Signal<AttributeValue>).value;
      if (!phase.currentIs("run")) return;
      setAttribute(mayaNode, attrKey, signalAttrVal);
    });
  });
  mayaNode.effects.push(attributesUpdator);
};

const getNodeFromChild = (child: Child): MayaNode | Text => {
  if (!child || typeof child === "string") {
    return document.createTextNode(decodeHTMLEntities(child || ""));
  }

  if (validChild(child)) {
    // the valid child is only 'MayaNodeGetter' now and not
    // 'undefined' or 'string' as that case is handled above already
    const mayaNode = (child as MayaNodeGetter)();
    if (!valueIsMayaNode(mayaNode)) {
      throw new Error(`Invalid maya-node-getter child. Type: ${typeof child}`);
    }
    return mayaNode as MayaNode;
  }

  throw new Error(`Invalid child. Type of child: ${typeof child}`);
};

const setChild = (
  parentNode: MayaNode,
  child: Child,
  childPositionIndex: number,
) => {
  const prevChildNode = parentNode.childNodes[childPositionIndex];
  const newChildNode = getNodeFromChild(child);
  if (prevChildNode && newChildNode) {
    parentNode.replaceChild(newChildNode, prevChildNode);
  } else if (newChildNode) {
    parentNode.appendChild(newChildNode);
  } else {
    console.error(
      `No child found for node with tagName: ${parentNode.tagName}`,
    );
  }
};

const handleChildrenProp = (parentNode: MayaNode, children?: Children) => {
  if (!children) return;

  if (validSignalChildOrChildren(children)) {
    const signalChildrenUpdator = effect(() => {
      const signalChildOrChildrenValue = (children as SignalChildOrChildren)
        .value;
      const childrenList = valueIsArray(signalChildOrChildrenValue)
        ? (signalChildOrChildrenValue as Child[])
        : [signalChildOrChildrenValue as Child];
      childrenList.forEach((child, index) =>
        setChild(parentNode, child, index),
      );

      const newChildrenCount = childrenList.length;
      while (newChildrenCount < parentNode.childNodes.length) {
        const childNode = parentNode.childNodes[newChildrenCount];
        if (childNode) parentNode.removeChild(childNode);
      }
    });
    parentNode.effects.push(signalChildrenUpdator);
  }

  const childrenList: (Child | SignalChild)[] = validChild(children)
    ? [children as Child]
    : valueIsNonSignalObject(children)
      ? validChild((children as NonSignal<any>).value)
        ? [(children as NonSignal<any>).value as Child]
        : validChildren((children as NonSignal<any>).value)
          ? (children as NonSignalChildren).value
          : []
      : validPlainChildren(children)
        ? (children as ChildrenArray).map((ch) =>
            validSignalChild(ch)
              ? (ch as SignalChild)
              : validNonSignalChild(ch)
                ? (ch as NonSignalChild).value
                : (ch as Child),
          )
        : [];

  const signalChildren: { index: number; signalChild: SignalChild }[] = [];
  childrenList.forEach((maybeSignalChild, index) => {
    if (validSignalChild(maybeSignalChild)) {
      signalChildren.push({
        index,
        signalChild: maybeSignalChild as SignalChild,
      });
    }
    const childValue = value<Child>(maybeSignalChild);
    setChild(parentNode, childValue, index);
  });

  if (signalChildren.length) {
    signalChildren.forEach(({ index, signalChild }) => {
      const signalChildUpdator = effect(() => {
        const childValue = signalChild.value;
        if (!phase.currentIs("run")) return;
        setChild(parentNode, childValue, index);
      });
      parentNode.effects.push(signalChildUpdator);
    });
  }
};

const getNodesEventsAndAttributes = (
  props: Props,
  tagName: string,
): {
  children: Children;
  eventProps: EventProps;
  attributeProps: AttributeProps;
} => {
  let children: Children = undefined;
  const eventProps: EventProps = {};
  const attributeProps: AttributeProps = {};

  Object.entries(props).forEach(([propKey, propValue]) => {
    if (propKey === "children") {
      if (validChildrenProp(propValue)) children = propValue as Children;
      else
        throw new Error(
          `Invalid children prop for node with tagName: ${tagName}\n\n ${JSON.stringify(
            propValue,
          )}`,
        );
    } else if (attributeIsEvent(propKey, propValue)) {
      (eventProps as Record<string, DomEventValue>)[propKey] =
        propValue as DomEventValue;
    } else {
      attributeProps[propKey as AttributeKey] = propValue as string;
    }
  });

  return { children, eventProps, attributeProps };
};

const getMayaNodeGetter = (
  tagName: HTML5TagName,
  propsOrChildren?: PropsOrChildren,
  namespaceURI?: string,
): MayaNodeGetter => {
  const mayaNodeGetter: MayaNodeGetter = () => {
    const nodeID = idGen.getNewId();

    const mayaNode = (
      phase.currentIs("mount")
        ? document.querySelector(`[data-elem-id="${nodeID}"]`)
        : createMayaNodeForTag(tagName, namespaceURI)
    ) as MayaNode;
    mayaNode.nodeID = nodeID;
    mayaNode.effects = [];
    mayaNode.unmountListener = () => {
      mayaNode.effects.forEach((eff) => eff.dispose());
    };
    const props: Props = validChildrenProp(propsOrChildren)
      ? { children: propsOrChildren as Children }
      : (propsOrChildren as Props);

    if (!phase.currentIs("run")) {
      /**
       * The attribute "data-elem-id" is only required for mounting. I.e. when
       * the generated static site is loaded, the script need to find the html nodes
       * using query selector and hold on to them in the memory for reactivity.
       *
       * So this attribute "data-elem-id" is only required during 'build' and
       * 'mount' phases, not in the 'run' phase.
       */
      props["data-elem-id"] = mayaNode.nodeID.toString();
    }

    const allProps = getNodesEventsAndAttributes(props, mayaNode.tagName);
    handleEventProps(mayaNode, allProps.eventProps);
    handleAttributeProps(mayaNode, allProps.attributeProps);
    handleChildrenProp(mayaNode, allProps.children);

    if (!phase.currentIs("build")) {
      /**
       * Keep removing attribute "data-elem-id" when mounting on
       * that html node is done.
       */
      mayaNode.removeAttribute("data-elem-id");
    }

    return mayaNode;
  };

  mayaNodeGetter.isMayaNodeGetter = true;
  return mayaNodeGetter;
};

export const getMayaElement = <T extends HTML5TagName>(
  html5TagName: T,
): MayaElement<T> =>
  ((propsOrChildren?: PropsOrChildren) =>
    getMayaNodeGetter(html5TagName, propsOrChildren)) as MayaElement<T>;

export const getSvgMayaElement = <T extends SvgTagName>(
  svgTagName: T,
): SvgMayaElement<T> =>
  ((propsOrChildren?: PropsOrChildren) =>
    getMayaNodeGetter(
      svgTagName,
      propsOrChildren,
      SVG_NAMESPACE,
    )) as SvgMayaElement<T>;
