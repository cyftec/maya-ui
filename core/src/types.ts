import type { MaybeSignal, Signal } from "./imported/index";
import type {
  htmlAttributes,
  htmlEventKeys,
  htmlTagNames,
  customEventKeys,
} from "./utils/constants";

export type MaybeArray<T> = T | T[];
export type SureObject<T> = T extends object ? T : never;

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
export type DomEventValue = HtmlEventValue | CustomEventValue | undefined;

/**
 * Attributes type-defs
 */
export type AttributeKey = `data-${string}` | (typeof htmlAttributes)[number];
export type AttributeValueType = string | undefined;
export type AttributeValue = MaybeSignal<AttributeValueType>;
export type AttributesMap = Partial<{
  [A in AttributeKey]: AttributeValue;
}>;
export type AttributeSignalsMap = Partial<{
  [A in AttributeKey]: Signal<AttributeValueType>;
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

export type CustomNodeText = (
  text: MaybeSignal<string> | TemplateStringsArray,
  ...exprs: (() => string)[]
) => MaybeSignal<TextNode>;

export type MapFn<T> = (item: T, index: number) => Node;
export type MutableMapFn<T extends object> = (
  itemSignal: Signal<T>,
  indexSignal: Signal<number>
) => Node;
export type ForProps<T> = {
  items: MaybeSignal<T[]>;
  itemIdKey?: string;
  map?: MapFn<T>;
  mutableMap?: MutableMapFn<SureObject<T>>;
};
export type CustomNodeFor = <T>(props: ForProps<T>) => Signal<Node[]>;

export type IfProps = {
  condition: MaybeSignal<unknown>;
  then: MaybeSignal<Node>;
  otherwise: MaybeSignal<Node>;
};
export type CustomNodeIf = (props: IfProps) => MaybeSignal<Node>[];

export type SwitchCase = string | number;
export type SwitchProps = {
  subject: MaybeSignal<SwitchCase>;
  defaultCase?: MaybeSignal<Node>;
  cases: {
    [x in SwitchCase]: MaybeSignal<Node>;
  };
};
export type CustomNodeSwitch = (props: SwitchProps) => MaybeSignal<Node>[];

export type CustomNodesMap = {
  Text: CustomNodeText;
  For: CustomNodeFor;
  If: CustomNodeIf;
  Switch: CustomNodeSwitch;
};

export type NodesMap = HtmlNodesMap & CustomNodesMap;

/**
 * Components type-defs
 */
export type SureSignalProps<P> = {
  [K in keyof P]: P[K] extends Children | (((...args: any) => any) | undefined)
    ? P[K]
    : Signal<P[K]>;
};
export type SureSignalsComponentFn<P> = (props: SureSignalProps<P>) => HtmlNode;

export type MaybeSignalProps<P> = {
  [K in keyof P]: P[K] extends
    | Signal<any>
    | Children
    | (((...args: any) => any) | undefined)
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
