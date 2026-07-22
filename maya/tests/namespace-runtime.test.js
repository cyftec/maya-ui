import { expect, test } from "bun:test";

const HTML_NAMESPACE = "http://www.w3.org/1999/xhtml";
const SVG_NAMESPACE = "http://www.w3.org/2000/svg";
const MATHML_NAMESPACE = "http://www.w3.org/1998/Math/MathML";

class MutationObserverStub {
  observe() {}
  disconnect() {}
}

const createElementStub = (tagName, namespaceURI) => ({
  tagName: tagName.toUpperCase(),
  namespaceURI,
  childNodes: [],
  attributes: new Map(),
  setAttribute(key, value) {
    this.attributes.set(key, value);
  },
  removeAttribute(key) {
    this.attributes.delete(key);
  },
  addEventListener() {},
  appendChild(node) {
    this.childNodes.push(node);
  },
  replaceChild(node, previousNode) {
    const index = this.childNodes.indexOf(previousNode);
    if (index >= 0) this.childNodes[index] = node;
  },
  removeChild(node) {
    this.childNodes = this.childNodes.filter((child) => child !== node);
  },
});

globalThis.window = {};
globalThis.MutationObserver = MutationObserverStub;
globalThis.document = {
  createElement: (tagName) => createElementStub(tagName, HTML_NAMESPACE),
  createElementNS: (namespaceURI, tagName) =>
    createElementStub(tagName, namespaceURI),
  createTextNode: (textContent) => ({ textContent }),
  querySelector: () => null,
};

const { m } = await import("../src/core/elements/m.ts");
const { htmlTagNames, mathMlTagNames, svgTagNames } = await import(
  "../src/core/utils/constants.ts"
);

test("keeps native tag registries disjoint", () => {
  const registries = [htmlTagNames, svgTagNames, mathMlTagNames];
  registries.forEach((registry, index) => {
    const otherTags = registries.flatMap((otherRegistry, otherIndex) =>
      otherIndex === index ? [] : otherRegistry,
    );
    expect(registry.filter((tagName) => otherTags.includes(tagName))).toEqual(
      [],
    );
  });
});

test("uses the correct namespace for HTML, SVG, and MathML elements", () => {
  expect(m.Div()().namespaceURI).toBe(HTML_NAMESPACE);
  const svg = m.Svg([
    m.G(m.Circle({ cx: "5", cy: "5", r: "5" })),
    m.SvgA("SVG link"),
    m.SvgSwitch(),
    m.ForeignObject(m.Div("HTML content")),
  ])();
  expect(svg.namespaceURI).toBe(SVG_NAMESPACE);
  expect(svg.childNodes[0].namespaceURI).toBe(SVG_NAMESPACE);
  expect(svg.childNodes[0].childNodes[0].namespaceURI).toBe(SVG_NAMESPACE);
  expect(svg.childNodes[1].namespaceURI).toBe(SVG_NAMESPACE);
  expect(svg.childNodes[2].namespaceURI).toBe(SVG_NAMESPACE);
  expect(svg.childNodes[3].namespaceURI).toBe(SVG_NAMESPACE);
  expect(svg.childNodes[3].childNodes[0].namespaceURI).toBe(HTML_NAMESPACE);
  expect(m.A()().namespaceURI).toBe(HTML_NAMESPACE);
  expect(m.SvgScript()().namespaceURI).toBe(SVG_NAMESPACE);
  expect(m.SvgStyle()().namespaceURI).toBe(SVG_NAMESPACE);
  expect(m.SvgTitle()().namespaceURI).toBe(SVG_NAMESPACE);
  expect(m.Math()().namespaceURI).toBe(MATHML_NAMESPACE);
  expect(m.Mfrac()().namespaceURI).toBe(MATHML_NAMESPACE);
});
