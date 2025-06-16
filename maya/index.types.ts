import {
  type MaybeSignal,
  type MaybeSignalValue,
  type NonSignal,
  type Signal,
  type SignalsEffect,
} from "@cyftech/signal";
import type {
  customEventKeys,
  htmlAttributes,
  htmlEventKeys,
  htmlTagNames,
} from "./utils/index.ts";

export type MaybeArray<T> = T | T[];
export type Object<T> = T extends object ? T : never;

/**
 * Event type-defs
 */
export type HtmlEventKey = (typeof htmlEventKeys)[number];
export type CustomEventKey = (typeof customEventKeys)[number];
export type DomEventKey = HtmlEventKey | CustomEventKey;
export type HtmlEventValue = (event: Event) => void;
export type CustomEventValue = (currentElement: MHtmlElement) => void;
export type DomEventValue = HtmlEventValue | CustomEventValue | undefined;

/**
 * Attributes type-defs
 */
export type AttributeKey = `data-${string}` | (typeof htmlAttributes)[number];
export type AttributeValue = string | boolean | undefined;

/**
 * Maya Html Element and Children type-defs
 */
export type HtmlTagName = (typeof htmlTagNames)[number];
export type MHtmlElement<H extends HTMLElement = HTMLElement> = H & {
  elementId: number;
  effects: SignalsEffect[];
  unmountListener: CustomEventValue | undefined;
  value?: string; // for HTMLInputElement
};
export type MHtmlElementGetter = {
  (): MHtmlElement;
  isElementGetter: true;
};
export type RawChild = undefined | string;
export type Child = RawChild | MHtmlElementGetter;
export type ChildSignal = Signal<Child>;
export type ChildrenSignal = Signal<MaybeArray<Child>>;
export type ChildrenPlain =
  | NonSignal<RawChild>
  | NonSignal<RawChild[]>
  | MaybeArray<MaybeSignal<Child>>;
export type Children = ChildrenSignal | ChildrenPlain;

/**
 * Props type-defs
 */

export type EventProps = Partial<{
  [E in DomEventKey]: DomEventValue;
}>;
export type AttributeProps = Partial<{
  [A in AttributeKey]: MaybeSignalValue<AttributeValue>;
}>;
export type SignalAttributeProps = Partial<{
  [A in AttributeKey]: Signal<AttributeValue>;
}>;
export type ChildrenProp = { children?: Children };

export type Props = EventProps & AttributeProps & ChildrenProp;
export type PropsOrChildren = Props | Children;

/**
 * Given that the source code for the app is ready, for generating
 * and getting the MPA to work (either in local or production envireonment)
 * Maya library works in 3 phases, particularly in below mentioned order,
 * 1.BUILD ----> 2.MOUNT ----> 3.RUN
 *
 * 1. BUILD phase
 * In this phase a builder script should generate the MPA with all its
 * html, js, css and asset files in appropriate routing directory structure.
 * Each html elements must have a unique id so that during 'mount' phase,
 * each js component should latch to its equivalent html node.
 *
 * 2. MOUNT phase
 * In this phase, when all the static files and script is loaded, there must be a
 * mount-and-run method in the page script which should run immediately after
 * script load. This method should hook each js component to its equivalent
 * DOM node and retain the nodes access (in memory).
 *
 * 3. RUN phase
 * During this phase, the script simply updates deletes attributes
 * of in-memory DOM nodes or add new attributes or nodes to the DOM.
 */
export type MayaAppPhase = "build" | "mount" | "run" | undefined;
