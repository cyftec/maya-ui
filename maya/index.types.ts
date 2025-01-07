import {
  type MaybeSignal,
  type MaybeSignalValue,
  type NonSignal,
  type Signal,
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
export type CustomEventValue = () => void;
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
  unmountListener: CustomEventValue | undefined;
  value?: string; // for HTMLInputElement
};
export type MHtmlElementGetter = {
  (): MHtmlElement;
  isElementGetter: true;
};
export type Child = string | MHtmlElementGetter;
export type ChildSignal = Signal<Child>;
export type ChildrenSignal = Signal<MaybeArray<Child>>;
export type ChildrenPlain =
  | NonSignal<string>
  | NonSignal<string[]>
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
