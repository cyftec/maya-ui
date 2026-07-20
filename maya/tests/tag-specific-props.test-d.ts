import { m } from "../src/core";

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
