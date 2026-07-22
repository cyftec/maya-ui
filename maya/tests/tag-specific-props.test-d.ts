import { m } from "../src/core";
import { signal } from "../src/re-exports/signal";

// Global, data-*, events, and valid element-specific attributes remain usable.
m.Div({ class: "panel", "data-state": "open", onclick: () => {} });
m.Input({ accept: "image/*", checked: true, maxlength: "20" });
m.Img({ alt: "Maya logo", src: "/logo.svg", width: "120" });
m.Form({ action: "/submit", "accept-charset": "UTF-8", method: "post" });
m.Video({ controls: true, poster: "/poster.jpg", playsinline: true });
m.Table({ bgcolor: "white" });
m.Meta({ charset: "UTF-8", name: "viewport", content: "width=device-width" });
m.Div({ onpointerdown: (event) => event.pointerId });
m.Search({ role: "search", "aria-label": "Site search", inert: true });
m.Slot({ name: "actions" });
m.Math({ display: "block", children: m.Mfrac([m.Mn("1"), m.Mn("2")]) });
m.Mo({ stretchy: "true", "aria-label": "sum" });
m.Span("Text child is valid on non-void elements");
m.Svg({ viewBox: "0 0 100 100", width: "100", height: "100" });
m.Circle({ cx: "50", cy: "50", r: "40", fill: "red" });
m.Path({ d: "M0 0 L10 10", "stroke-width": "2" });
m.LinearGradient({ id: "fade", x1: "0%", x2: "100%" });
m.FeGaussianBlur({ in: "SourceGraphic", stdDeviation: "4" });
m.SvgSwitch(m.Circle({ r: "5" }));
m.SvgA({ href: "#target", fill: "currentColor" });
m.SvgScript({ href: "/diagram.js", type: "application/ecmascript" });
m.SvgStyle("circle { fill: red; }");
m.SvgTitle("Accessible chart title");
m.Div({
  "aria-braillelabel": "Chart",
  "aria-brailleroledescription": "diagram",
  "aria-colindextext": "Column A",
});
m.Math({ role: "math", intent: "binomial-coefficient", arg: "n" });
m.Mi({ mathvariant: "normal" });

// Attribute values provide completions for boolean and enumerated HTML/MathML attributes
m.Input({ type: "email", required: true });
m.Link({ rel: "stylesheet", href: "/styles.css" });
m.A({ rel: "nofollow", target: "_blank", href: "/docs" });
m.Form({ method: "post", enctype: "multipart/form-data" });
m.Math({ display: "block" });
// signals retain the same value hints.
m.Input({ type: signal("search"), checked: signal(false) });
m.Link({ rel: signal("stylesheet"), href: "/styles.css" });

// @ts-expect-error stylesheet is a link relation, not an anchor relation
m.A({ rel: "stylesheet", href: "/styles.css" });
// @ts-expect-error input type is an enumerated attribute
m.Input({ type: "phone" });
// @ts-expect-error button type has a smaller grammar than input type
m.Button({ type: "email" });
// @ts-expect-error boolean attributes do not accept arbitrary strings
m.Input({ required: "yes" });
// @ts-expect-error MathML display is block or inline
m.Math({ display: "fullscreen" });

// Element-specific completion must reject attributes that the target element
// does not support, while preserving valid attributes on their own elements.
// @ts-expect-error accept is only valid on form and input
m.Div({ accept: "image/*" });
// @ts-expect-error alt is not valid on a button
m.Button({ alt: "Save" });
// @ts-expect-error action is only valid on form
m.Img({ action: "/submit" });
// @ts-expect-error poster is only valid on video
m.Audio({ poster: "/poster.jpg" });
// @ts-expect-error readonly is only valid on input and textarea
m.Select({ readonly: true });
// @ts-expect-error void elements cannot receive a children prop
m.Meta({ children: "Document metadata" });
// @ts-expect-error void elements cannot receive direct children
m.Meta("Document metadata");
// @ts-expect-error void elements cannot receive a children prop
m.Img({ alt: "Maya logo", children: "fallback" });
// @ts-expect-error href is not supported by meta
m.Meta({ href: "/document" });
// @ts-expect-error display is only supported by the MathML math root
m.Mrow({ display: "block" });
// @ts-expect-error d is specific to SVG paths
m.Circle({ d: "M0 0" });
// @ts-expect-error cx is not a path attribute
m.Path({ cx: "10" });
// @ts-expect-error viewBox is specific to relevant SVG elements
m.Div({ viewBox: "0 0 100 100" });
// @ts-expect-error the HTML anchor does not accept SVG presentation attributes
m.A({ href: "/docs", fill: "red" });
// @ts-expect-error unknown ARIA attributes are rejected instead of hiding typos
m.Div({ "aria-labl": "Typo" });
// @ts-expect-error menclose is not a MathML Core element
m.Menclose("x");
// @ts-expect-error bevel is a legacy MathML attribute, not MathML Core
m.Mfrac({ bevel: "true" });
// @ts-expect-error lquote is no longer supported by MathML Core
m.Ms({ lquote: "[" });
// @ts-expect-error MathML booleans use the serialized true/false grammar
m.Mo({ stretchy: "yes" });
// @ts-expect-error MathML Core only supports normal for mathvariant
m.Mi({ mathvariant: "bold" });
