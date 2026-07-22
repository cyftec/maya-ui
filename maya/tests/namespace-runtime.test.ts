import { beforeEach, describe, expect, test } from "bun:test";
import { m } from "../src/core/elements/m.ts";
import {
  htmlTagNames,
  mathMlTagNames,
  svgTagAliases,
  svgTagNames,
} from "../src/core/utils/constants.ts";
import { idGen } from "../src/core/utils/id-generator.ts";

const HTML_NAMESPACE = "http://www.w3.org/1999/xhtml";
const SVG_NAMESPACE = "http://www.w3.org/2000/svg";
const MATHML_NAMESPACE = "http://www.w3.org/1998/Math/MathML";

beforeEach(() => {
  document.body.replaceChildren();
  idGen.resetIdCounter();
  window._currentAppPhase = "run";
});

describe("element registry and namespaces", () => {
  test("keeps native tag registries disjoint", () => {
    const registries = [htmlTagNames, svgTagNames, mathMlTagNames] as const;
    registries.forEach((registry, index) => {
      const otherTags = registries.flatMap((otherRegistry, otherIndex) =>
        otherIndex === index ? [] : [...otherRegistry],
      );
      expect(registry.filter((tagName) => otherTags.includes(tagName as never)))
        .toEqual([]);
    });
  });

  test("exposes every declared element using its PascalCase or SVG alias name", () => {
    for (const tagName of [...htmlTagNames, ...svgTagNames, ...mathMlTagNames]) {
      const memberName = tagName
        .split("-")
        .map((part) => part.charAt(0).toUpperCase() + part.slice(1))
        .join("");
      expect(typeof (m as Record<string, unknown>)[memberName]).toBe("function");
    }
    for (const alias of Object.keys(svgTagAliases)) {
      expect(typeof (m as Record<string, unknown>)[alias]).toBe("function");
    }
  });

  test("uses the correct namespace for HTML, SVG, MathML, aliases, and foreignObject HTML", () => {
    expect(m.Div()().namespaceURI).toBe(HTML_NAMESPACE);
    const svg = m.Svg([
      m.G(m.Circle({ cx: "5", cy: "5", r: "5" })),
      m.SvgA("SVG link"),
      m.SvgSwitch(),
      m.ForeignObject(m.Div("HTML content")),
    ])();
    expect(svg.namespaceURI).toBe(SVG_NAMESPACE);
    expect(svg.children[0]?.namespaceURI).toBe(SVG_NAMESPACE);
    expect(svg.children[0]?.children[0]?.namespaceURI).toBe(SVG_NAMESPACE);
    expect(svg.children[1]?.namespaceURI).toBe(SVG_NAMESPACE);
    expect(svg.children[2]?.namespaceURI).toBe(SVG_NAMESPACE);
    expect(svg.children[3]?.namespaceURI).toBe(SVG_NAMESPACE);
    expect(svg.children[3]?.children[0]?.namespaceURI).toBe(HTML_NAMESPACE);
    expect(m.A()().namespaceURI).toBe(HTML_NAMESPACE);
    expect(m.SvgScript()().namespaceURI).toBe(SVG_NAMESPACE);
    expect(m.SvgStyle()().namespaceURI).toBe(SVG_NAMESPACE);
    expect(m.SvgTitle()().namespaceURI).toBe(SVG_NAMESPACE);
    expect(m.Math()().namespaceURI).toBe(MATHML_NAMESPACE);
    expect(m.Mfrac()().namespaceURI).toBe(MATHML_NAMESPACE);
  });
});
