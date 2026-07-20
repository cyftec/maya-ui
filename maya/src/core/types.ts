import {
  type MaybeSignal,
  type NonSignal,
  type Signal,
  type SignalsEffect,
} from "@cyftec/signal";
import type { htmlTagNames, mathMlTagNames } from "./utils/index.ts";

export type MaybeArray<T> = T | T[];

/**
 * Event type-defs
 */
export type HtmlEventKey = `on${keyof GlobalEventHandlersEventMap & string}`;
export type CustomEventKey = "onmount" | "onunmount";
export type DomEventKey = HtmlEventKey | CustomEventKey;
type HtmlEventName<K extends HtmlEventKey> = K extends `on${infer Name}`
  ? Name & keyof GlobalEventHandlersEventMap
  : never;
export type HtmlEventValue<K extends HtmlEventKey = HtmlEventKey> = (
  event: GlobalEventHandlersEventMap[HtmlEventName<K>],
) => void;
export type CustomEventValue = (currentElement: MHtmlElement) => void;
export type DomEventValue<K extends DomEventKey = DomEventKey> =
  | (K extends HtmlEventKey
      ? HtmlEventValue<K>
      : K extends CustomEventKey
        ? CustomEventValue
        : never)
  | undefined;

/**
 * Attributes type-defs
 */
export type AttributeValue = string | boolean | undefined;

/**
 * Maya Html Element and Children type-defs
 */
export type HtmlTagName = (typeof htmlTagNames)[number];
export type MathMlTagName = (typeof mathMlTagNames)[number];
export type MayaTagName = HtmlTagName | MathMlTagName;
export type MHtmlElement<H extends Element = HTMLElement> = H & {
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

export type NonSignalChild = NonSignal<Child>;
export type NonSignalChildren = NonSignal<Child[]>;
export type NonSignalChildOrChildren = NonSignalChild | NonSignalChildren;

export type SignalChild = Signal<Child>;
export type SignalChildren = Signal<Child[]>;
export type SignalChildOrChildren = SignalChild | SignalChildren;

export type ChildrenArray = MaybeSignal<Child>[];

export type Children =
  | MaybeArray<MaybeSignal<Child>>
  | MaybeSignal<MaybeArray<Child>>;

/**
 * Props type-defs
 */

export type EventProps = Partial<{ [E in DomEventKey]: DomEventValue<E> }>;
export type AttributeProps = Partial<{
  [A in AttributeKey]: MaybeSignal<AttributeValue>;
}>;
export type SignalAttributeProps = Partial<{
  [A in AttributeKey]: Signal<AttributeValue>;
}>;
export type ChildrenProp = { children?: Children };

export type Props = EventProps & AttributeProps & ChildrenProp;
export type PropsOrChildren = Props | Children;

/**
 * Attribute keys are deliberately modelled as HTML attributes rather than DOM
 * properties. This keeps Maya's `m.Tag({ "accept-charset": "UTF-8" })`
 * syntax intact while still allowing editor completions to depend on the tag.
 */
type GlobalAttributeKey =
  | "accesskey"
  | "anchor"
  | "anchorname"
  | "anchor-align"
  | "anchor-offset"
  | "anchor-side"
  | "autocapitalize"
  | "autocorrect"
  | "autofocus"
  | "class"
  | "contenteditable"
  | "dir"
  | "draggable"
  | "enterkeyhint"
  | "exportparts"
  | "hidden"
  | "id"
  | "inputmode"
  | "inert"
  | "is"
  | "itemid"
  | "itemprop"
  | "itemref"
  | "itemscope"
  | "itemtype"
  | "lang"
  | "nonce"
  | "part"
  | "popover"
  | "role"
  | "slot"
  | "spellcheck"
  | "style"
  | "tabindex"
  | "title"
  | "translate"
  | "virtualkeyboardpolicy"
  | "writingsuggestions";

/** Attribute keys are declared from the element downward, not reverse-mapped. */
export type HtmlAttributesByTag = {
  a:
    | "attributionsrc"
    | "download"
    | "href"
    | "hreflang"
    | "media"
    | "ping"
    | "referrerpolicy"
    | "rel"
    | "shape"
    | "target";
  area:
    | "alt"
    | "attributionsrc"
    | "coords"
    | "download"
    | "href"
    | "media"
    | "ping"
    | "referrerpolicy"
    | "rel"
    | "shape"
    | "target";
  audio:
    | "autoplay"
    | "controls"
    | "crossorigin"
    | "loop"
    | "muted"
    | "preload"
    | "src";
  base: "href" | "target";
  blockquote: "cite";
  body: "background" | "bgcolor";
  button:
    | "command"
    | "commandfor"
    | "disabled"
    | "form"
    | "formaction"
    | "formenctype"
    | "formmethod"
    | "formnovalidate"
    | "formtarget"
    | "name"
    | "popovertarget"
    | "popovertargetaction"
    | "type"
    | "value";
  canvas: "height" | "width";
  col: "span";
  colgroup: "span";
  data: "value";
  del: "cite" | "datetime";
  details: "open";
  dialog: "open";
  embed: "height" | "src" | "type" | "width";
  fieldset: "disabled" | "form" | "name";
  font: "color";
  form:
    | "accept"
    | "accept-charset"
    | "action"
    | "autocomplete"
    | "enctype"
    | "method"
    | "name"
    | "novalidate"
    | "target";
  hr: "color";
  iframe:
    | "allow"
    | "allowfullscreen"
    | "credentialless"
    | "csp"
    | "height"
    | "loading"
    | "name"
    | "referrerpolicy"
    | "sandbox"
    | "src"
    | "srcdoc"
    | "width";
  img:
    | "alt"
    | "attributionsrc"
    | "border"
    | "crossorigin"
    | "decoding"
    | "elementtiming"
    | "fetchpriority"
    | "height"
    | "ismap"
    | "loading"
    | "referrerpolicy"
    | "sizes"
    | "src"
    | "srcset"
    | "usemap"
    | "width";
  input:
    | "accept"
    | "alpha"
    | "alt"
    | "capture"
    | "checked"
    | "colorspace"
    | "dirname"
    | "disabled"
    | "form"
    | "formaction"
    | "formenctype"
    | "formmethod"
    | "formnovalidate"
    | "formtarget"
    | "height"
    | "list"
    | "max"
    | "maxlength"
    | "min"
    | "minlength"
    | "multiple"
    | "name"
    | "pattern"
    | "placeholder"
    | "popovertarget"
    | "popovertargetaction"
    | "readonly"
    | "required"
    | "size"
    | "src"
    | "step"
    | "type"
    | "usemap"
    | "value"
    | "width";
  ins: "cite" | "datetime";
  label: "for";
  link:
    | "as"
    | "blocking"
    | "crossorigin"
    | "fetchpriority"
    | "href"
    | "hreflang"
    | "imagesizes"
    | "imagesrcset"
    | "integrity"
    | "media"
    | "referrerpolicy"
    | "rel"
    | "sizes"
    | "type";
  li: "value";
  map: "name";
  meta: "charset" | "content" | "http-equiv" | "name";
  meter: "high" | "low" | "max" | "min" | "optimum" | "value";
  object:
    | "border"
    | "data"
    | "form"
    | "height"
    | "name"
    | "type"
    | "usemap"
    | "width";
  ol: "reversed" | "start" | "type";
  optgroup: "disabled" | "label";
  option: "disabled" | "label" | "selected" | "value";
  output: "for" | "form" | "name";
  param: "name" | "value";
  progress: "max" | "value";
  q: "cite";
  script:
    | "async"
    | "attributionsrc"
    | "blocking"
    | "charset"
    | "crossorigin"
    | "defer"
    | "fetchpriority"
    | "integrity"
    | "nomodule"
    | "referrerpolicy"
    | "src"
    | "type";
  select:
    | "autocomplete"
    | "disabled"
    | "form"
    | "multiple"
    | "name"
    | "required"
    | "size";
  source: "media" | "sizes" | "src" | "srcset" | "type";
  style: "media" | "type";
  table: "background" | "bgcolor" | "border";
  td: "background" | "bgcolor" | "colspan" | "headers" | "rowspan";
  textarea:
    | "autocomplete"
    | "cols"
    | "dirname"
    | "disabled"
    | "form"
    | "maxlength"
    | "minlength"
    | "name"
    | "placeholder"
    | "readonly"
    | "required"
    | "rows"
    | "wrap";
  th: "background" | "bgcolor" | "colspan" | "headers" | "rowspan" | "scope";
  time: "datetime";
  track: "default" | "kind" | "label" | "src" | "srclang";
  slot: "name";
  video:
    | "autoplay"
    | "controls"
    | "crossorigin"
    | "disableremoteplayback"
    | "height"
    | "loop"
    | "muted"
    | "playsinline"
    | "poster"
    | "preload"
    | "src"
    | "width";
};

type TagSpecificAttributeKey<T extends HtmlTagName> =
  T extends keyof HtmlAttributesByTag ? HtmlAttributesByTag[T] : never;

export type AriaAttributeKey =
  | "aria-activedescendant"
  | "aria-atomic"
  | "aria-autocomplete"
  | "aria-busy"
  | "aria-checked"
  | "aria-colcount"
  | "aria-colindex"
  | "aria-colspan"
  | "aria-controls"
  | "aria-current"
  | "aria-describedby"
  | "aria-description"
  | "aria-details"
  | "aria-disabled"
  | "aria-errormessage"
  | "aria-expanded"
  | "aria-flowto"
  | "aria-haspopup"
  | "aria-hidden"
  | "aria-invalid"
  | "aria-keyshortcuts"
  | "aria-label"
  | "aria-labelledby"
  | "aria-level"
  | "aria-live"
  | "aria-modal"
  | "aria-multiline"
  | "aria-multiselectable"
  | "aria-orientation"
  | "aria-owns"
  | "aria-placeholder"
  | "aria-posinset"
  | "aria-pressed"
  | "aria-readonly"
  | "aria-relevant"
  | "aria-required"
  | "aria-roledescription"
  | "aria-rowcount"
  | "aria-rowindex"
  | "aria-rowindextext"
  | "aria-rowspan"
  | "aria-selected"
  | "aria-setsize"
  | "aria-sort"
  | "aria-valuemax"
  | "aria-valuemin"
  | "aria-valuenow"
  | "aria-valuetext"
  | `aria-${string}`;

type MathMlGlobalAttributeKey =
  | "class"
  | "dir"
  | "displaystyle"
  | "href"
  | "id"
  | "intent"
  | "mathbackground"
  | "mathcolor"
  | "mathsize"
  | "mathvariant"
  | "nonce"
  | "scriptlevel"
  | "style";
export type MathMlAttributesByTag = {
  math: "display";
  annotation: "encoding";
  "annotation-xml": "encoding";
  maction: "actiontype" | "selection";
  menclose: "notation";
  mfenced: "close" | "open" | "separators";
  mfrac: "bevel" | "denomalign" | "linethickness" | "numalign";
  mo:
    | "accent"
    | "fence"
    | "form"
    | "largeop"
    | "lspace"
    | "maxsize"
    | "minsize"
    | "movablelimits"
    | "rspace"
    | "separator"
    | "stretchy"
    | "symmetric";
  mpadded: "depth" | "height" | "lspace" | "voffset" | "width";
  ms: "lquote" | "rquote";
  mspace: "depth" | "height" | "width";
  mstyle:
    | "decimalpoint"
    | "infixlinebreakstyle"
    | "scriptminsize"
    | "scriptsizemultiplier";
  mtable:
    | "align"
    | "columnalign"
    | "columnlines"
    | "columnspacing"
    | "columnwidth"
    | "equalcolumns"
    | "equalrows"
    | "frame"
    | "framespacing"
    | "rowalign"
    | "rowlines"
    | "rowspacing"
    | "side"
    | "width";
  mtd: "columnalign" | "columnspan" | "rowalign" | "rowspan";
  mtr: "columnalign" | "rowalign";
  mover: "accent" | "align";
  munder: "accentunder" | "align";
  munderover: "accent" | "accentunder" | "align";
};
type MathMlSpecificAttributeKey<T extends MathMlTagName> =
  T extends keyof MathMlAttributesByTag ? MathMlAttributesByTag[T] : never;

export type AttributeKeyForTag<T extends MayaTagName> = T extends HtmlTagName
  ? `data-${string}` | GlobalAttributeKey | TagSpecificAttributeKey<T>
  : T extends MathMlTagName
    ?
        | `data-${string}`
        | MathMlGlobalAttributeKey
        | MathMlSpecificAttributeKey<T>
    : never;

export type AttributeKey =
  | `data-${string}`
  | GlobalAttributeKey
  | HtmlAttributesByTag[keyof HtmlAttributesByTag]
  | MathMlGlobalAttributeKey
  | MathMlAttributesByTag[keyof MathMlAttributesByTag]
  | AriaAttributeKey;

export type AttributePropsForTag<T extends MayaTagName> = Partial<{
  [A in AttributeKeyForTag<T>]: MaybeSignal<AttributeValue>;
}> &
  Partial<{ [A in AriaAttributeKey]: MaybeSignal<string | undefined> }>;

/** DOM event handlers are globally attachable; the map keeps the API tag-centric. */
export type HtmlEventKeysByTag = {
  [T in MayaTagName]: HtmlEventKey;
};
export type EventKeyForTag<T extends MayaTagName> =
  | HtmlEventKeysByTag[T]
  | CustomEventKey;
export type EventPropsForTag<T extends MayaTagName> = Partial<{
  [E in EventKeyForTag<T>]: DomEventValue<E>;
}>;

/** HTML void elements cannot contain children. */
export type VoidHtmlTagName =
  | "area"
  | "base"
  | "basefont"
  | "br"
  | "col"
  | "embed"
  | "frame"
  | "hr"
  | "img"
  | "input"
  | "link"
  | "meta"
  | "param"
  | "source"
  | "track"
  | "wbr";

type ChildrenPropForTag<T extends MayaTagName> = T extends VoidHtmlTagName
  ? { children?: never }
  : ChildrenProp;

export type PropsForTag<T extends MayaTagName> = EventPropsForTag<T> &
  AttributePropsForTag<T> &
  ChildrenPropForTag<T>;
export type PropsOrChildrenForTag<T extends MayaTagName> =
  T extends VoidHtmlTagName ? PropsForTag<T> : PropsForTag<T> | Children;

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
