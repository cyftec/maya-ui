import { beforeEach, describe, expect, spyOn, test } from "bun:test";
import { getNonSignalObject, signal } from "@cyftec/signal";
import {
  decodeHTMLEntities,
  decodeJSUnicode,
  decodeURIComponentSafe,
} from "../src/core/utils/decoders.ts";
import { idGen } from "../src/core/utils/id-generator.ts";
import { phase } from "../src/core/utils/phase-helpers.ts";
import {
  sanitizeAttributeValue,
  sanitizeHref,
  sanitizeStyle,
} from "../src/core/utils/sanitizers.ts";
import {
  validChild,
  validChildren,
  validChildrenProp,
  validNonSignalChild,
  validNonSignalChildOrChildren,
  validPlainChildOrChildren,
  validPlainChildren,
  validSignalChild,
  validSignalChildOrChildren,
  valueIsArray,
  valueIsMayaNode,
} from "../src/core/utils/type-checkers.ts";

beforeEach(() => {
  window._currentAppPhase = "run";
});

describe("decoders and sanitizers", () => {
  test("decodes HTML, URI, unicode, and hex escapes without breaking malformed URI input", () => {
    expect(decodeHTMLEntities("Tom &amp; Jerry &lt;3")).toBe("Tom & Jerry <3");
    expect(decodeURIComponentSafe("hello%20world")).toBe("hello world");
    expect(decodeURIComponentSafe("%E0%A4%A")).toBe("%E0%A4%A");
    expect(decodeJSUnicode("\\u0041\\x42\\u12zz")).toBe("AB\\u12zz");
  });

  test("allows ordinary href and style values", () => {
    expect(sanitizeHref("/docs?q=maya")).toBe("/docs?q=maya");
    expect(sanitizeStyle("color: red; display: block")).toBe(
      "color: red; display: block",
    );
    expect(sanitizeAttributeValue("title", true)).toBe(true);
    expect(sanitizeAttributeValue("href", undefined)).toBe("");
    expect(sanitizeAttributeValue("style", undefined)).toBe("");
  });

  test("rejects dangerous values even when encoded or padded", () => {
    for (const unsafeHref of [
      " javascript:alert(1)",
      "data:text/html,boom",
      "vbscript:msgbox(1)",
      "file:///etc/passwd",
      "%6Aavascript:alert(1)",
      "&#106;avascript:alert(1)",
      "\\u006aavascript:alert(1)",
    ]) {
      expect(() => sanitizeHref(unsafeHref)).toThrow("href attribute value");
    }
    for (const unsafeStyle of [
      "background: url(/pixel)",
      "width: expression(alert(1))",
      "javascript:alert(1)",
      "data:text/css,body{}",
      "vbscript:msgbox(1)",
      "file:///tmp/x",
    ]) {
      expect(() => sanitizeStyle(unsafeStyle)).toThrow("style attribute value");
    }
    expect(() => sanitizeAttributeValue("href", true)).toThrow(
      "should not be a boolean",
    );
    expect(() => sanitizeAttributeValue("style", false)).toThrow(
      "should not be a boolean",
    );
  });
});

describe("identity, phase, and child type checks", () => {
  test("generates sequential IDs and resets them", () => {
    idGen.resetIdCounter();
    expect(idGen.getNewId()).toBe(1);
    expect(idGen.getNewId()).toBe(2);
    expect(idGen.resetIdCounter()).toBe(0);
    expect(idGen.getNewId()).toBe(1);
  });

  test("starts and identifies app phases", () => {
    const log = spyOn(console, "log").mockImplementation(() => {});
    phase.start("build");
    expect(phase.currentIs("build")).toBe(true);
    expect(phase.currentIs("run")).toBe(false);
    expect(log).toHaveBeenCalledWith("Current phase is build");
    log.mockRestore();
  });

  test("classifies Maya nodes, child getters, arrays, signals, and non-signals", () => {
    const getter = Object.assign(() => ({ nodeID: 1 }), {
      isMayaNodeGetter: true,
    });
    const source = signal("reactive");
    const nonSignal = getNonSignalObject("plain");
    const signalChildren = signal(["a", getter]);
    const plainChildren = ["a", source, nonSignal, getter];

    expect(valueIsArray([])).toBe(true);
    expect(valueIsArray({})).toBe(false);
    expect(valueIsMayaNode({ nodeID: 1 })).toBe(true);
    expect(valueIsMayaNode({ nodeID: 0 })).toBe(false);
    expect(valueIsMayaNode(null)).toBe(false);
    expect(validChild(undefined)).toBe(true);
    expect(validChild("text")).toBe(true);
    expect(validChild(getter)).toBe(true);
    expect(validChild(() => ({}))).toBe(false);
    expect(validChildren([undefined, "text", getter])).toBe(true);
    expect(validChildren([1])).toBe(false);
    expect(validNonSignalChild(nonSignal)).toBe(true);
    expect(validSignalChild(source)).toBe(true);
    expect(validNonSignalChildOrChildren(getNonSignalObject(["a", getter])))
      .toBe(true);
    expect(validSignalChildOrChildren(signalChildren)).toBe(true);
    expect(validPlainChildren(plainChildren)).toBe(true);
    expect(validPlainChildOrChildren(plainChildren)).toBe(true);
    expect(validChildrenProp(signalChildren)).toBe(true);
    expect(validChildrenProp({ value: 42 })).toBe(false);
  });
});
