import type { MaybeSignal, Signal } from "./imported/index";
import type {
  htmlAttributes,
  htmlEventKeys,
  htmlTagNames,
  customEventKeys,
} from "./utils/constants";

export type MaybeArray<T> = T | T[];

/**
 * Event type-defs
 */
export type EventsMap = Partial<{
  [E in DomEventKey]: DomEventValue;
}>;
export type HtmlEventKey = (typeof htmlEventKeys)[number];
export type CustomEventKey = (typeof customEventKeys)[number];
export type DomEventKey = HtmlEventKey | CustomEventKey;
export type HtmlEventValue = (event: Event) => void;
export type CustomEventValue = () => void;
export type UnmountListener = CustomEventValue | undefined;
export type DomEventValue = HtmlEventValue | CustomEventValue;

/**
 * Attributes type-defs
 */
export type AttributeKey = `data-${string}` | (typeof htmlAttributes)[number];
export type AttributeValue = MaybeSignal<string>;
export type AttributesMap = Partial<{
  [A in AttributeKey]: AttributeValue;
}>;
export type AttributeSignalsMap = Partial<{
  [A in AttributeKey]: Signal<string>;
}>;

/**
 * Nodes type-defs
 */
export type HtmlTagName = (typeof htmlTagNames)[number];
export type NodeTagName = Capitalize<HtmlTagName>;
export type HtmlNode = HTMLElement & {
  nodeId: number;
  unmountListener: UnmountListener;
  value?: string; // for HTMLInputElement
};
export type TextNode = Text & {
  nodeId: 0; // '0' should be assigned to all text nodes
  unmountListener: UnmountListener;
};
export type Node = TextNode | HtmlNode;
export type MaybeChildSignal = MaybeSignal<Node>;
export type ChildSignal = Signal<Node>;
export type Children = Signal<MaybeArray<Node>> | MaybeArray<MaybeSignal<Node>>;
export type ChildrenProp = { children?: Children };
export type HtmlNodeProps = EventsMap & AttributesMap & ChildrenProp;

export type HtmlNodesMap = {
  [key in NodeTagName]: (props: HtmlNodeProps) => HtmlNode;
};

export type TextCustomNode = (
  text: MaybeSignal<string>
) => MaybeSignal<TextNode>;
export type ForMapFn<T> = (
  itemSignal: Signal<T>,
  indexSignal: Signal<number>
) => Node;
export type ForProps<T> = {
  subject: Signal<T[]>;
  map: ForMapFn<T>;
};
export type ForCustomNode = <T>(props: ForProps<T>) => Signal<Node[]>;

export type CustomNodesMap = {
  Text: TextCustomNode;
  For: ForCustomNode;
};

export type NodesMap = HtmlNodesMap & CustomNodesMap;

/**
 * Components type-defs
 */
export type SureSignalProps<P> = {
  [K in keyof P]: P[K] extends (arg: any) => void ? P[K] : Signal<P[K]>;
};
export type SureSignalsComponentFn<P> = (props: SureSignalProps<P>) => HtmlNode;

export type MaybeSignalProps<P> = {
  [K in keyof P]: P[K] extends Signal<any> | ((arg: any) => void)
    ? P[K]
    : MaybeSignal<P[K]>;
};
export type MaybeSignalsComponentFn<P> = (
  props: MaybeSignalProps<P>
) => HtmlNode;

/**
 * ID generator method
 */
export type IDGen = {
  getNewId: () => number;
  resetIdCounter: () => number;
};
