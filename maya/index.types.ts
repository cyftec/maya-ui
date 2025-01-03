import type {
  customEventKeys,
  htmlAttributes,
  htmlEventKeys,
  htmlTagNames,
} from "./utils/index.ts";
import {
  type DerivedSignal,
  type MaybeSignal,
  type Signal,
} from "@cyftech/signal";

export type MaybeArray<T> = T | T[];
export type Object<T> = T extends object ? T : never;

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
export type AttributeValueType = string | boolean | undefined;
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
export type HtmlNode<H extends HTMLElement = HTMLElement> = H & {
  nodeId: number;
  unmountListener: UnmountListener;
  value?: string; // for HTMLInputElement
};
export type Child = string | HtmlNode;
export type ChildSignal = Signal<Child>;
export type ChildrenSignal = Signal<MaybeArray<Child>>;
export type Children = MaybeArray<MaybeSignal<Child>>;
export type ChildrenProp = ChildrenSignal | Children;
export type ChildrenPropMap = { children?: ChildrenProp };
export type HtmlNodeProps = EventsMap & AttributesMap & ChildrenPropMap;
export type Props = ChildrenProp | HtmlNodeProps;

export type HtmlNodesMap = {
  [key in NodeTagName]: (props: Props) => HtmlNode;
};

export type MapFn<T> = (item: T, index: number) => Child;
export type MutableMapFn<T extends object> = (
  itemSignal: Signal<T>,
  indexSignal: Signal<number>
) => Child;
export type ForProps<T> = {
  items: MaybeSignal<T[]>;
  itemIdKey?: string;
  map?: MapFn<T>;
  mutableMap?: MutableMapFn<Object<T>>;
  n?: number;
  nthChild?: () => Child;
};
export type CustomNodeFor = <T>(props: ForProps<T>) => DerivedSignal<Child[]>;

export type IfProps = {
  condition: MaybeSignal<any>;
  whenTruthy?: () => Child;
  whenFalsy?: () => Child;
};
export type CustomNodeIf = (props: IfProps) => DerivedSignal<Child>;

export type SwitchProps = {
  subject: MaybeSignal<string>;
  defaultCase?: () => Child;
  cases: {
    [x in string]: () => Child;
  };
};
export type CustomNodeSwitch = (props: SwitchProps) => DerivedSignal<Child>;

export type CustomNodesMap = {
  For: CustomNodeFor;
  If: CustomNodeIf;
  Switch: CustomNodeSwitch;
};

export type NodesMap = HtmlNodesMap & CustomNodesMap;

/**
 * Components type-defs
 */

export type ComponentProps<P> = {
  [K in keyof P]: P[K] extends
    | Signal<any>
    | (((...args: any) => any) | undefined)
    ? P[K]
    : P[K] extends string | string[] | undefined
    ? MaybeSignal<P[K]>
    : P[K] extends ChildrenProp
    ? P[K]
    : MaybeSignal<P[K]>;
};
export type Component<P> = (props: ComponentProps<P>) => HtmlNode;

/**
 * ID generator method
 */
export type IDGen = {
  getNewId: () => number;
  resetIdCounter: () => number;
};
