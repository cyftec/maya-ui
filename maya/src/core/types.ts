import {
  type MaybeSignal,
  type NonSignal,
  type Signal,
  type SignalsEffect,
} from "@cyftec/signal";
import type {
  htmlTagNames,
  mathMlTagNames,
  svgTagAliases,
  svgTagNames,
} from "./utils/index.ts";

export type MaybeArray<T> = T | T[];

export type PascalCase<T extends string> =
  T extends `${infer Head}-${infer Tail}`
    ? `${Capitalize<Head>}${PascalCase<Tail>}`
    : Capitalize<T>;

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
export type CustomEventValue = (currentNode: MayaNode) => void;
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
 * Maya Node and Children type-defs
 */
export type HtmlTagName = (typeof htmlTagNames)[number];
export type UnaliasedSvgTagName = (typeof svgTagNames)[number];
export type SvgTagAliasName = keyof typeof svgTagAliases;
export type AliasedSvgTagName = (typeof svgTagAliases)[SvgTagAliasName];
export type SvgTagName = UnaliasedSvgTagName | AliasedSvgTagName;
export type MathMlTagName = (typeof mathMlTagNames)[number];
export type HTML5TagName = HtmlTagName | SvgTagName | MathMlTagName;
export type MayaTagName =
  | PascalCase<HtmlTagName | UnaliasedSvgTagName | MathMlTagName>
  | SvgTagAliasName;
export type MayaNode<H extends Element = HTMLElement> = H & {
  nodeID: number;
  effects: SignalsEffect[];
  unmountListener: CustomEventValue | undefined;
  value?: string; // for HTMLInputElement
};

export type MayaNodeGetter = {
  (): MayaNode;
  isMayaNodeGetter: true;
};
export type RawChild = undefined | string;
export type Child = RawChild | MayaNodeGetter;

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

export type MayaElement<T extends HTML5TagName> = T extends VoidHtmlTagName
  ? (props?: PropsForTag<T>) => MayaNodeGetter
  : {
      (props?: PropsForTag<T>): MayaNodeGetter;
      (children: Children): MayaNodeGetter;
    };

export type SvgMayaElement<T extends SvgTagName> = {
  (props?: SvgPropsForTag<T>): MayaNodeGetter;
  (children: Children): MayaNodeGetter;
};

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

type SvgGlobalAttributeKey =
  | "alignment-baseline"
  | "baseline-shift"
  | "class"
  | "clip"
  | "clip-path"
  | "clip-rule"
  | "color"
  | "color-interpolation"
  | "color-interpolation-filters"
  | "color-rendering"
  | "cursor"
  | "direction"
  | "display"
  | "dominant-baseline"
  | "fill"
  | "fill-opacity"
  | "fill-rule"
  | "filter"
  | "flood-color"
  | "flood-opacity"
  | "font-family"
  | "font-size"
  | "font-size-adjust"
  | "font-stretch"
  | "font-style"
  | "font-variant"
  | "font-weight"
  | "id"
  | "image-rendering"
  | "lang"
  | "letter-spacing"
  | "lighting-color"
  | "marker-end"
  | "marker-mid"
  | "marker-start"
  | "mask"
  | "opacity"
  | "overflow"
  | "paint-order"
  | "pointer-events"
  | "role"
  | "shape-rendering"
  | "stop-color"
  | "stop-opacity"
  | "stroke"
  | "stroke-dasharray"
  | "stroke-dashoffset"
  | "stroke-linecap"
  | "stroke-linejoin"
  | "stroke-miterlimit"
  | "stroke-opacity"
  | "stroke-width"
  | "style"
  | "tabindex"
  | "text-anchor"
  | "text-decoration"
  | "text-rendering"
  | "transform"
  | "transform-origin"
  | "unicode-bidi"
  | "vector-effect"
  | "visibility"
  | "word-spacing"
  | "writing-mode";

type SvgAnimationAttributeKey =
  | "accumulate"
  | "additive"
  | "attributeName"
  | "attributeType"
  | "begin"
  | "by"
  | "calcMode"
  | "dur"
  | "end"
  | "from"
  | "keySplines"
  | "keyTimes"
  | "max"
  | "min"
  | "repeatCount"
  | "repeatDur"
  | "restart"
  | "to"
  | "values";

type SvgFilterPrimitiveAttributeKey =
  | "height"
  | "result"
  | "width"
  | "x"
  | "y";

/** SVG attributes use their serialized, case-sensitive spellings. */
export type SvgAttributesByTag = {
  a: "download" | "href" | "hreflang" | "ping" | "referrerpolicy" | "rel" | "target" | "type";
  animate: SvgAnimationAttributeKey;
  animateMotion: SvgAnimationAttributeKey | "keyPoints" | "origin" | "path" | "rotate";
  animateTransform: SvgAnimationAttributeKey | "type";
  circle: "cx" | "cy" | "pathLength" | "r";
  clipPath: "clipPathUnits";
  defs: never;
  desc: never;
  ellipse: "cx" | "cy" | "pathLength" | "rx" | "ry";
  feBlend: SvgFilterPrimitiveAttributeKey | "in" | "in2" | "mode";
  feColorMatrix: SvgFilterPrimitiveAttributeKey | "in" | "type" | "values";
  feComponentTransfer: SvgFilterPrimitiveAttributeKey | "in";
  feComposite:
    | SvgFilterPrimitiveAttributeKey
    | "in"
    | "in2"
    | "k1"
    | "k2"
    | "k3"
    | "k4"
    | "operator";
  feConvolveMatrix:
    | SvgFilterPrimitiveAttributeKey
    | "bias"
    | "divisor"
    | "edgeMode"
    | "in"
    | "kernelMatrix"
    | "kernelUnitLength"
    | "order"
    | "preserveAlpha"
    | "targetX"
    | "targetY";
  feDiffuseLighting:
    | SvgFilterPrimitiveAttributeKey
    | "diffuseConstant"
    | "in"
    | "kernelUnitLength"
    | "surfaceScale";
  feDisplacementMap:
    | SvgFilterPrimitiveAttributeKey
    | "in"
    | "in2"
    | "scale"
    | "xChannelSelector"
    | "yChannelSelector";
  feDistantLight: "azimuth" | "elevation";
  feDropShadow: SvgFilterPrimitiveAttributeKey | "dx" | "dy" | "stdDeviation";
  feFlood: SvgFilterPrimitiveAttributeKey;
  feFuncA: "amplitude" | "exponent" | "intercept" | "offset" | "slope" | "tableValues" | "type";
  feFuncB: SvgAttributesByTag["feFuncA"];
  feFuncG: SvgAttributesByTag["feFuncA"];
  feFuncR: SvgAttributesByTag["feFuncA"];
  feGaussianBlur: SvgFilterPrimitiveAttributeKey | "edgeMode" | "in" | "stdDeviation";
  feImage: SvgFilterPrimitiveAttributeKey | "crossorigin" | "href" | "preserveAspectRatio";
  feMerge: SvgFilterPrimitiveAttributeKey;
  feMergeNode: "in";
  feMorphology: SvgFilterPrimitiveAttributeKey | "in" | "operator" | "radius";
  feOffset: SvgFilterPrimitiveAttributeKey | "dx" | "dy" | "in";
  fePointLight: "x" | "y" | "z";
  feSpecularLighting:
    | SvgFilterPrimitiveAttributeKey
    | "in"
    | "kernelUnitLength"
    | "specularConstant"
    | "specularExponent"
    | "surfaceScale";
  feSpotLight:
    | "limitingConeAngle"
    | "pointsAtX"
    | "pointsAtY"
    | "pointsAtZ"
    | "specularExponent"
    | "x"
    | "y"
    | "z";
  feTile: SvgFilterPrimitiveAttributeKey | "in";
  feTurbulence:
    | SvgFilterPrimitiveAttributeKey
    | "baseFrequency"
    | "numOctaves"
    | "seed"
    | "stitchTiles"
    | "type";
  filter: "filterUnits" | "height" | "href" | "primitiveUnits" | "width" | "x" | "y";
  foreignObject: "height" | "width" | "x" | "y";
  g: never;
  image:
    | "crossorigin"
    | "decoding"
    | "height"
    | "href"
    | "preserveAspectRatio"
    | "width"
    | "x"
    | "y";
  line: "pathLength" | "x1" | "x2" | "y1" | "y2";
  linearGradient:
    | "gradientTransform"
    | "gradientUnits"
    | "href"
    | "spreadMethod"
    | "x1"
    | "x2"
    | "y1"
    | "y2";
  marker:
    | "markerHeight"
    | "markerUnits"
    | "markerWidth"
    | "orient"
    | "preserveAspectRatio"
    | "refX"
    | "refY"
    | "viewBox";
  mask: "height" | "maskContentUnits" | "maskUnits" | "width" | "x" | "y";
  metadata: never;
  mpath: "href";
  path: "d" | "pathLength";
  pattern:
    | "height"
    | "href"
    | "patternContentUnits"
    | "patternTransform"
    | "patternUnits"
    | "preserveAspectRatio"
    | "viewBox"
    | "width"
    | "x"
    | "y";
  polygon: "pathLength" | "points";
  polyline: "pathLength" | "points";
  radialGradient:
    | "cx"
    | "cy"
    | "fr"
    | "fx"
    | "fy"
    | "gradientTransform"
    | "gradientUnits"
    | "href"
    | "r"
    | "spreadMethod";
  rect: "height" | "pathLength" | "rx" | "ry" | "width" | "x" | "y";
  script: "crossorigin" | "href" | "type";
  set: SvgAnimationAttributeKey;
  stop: "offset";
  style: "media" | "title" | "type";
  svg:
    | "baseProfile"
    | "height"
    | "preserveAspectRatio"
    | "version"
    | "viewBox"
    | "width"
    | "x"
    | "xmlns"
    | "xmlns:xlink"
    | "y"
    | "zoomAndPan";
  switch: never;
  symbol: "height" | "preserveAspectRatio" | "refX" | "refY" | "viewBox" | "width" | "x" | "y";
  text: "dx" | "dy" | "lengthAdjust" | "rotate" | "textLength" | "x" | "y";
  textPath: "href" | "lengthAdjust" | "method" | "side" | "spacing" | "startOffset" | "textLength";
  title: never;
  tspan: "dx" | "dy" | "lengthAdjust" | "rotate" | "textLength" | "x" | "y";
  use: "height" | "href" | "width" | "x" | "y";
  view: "preserveAspectRatio" | "viewBox" | "viewTarget" | "zoomAndPan";
};

type SvgSpecificAttributeKey<T extends SvgTagName> =
  T extends keyof SvgAttributesByTag ? SvgAttributesByTag[T] : never;

export type AriaAttributeKey =
  | "aria-activedescendant"
  | "aria-atomic"
  | "aria-autocomplete"
  | "aria-braillelabel"
  | "aria-brailleroledescription"
  | "aria-busy"
  | "aria-checked"
  | "aria-colcount"
  | "aria-colindex"
  | "aria-colindextext"
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
  | "aria-valuetext";

type MathMlGlobalAttributeKey =
  | "arg"
  | "autofocus"
  | "class"
  | "dir"
  | "displaystyle"
  | "id"
  | "intent"
  | "mathbackground"
  | "mathcolor"
  | "mathsize"
  | "nonce"
  | "role"
  | "scriptlevel"
  | "style"
  | "tabindex";
export type MathMlAttributesByTag = {
  math: "display";
  annotation: "encoding";
  "annotation-xml": "encoding";
  maction: "actiontype" | "selection";
  mfrac: "linethickness";
  mi: "mathvariant";
  mo:
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
  mspace: "depth" | "height" | "width";
  mtd: "columnspan" | "rowspan";
  mover: "accent";
  munder: "accentunder";
  munderover: "accent" | "accentunder";
};
type MathMlSpecificAttributeKey<T extends MathMlTagName> =
  T extends keyof MathMlAttributesByTag ? MathMlAttributesByTag[T] : never;

export type AttributeKeyForTag<T extends HTML5TagName> =
  | `data-${string}`
  | (T extends HtmlTagName
      ? GlobalAttributeKey | TagSpecificAttributeKey<T>
      : T extends UnaliasedSvgTagName
        ? SvgGlobalAttributeKey | SvgSpecificAttributeKey<T>
        : T extends MathMlTagName
          ? MathMlGlobalAttributeKey | MathMlSpecificAttributeKey<T>
          : never);

type SvgAttributeKeyForTag<T extends SvgTagName> =
  | `data-${string}`
  | SvgGlobalAttributeKey
  | SvgSpecificAttributeKey<T>;

export type AttributeKey =
  | `data-${string}`
  | GlobalAttributeKey
  | HtmlAttributesByTag[keyof HtmlAttributesByTag]
  | SvgGlobalAttributeKey
  | SvgAttributesByTag[keyof SvgAttributesByTag]
  | MathMlGlobalAttributeKey
  | MathMlAttributesByTag[keyof MathMlAttributesByTag]
  | AriaAttributeKey;

type BooleanAttributeValue = boolean | undefined;
type StringAttributeValue = string | undefined;
type StringWithSuggestions<Values extends string> = Values | (string & {});

type BooleanAttributeKey =
  | "allowfullscreen"
  | "async"
  | "autofocus"
  | "autoplay"
  | "checked"
  | "controls"
  | "default"
  | "defer"
  | "disabled"
  | "formnovalidate"
  | "inert"
  | "ismap"
  | "itemscope"
  | "loop"
  | "multiple"
  | "muted"
  | "nomodule"
  | "novalidate"
  | "open"
  | "playsinline"
  | "readonly"
  | "required"
  | "reversed"
  | "selected";

type InputType =
  | "button"
  | "checkbox"
  | "color"
  | "date"
  | "datetime-local"
  | "email"
  | "file"
  | "hidden"
  | "image"
  | "month"
  | "number"
  | "password"
  | "radio"
  | "range"
  | "reset"
  | "search"
  | "submit"
  | "tel"
  | "text"
  | "time"
  | "url"
  | "week";
type ButtonType = "button" | "reset" | "submit";
type ScriptType =
  | "text/javascript"
  | "module"
  | "importmap"
  | "speculationrules";
type CrossOrigin = "anonymous" | "use-credentials";
type Decoding = "async" | "sync" | "auto";
type Direction = "ltr" | "rtl" | "auto";
type Loading = "eager" | "lazy";
type Preload = "none" | "metadata" | "auto";
type ReferrerPolicy =
  | ""
  | "no-referrer"
  | "no-referrer-when-downgrade"
  | "origin"
  | "origin-when-cross-origin"
  | "same-origin"
  | "strict-origin"
  | "strict-origin-when-cross-origin"
  | "unsafe-url";
type FormMethod = "get" | "post" | "dialog";
type FormEnctype =
  | "application/x-www-form-urlencoded"
  | "multipart/form-data"
  | "text/plain";
type ImageShape = "circle" | "default" | "poly" | "rect";
type TableScope = "col" | "colgroup" | "row" | "rowgroup";
type TrackKind =
  | "captions"
  | "chapters"
  | "descriptions"
  | "metadata"
  | "subtitles";
type TextareaWrap = "hard" | "soft";
type MathDisplay = "block" | "inline";
type MathMlBoolean = "true" | "false" | undefined;
type MathMlBooleanAttributeKey =
  | "accent"
  | "accentunder"
  | "displaystyle"
  | "fence"
  | "largeop"
  | "movablelimits"
  | "separator"
  | "stretchy"
  | "symmetric";
type LinkRelation =
  | "alternate"
  | "canonical"
  | "dns-prefetch"
  | "expect"
  | "icon"
  | "manifest"
  | "modulepreload"
  | "next"
  | "pingback"
  | "preconnect"
  | "prefetch"
  | "preload"
  | "prev"
  | "privacy-policy"
  | "search"
  | "stylesheet"
  | "terms-of-service";
type AnchorRelation =
  | "alternate"
  | "author"
  | "bookmark"
  | "external"
  | "help"
  | "license"
  | "me"
  | "next"
  | "nofollow"
  | "noopener"
  | "noreferrer"
  | "opener"
  | "prev"
  | "tag";
/*
 * `rel` is deliberately strict and tag-specific. In particular,
 * `stylesheet` is a link relation and is not valid on an anchor or area.
 */
type LegacyLinkRelationSuggestions = StringWithSuggestions<
  | "alternate"
  | "author"
  | "bookmark"
  | "canonical"
  | "external"
  | "help"
  | "icon"
  | "license"
  | "manifest"
  | "me"
  | "modulepreload"
  | "next"
  | "nofollow"
  | "noopener"
  | "noreferrer"
  | "opener"
  | "pingback"
  | "preconnect"
  | "prefetch"
  | "preload"
  | "prev"
  | "privacy-policy"
  | "search"
  | "stylesheet"
  | "tag"
  | "terms-of-service"
>;
type Target = StringWithSuggestions<"_blank" | "_parent" | "_self" | "_top">;
type AutoComplete = StringWithSuggestions<"on" | "off">;
type EnterKeyHint = StringWithSuggestions<
  "enter" | "done" | "go" | "next" | "previous" | "search" | "send"
>;
type FetchPriority = "high" | "low" | "auto";
type InputMode =
  | "none"
  | "text"
  | "decimal"
  | "numeric"
  | "tel"
  | "search"
  | "email"
  | "url";

/**
 * Values for attributes whose HTML grammar is more specific than a string.
 * Unlisted attributes intentionally fall back to the runtime's string/
 * boolean representation so custom and legacy attributes remain usable.
 */
type AttributeValueByKey<A extends string> = A extends BooleanAttributeKey
  ? BooleanAttributeValue
  : A extends "crossorigin"
    ? CrossOrigin | undefined
    : A extends "decoding"
      ? Decoding | undefined
      : A extends "dir"
        ? Direction | undefined
        : A extends "enctype" | "formenctype"
          ? FormEnctype | undefined
          : A extends "formmethod" | "method"
            ? FormMethod | undefined
            : A extends "loading"
              ? Loading | undefined
              : A extends "preload"
                ? Preload | undefined
                : A extends "referrerpolicy"
                  ? ReferrerPolicy | undefined
                  : A extends "shape"
                    ? ImageShape | undefined
                    : A extends "scope"
                      ? TableScope | undefined
                      : A extends "kind"
                        ? TrackKind | undefined
                        : A extends "wrap"
                          ? TextareaWrap | undefined
                          : A extends "target"
                            ? Target | undefined
                            : A extends "autocomplete"
                              ? AutoComplete | undefined
                              : A extends "enterkeyhint"
                                ? EnterKeyHint | undefined
                                : A extends "fetchpriority"
                                  ? FetchPriority | undefined
                                  : A extends "inputmode"
                                    ? InputMode | undefined
                                    : A extends "rel"
                                      ?
                                          | LegacyLinkRelationSuggestions
                                          | undefined
                                      : StringAttributeValue;

type MathMlAttributeValueForTag<
  T extends MathMlTagName,
  A extends string,
> = A extends MathMlBooleanAttributeKey
  ? MathMlBoolean
  : A extends "display"
    ? MathDisplay | undefined
    : A extends "mathvariant"
      ? T extends "mi"
        ? "normal" | undefined
        : never
      : A extends "form"
        ? T extends "mo"
          ? "infix" | "prefix" | "postfix" | undefined
          : AttributeValueByKey<A>
        : AttributeValueByKey<A>;

export type AttributeValueForTag<
  T extends HTML5TagName,
  A extends string,
> = T extends MathMlTagName
  ? MathMlAttributeValueForTag<T, A>
  : A extends "type"
    ? T extends "input"
      ? InputType | undefined
      : T extends "button"
        ? ButtonType | undefined
        : T extends "script"
          ? ScriptType | undefined
          : StringAttributeValue
    : A extends "rel"
      ? T extends "a" | "area"
        ? AnchorRelation | undefined
        : T extends "link"
          ? LinkRelation | undefined
          : never
      : AttributeValueByKey<A>;

export type AttributePropsForTag<T extends HTML5TagName> = Partial<{
  [A in AttributeKeyForTag<T>]: MaybeSignal<AttributeValueForTag<T, A>>;
}> &
  Partial<{ [A in AriaAttributeKey]: MaybeSignal<StringAttributeValue> }>;

type SvgAttributePropsForTag<T extends SvgTagName> = Partial<{
  [A in SvgAttributeKeyForTag<T>]: MaybeSignal<AttributeValueByKey<A>>;
}> &
  Partial<{ [A in AriaAttributeKey]: MaybeSignal<StringAttributeValue> }>;

/** DOM event handlers are globally attachable; the map keeps the API tag-centric. */
export type HtmlEventKeysByTag = {
  [T in HTML5TagName]: HtmlEventKey;
};
export type EventKeyForTag<T extends HTML5TagName> =
  | HtmlEventKeysByTag[T]
  | CustomEventKey;
export type EventPropsForTag<T extends HTML5TagName> = Partial<{
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

type ChildrenPropForTag<T extends HTML5TagName> = T extends VoidHtmlTagName
  ? { children?: never }
  : ChildrenProp;

export type PropsForTag<T extends HTML5TagName> = EventPropsForTag<T> &
  AttributePropsForTag<T> &
  ChildrenPropForTag<T>;
export type SvgPropsForTag<T extends SvgTagName> = EventPropsForTag<T> &
  SvgAttributePropsForTag<T> &
  ChildrenProp;
export type PropsOrChildrenForTag<T extends HTML5TagName> =
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
