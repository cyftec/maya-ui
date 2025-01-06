import {
  effect,
  valueIsSignal,
  type MaybeSignal,
  type Signal,
} from "@cyftech/signal";
import type {
  AttributeKey,
  SignalAttributeProps,
  AttributeValue,
  AttributeProps,
  Child,
  ChildSignal,
  ChildrenPlain,
  Children,
  ChildrenSignal,
  CustomEventKey,
  CustomEventValue,
  DomEventKey,
  DomEventValue,
  EventProps,
  HtmlEventKey,
  MHtmlElement,
  Props,
  HtmlTagName,
  MHtmlElementGetter,
  ChildrenOrProps,
} from "../../index.types.ts";
import {
  currentPhaseIs,
  customEventKeys,
  eventKeys,
  htmlEventKeys,
  idGen,
  startPhase,
  valueIsArray,
  valueIsChild,
  valueIsPlainChildren,
  valueIsChildren,
  valueIsChildrenSignal,
  valueIsMHtmlElement,
  valueIsSignalChild,
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
        listenerFn(e);
      });
    } else if (attributeIsCustomEvent(eventName, listenerFn)) {
      if (eventName === "onmount" && !currentPhaseIs("build")) {
        const onMount = listenerFn as CustomEventValue;
        setTimeout(() => onMount(), 0);
      }
      if (eventName === "onunmount") {
        startUnmountObserver();
        mHtmlElem.unmountListener = listenerFn as CustomEventValue;
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
  attributePropValue: MaybeSignal<AttributeValue>
): void => {
  const attrValue =
    (valueIsSignal(attributePropValue)
      ? (attributePropValue as Signal<AttributeValue>).value
      : (attributePropValue as AttributeValue)) ?? "";

  if (typeof attrValue === "boolean") {
    if (attrValue) mHtmlElement.setAttribute(attrKey, "");
    else mHtmlElement.removeAttribute(attrKey);
  } else if (attrKey === "value") {
    mHtmlElement.value = attrValue;
  } else {
    mHtmlElement.setAttribute(attrKey, attrValue);
  }
};

const handleAttributeProps = (
  mHtmlElem: MHtmlElement,
  attributeProps: AttributeProps
): void => {
  const signalAttributeProps: SignalAttributeProps = {};

  Object.entries(attributeProps).forEach((attributeProp) => {
    const [attrKey, attrVal] = attributeProp;
    const maybeSignalAttrVal = attrVal as MaybeSignal<AttributeValue>;

    if (valueIsSignal(maybeSignalAttrVal)) {
      signalAttributeProps[attrKey as AttributeKey] =
        maybeSignalAttrVal as Signal<AttributeValue>;
      return;
    }
    setAttribute(mHtmlElem, attrKey, maybeSignalAttrVal);
  });

  effect(() => {
    Object.entries(signalAttributeProps).forEach((signalAttributeProp) => {
      const [attrKey, signalAttrVal] = signalAttributeProp;
      setAttribute(mHtmlElem, attrKey, signalAttrVal as Signal<AttributeValue>);
    });
  });
};

const getElementFromChild = (
  child: MaybeSignal<Child>
): MHtmlElement | Text => {
  if (valueIsSignalChild(child)) {
    const nonSignalChild = (child as ChildSignal).value;
    return getElementFromChild(nonSignalChild);
  }

  if (typeof child === "string") {
    return document.createTextNode(child);
  }

  if (valueIsChild(child)) {
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

const handleChildrenProp = (parentNode: MHtmlElement, children?: Children) => {
  if (!children) return;

  if (valueIsChildrenSignal(children)) {
    effect(() => {
      const childrenSignal = children as ChildrenSignal;
      const childrenSignalValue = childrenSignal.value;
      const childrenList = (
        valueIsArray(childrenSignalValue)
          ? childrenSignalValue
          : [childrenSignalValue]
      ) as Array<Child>;
      childrenList.forEach((child, index) => {
        const prevChildNode = parentNode.childNodes[index];
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
      });

      const newChildrenCount = childrenList.length;
      while (newChildrenCount < parentNode.childNodes.length) {
        const childNode = parentNode.childNodes[newChildrenCount];
        if (childNode) parentNode.removeChild(childNode);
      }
    });
  }

  if (valueIsPlainChildren(children)) {
    const plainChildren = children as ChildrenPlain;
    const signalledChildren: { index: number; childSignal: ChildSignal }[] = [];
    const sureArrayChildren = (
      valueIsArray(children) ? plainChildren : [plainChildren]
    ) as Array<MaybeSignal<Child>>;

    sureArrayChildren.forEach((maybeSignalChild, index) => {
      if (valueIsSignalChild(maybeSignalChild)) {
        signalledChildren.push({
          index,
          childSignal: maybeSignalChild as ChildSignal,
        });
      }
      const childNode = getElementFromChild(maybeSignalChild);
      if (currentPhaseIs("mount")) return;
      parentNode.appendChild(childNode);
    });

    if (signalledChildren.length) {
      signalledChildren.forEach(({ index, childSignal }) => {
        effect(() => {
          if (!childSignal.value) return;
          if (!currentPhaseIs("run")) return;
          const newChildNode = getElementFromChild(childSignal.value);
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
  props: Props,
  tagName: string
): {
  children: Children | undefined;
  eventProps: EventProps;
  attributeProps: AttributeProps;
} => {
  let children: Children | undefined = undefined;
  const eventProps: EventProps = {};
  const attributeProps: AttributeProps = {};

  Object.entries(props).forEach(([propKey, propValue]) => {
    if (propKey === "children") {
      if (valueIsChildren(propValue)) children = propValue as Children;
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

export const getElementGetter =
  (
    tagName: HtmlTagName,
    childrenOrProps: ChildrenOrProps
  ): MHtmlElementGetter =>
  () => {
    const elementId = idGen.getNewId();

    const mHtmlElem = currentPhaseIs("mount")
      ? (document.querySelector(
          `[data-elem-id="${elementId}"]`
        ) as MHtmlElement)
      : (document.createElement(tagName) as MHtmlElement);
    mHtmlElem.elementId = elementId;
    mHtmlElem.unmountListener = undefined;
    const props: Props = valueIsChildren(childrenOrProps)
      ? { children: childrenOrProps as Children }
      : (childrenOrProps as Props);

    if (!currentPhaseIs("run")) {
      /**
       * The attribute "data-elem-id" is only required for mounting. I.e. when
       * the generated static site is loaded, the script need to find the html nodes
       * using query selector and hold on to them in the memory for reactivity.
       *
       * So this attribute "data-elem-id" is only required during 'build' and
       * 'mount' phases, not in the 'run' phase.
       */
      console.log(
        `Current phase is ${currentPhaseIs("build") ? "build" : "mount"}`
      );
      props["data-elem-id"] = mHtmlElem.elementId.toString();
    }

    const { children, eventProps, attributeProps } =
      getNodesEventsAndAttributes(props, mHtmlElem.tagName);
    handleEventProps(mHtmlElem, eventProps);
    handleAttributeProps(mHtmlElem, attributeProps);
    handleChildrenProp(mHtmlElem, children);

    if (!currentPhaseIs("build")) {
      /**
       * Keep removing attribute "data-elem-id" when mounting on
       * that html node is done.
       */
      mHtmlElem.removeAttribute("data-elem-id");
    }

    if (currentPhaseIs("mount") && tagName === "html") {
      /**
       * Mount (Dom Access) phase completes with finally accessing 'html' node,
       * and (app) Run phase starts after that
       */
      startPhase("run");
    }

    return mHtmlElem;
  };
