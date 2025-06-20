import {
  effect,
  value,
  valueIsMaybeSignalObject,
  valueIsNonSignal,
  valueIsSignal,
  type MaybeSignalObject,
  type MaybeSignalValue,
  type NonSignal,
  type Signal,
} from "@cyftech/signal";
import type {
  AttributeKey,
  AttributeProps,
  AttributeValue,
  Child,
  Children,
  CustomEventKey,
  CustomEventValue,
  DomEventKey,
  DomEventValue,
  EventProps,
  HtmlEventKey,
  HtmlEventValue,
  HtmlTagName,
  MHtmlElement,
  MHtmlElementGetter,
  NonSignalChild,
  NonSignalChildren,
  PlainChildren,
  Props,
  PropsOrChildren,
  SignalAttributeProps,
  SignalChild,
  SignalChildOrChildren,
} from "../../index.types.ts";
import {
  customEventKeys,
  decodeHTMLEntities,
  eventKeys,
  htmlEventKeys,
  idGen,
  phase,
  sanitizeAttributeValue,
  validChild,
  validChildren,
  validChildrenProp,
  validNonSignalChild,
  validPlainChildren,
  validSignalChild,
  validSignalChildOrChildren,
  valueIsArray,
  valueIsMHtmlElement,
} from "../../utils/index.ts";
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

const handleEventProps = (
  mHtmlElem: MHtmlElement,
  eventProps: EventProps
): void => {
  Object.entries(eventProps).forEach(([eventName, listenerFn]) => {
    if (attributeIsUndefinedEvent(eventName, listenerFn)) {
      // ignore as eventlistener is undefined
    } else if (attributeIsHtmlEvent(eventName, listenerFn)) {
      const eventKey = eventName.slice(2);
      mHtmlElem.addEventListener(eventKey, (e: Event) => {
        if (eventKey === "keypress") {
          e.preventDefault();
        }
        (listenerFn as HtmlEventValue)(e);
      });
    } else if (attributeIsCustomEvent(eventName, listenerFn)) {
      if (eventName === "onmount" && !phase.currentIs("build")) {
        const onMount = listenerFn as CustomEventValue;
        setTimeout(() => onMount(mHtmlElem), 0);
      }
      if (eventName === "onunmount") {
        startUnmountObserver();
        const topLevelUnmountListener = mHtmlElem.unmountListener;
        mHtmlElem.unmountListener = (currentElement: MHtmlElement) => {
          (listenerFn as CustomEventValue)(currentElement);
          if (typeof topLevelUnmountListener === "function")
            topLevelUnmountListener(currentElement);
        };
      }
    } else {
      console.error(
        `Invalid event key: ${eventName} for element with tagName: ${mHtmlElem.tagName}`
      );
    }
  });
};

const setAttribute = (
  mHtmlElement: MHtmlElement,
  attrKey: string,
  attributePropValue: MaybeSignalValue<AttributeValue>
): void => {
  const unsafeAttrValue = valueIsMaybeSignalObject(attributePropValue)
    ? (attributePropValue as MaybeSignalObject<AttributeValue>).value
    : (attributePropValue as AttributeValue);
  const attrValue = sanitizeAttributeValue(attrKey, unsafeAttrValue);

  if (typeof attrValue === "boolean") {
    if (attrValue) mHtmlElement.setAttribute(attrKey, "");
    else mHtmlElement.removeAttribute(attrKey);
  } else if (attrKey === "value") {
    mHtmlElement.value = attrValue || "";
  } else {
    mHtmlElement.setAttribute(attrKey, attrValue || "");
  }
};

const handleAttributeProps = (
  mHtmlElem: MHtmlElement,
  attributeProps: AttributeProps
): void => {
  const signalAttributeProps: SignalAttributeProps = {};

  Object.entries(attributeProps).forEach((attributeProp) => {
    const [attrKey, attrVal] = attributeProp;
    if (valueIsSignal(attrVal)) {
      signalAttributeProps[attrKey as AttributeKey] =
        attrVal as Signal<AttributeValue>;
    }
    setAttribute(mHtmlElem, attrKey, attrVal);
  });

  const attributesUpdator = effect(() => {
    Object.entries(signalAttributeProps).forEach((signalAttributeProp) => {
      const [attrKey, attrVal] = signalAttributeProp;
      const signalAttrVal = (attrVal as Signal<AttributeValue>).value;
      if (!phase.currentIs("run")) return;
      setAttribute(mHtmlElem, attrKey, signalAttrVal);
    });
  });
  mHtmlElem.effects.push(attributesUpdator);
};

const getElementFromChild = (child: Child): MHtmlElement | Text => {
  if (!child || typeof child === "string") {
    return document.createTextNode(decodeHTMLEntities(child || ""));
  }

  if (validChild(child)) {
    // the valid child is only 'MHtmlElementGetter' now and not
    // 'undefined' or 'string' as that case is handled above already
    const elem = (child as MHtmlElementGetter)();
    if (!valueIsMHtmlElement(elem)) {
      throw new Error(
        `Invalid MHtml element getter child. Type: ${typeof child}`
      );
    }
    return elem as MHtmlElement;
  }

  throw new Error(`Invalid child. Type of child: ${typeof child}`);
};

const setChild = (
  parentNode: MHtmlElement,
  child: Child,
  childPositionIndex: number
) => {
  const prevChildNode = parentNode.childNodes[childPositionIndex];
  const newChildNode = getElementFromChild(child);
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

const handleChildrenProp = (parentNode: MHtmlElement, children?: Children) => {
  if (!children) return;

  if (validSignalChildOrChildren(children)) {
    const signalChildrenUpdator = effect(() => {
      const signalChildOrChildrenValue = (children as SignalChildOrChildren)
        .value;
      const childrenList = valueIsArray(signalChildOrChildrenValue)
        ? (signalChildOrChildrenValue as Child[])
        : [signalChildOrChildrenValue as Child];
      childrenList.forEach((child, index) =>
        setChild(parentNode, child, index)
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
    : valueIsNonSignal(children)
    ? validChild((children as NonSignal<any>).value)
      ? [(children as NonSignal<any>).value as Child]
      : validChildren((children as NonSignal<any>).value)
      ? (children as NonSignalChildren).value
      : []
    : validPlainChildren(children)
    ? (children as PlainChildren).map((ch) =>
        validSignalChild(ch)
          ? (ch as SignalChild)
          : validNonSignalChild(ch)
          ? (ch as NonSignalChild).value
          : (ch as Child)
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
    const childValue = value(maybeSignalChild);
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
  tagName: string
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
            propValue
          )}`
        );
    } else if (attributeIsEvent(propKey, propValue)) {
      eventProps[propKey as DomEventKey] = propValue as DomEventValue;
    } else {
      attributeProps[propKey as AttributeKey] = propValue as string;
    }
  });

  return { children, eventProps, attributeProps };
};

export const createElementGetter = (
  tagName: HtmlTagName,
  propsOrChildren?: PropsOrChildren
): MHtmlElementGetter => {
  const elemGetter: MHtmlElementGetter = () => {
    const elementId = idGen.getNewId();

    const mHtmlElem = (
      phase.currentIs("mount")
        ? document.querySelector(`[data-elem-id="${elementId}"]`)
        : document.createElement(tagName)
    ) as MHtmlElement;
    mHtmlElem.elementId = elementId;
    mHtmlElem.effects = [];
    mHtmlElem.unmountListener = () => {
      mHtmlElem.effects.forEach((eff) => eff.dispose());
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
      props["data-elem-id"] = mHtmlElem.elementId.toString();
    }

    const allProps = getNodesEventsAndAttributes(props, mHtmlElem.tagName);
    handleEventProps(mHtmlElem, allProps.eventProps);
    handleAttributeProps(mHtmlElem, allProps.attributeProps);
    handleChildrenProp(mHtmlElem, allProps.children);

    if (!phase.currentIs("build")) {
      /**
       * Keep removing attribute "data-elem-id" when mounting on
       * that html node is done.
       */
      mHtmlElem.removeAttribute("data-elem-id");
    }

    return mHtmlElem;
  };

  elemGetter.isElementGetter = true;
  return elemGetter;
};
