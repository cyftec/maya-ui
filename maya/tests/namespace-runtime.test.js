import { expect, test } from "bun:test";
import { m } from "../src/core/m.ts";

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

test("uses the correct namespace for HTML, SVG, and MathML elements", () => {
  expect(m.Div()().namespaceURI).toBe(HTML_NAMESPACE);
  expect(m.Svg()().namespaceURI).toBe(SVG_NAMESPACE);
  expect(m.Math()().namespaceURI).toBe(MATHML_NAMESPACE);
  expect(m.Mfrac()().namespaceURI).toBe(MATHML_NAMESPACE);
});
