import type {
  htmlAttributes,
  htmlEventKeys,
  htmlTagNames,
  mayaEventKeys,
} from "./constants.ts";
import type {
  IndexedArraySignal,
  MaybeSignal,
  Signal,
} from "@ckzero/maya-signal";

export type UnmountListener = MayaEventValue | undefined;
export type MayaElement = HTMLElement & {
  mayaId: number;
  unmountListener: UnmountListener;
  value?: any;
};
export type MayaTextElement = Text & {
  mayaId: undefined;
  unmountListener: UnmountListener;
};
export type MayaNode = MayaTextElement | MayaElement;

export type HtmlElementTagName = (typeof htmlTagNames)[number];
export type MayaElementTagName = Capitalize<HtmlElementTagName>;
export type AttributeKey = `data-${string}` | (typeof htmlAttributes)[number];
export type AttributeValue = MaybeSignal<string> | (() => string);
export type HtmlEventKey = (typeof htmlEventKeys)[number];
export type MayaEventKey = (typeof mayaEventKeys)[number];
export type DomEventKey = HtmlEventKey | MayaEventKey;
export type HtmlEventValue = (event: Event) => void;
export type MayaEventValue = () => void;
export type DomEventValue = HtmlEventValue | MayaEventValue;

export type EventsMap = Partial<{
  [E in DomEventKey]: DomEventValue;
}>;
export type AttributesMap = Partial<{
  [A in AttributeKey]: AttributeValue;
}>;
export type AttributeSignalsMap = Partial<{
  [A in AttributeKey]: Signal<string>;
}>;
export type TextChildProp = MaybeSignal<string> | (() => string);
export type NodeChildProp = MaybeSignal<MayaElement> | (() => MayaElement);
export type ChildProp = NodeChildProp | TextChildProp;
export type Child = MayaElement | string;
export type ChildrenSignalProp = Signal<Child[]>;
export type ChildrenProp = {
  type: "innerText" | "children" | "childrenSignal";
  children: TextChildProp | NodeChildProp[] | ChildrenSignalProp;
};
export type MaybeChildSignal = MaybeSignal<Child>;
export type ChildSignal = Signal<Child>;
export type MayaChildrenProp =
  | {
      innerText?: TextChildProp;
    }
  | {
      children?: NodeChildProp[] | ChildrenSignalProp;
    };
export type MayaElementProps = MayaChildrenProp & EventsMap & AttributesMap;

export type MayaElementsMap = {
  [key in MayaElementTagName]: (props: MayaElementProps) => MayaElement;
};

export type SureSignalProps<P> = {
  [K in keyof P]: P[K] extends ((arg: any) => void) | IndexedArraySignal<any>
    ? P[K]
    : Signal<P[K]>;
};
export type SureSignalsComponentFn<P> = (
  props: SureSignalProps<P>
) => MayaElement;

export type MaybeSignalProps<P> = {
  [K in keyof P]: P[K] extends
    | Signal<any>
    | IndexedArraySignal<any>
    | ((arg: any) => void)
    ? P[K]
    : MaybeSignal<P[K]>;
};
export type MaybeSignalsComponentFn<P> = (
  props: MaybeSignalProps<P>
) => MayaElement;
