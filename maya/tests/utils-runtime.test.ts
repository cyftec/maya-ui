import { beforeEach, describe, expect, spyOn, test } from "bun:test";
import { signal } from "@cyftec/signals";
import {
  decodeHTMLEntities,
  decodeJSUnicode,
  decodeURIComponentSafe,
} from "../src/core/utils/decoders.ts";
import { idGen } from "../src/core/utils/id-generator.ts";
import { phase } from "../src/core/utils/phase-helpers.ts";
import {
  isStrictAssetPath,
  sanitizeAttributeValue,
  sanitizeHref,
  sanitizeStyle,
} from "../src/core/utils/sanitizers.ts";
import {
  validChild,
  validChildArray,
  validChildrenProp,
  validArrayOfChildOrChildSignal,
  validChildSignal,
  validSignalOfChildOrChildArray,
  valueIsArray,
  valueIsMayaNode,
  validChildOrArrayOfChildOrChildSignal,
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

describe("isStrictAssetPath", () => {
  test("allows clean local asset paths", () => {
    const validPaths = [
      "/assets/image.png",
      "current-route/drawing.bmp",
      "./images/foo.jpg",
      "../bar.png",
      "image.png",
      "/static/media/icon_v2-final.svg",
      "subfolder/nested/deep/file.webp",
    ];

    for (const path of validPaths) {
      expect(isStrictAssetPath(path)).toBe(true);
    }
  });

  describe("blocks query parameters, fragments, and URL features", () => {
    test("rejects query strings (even for cache busting)", () => {
      expect(isStrictAssetPath("/assets/image.png?v=123")).toBe(false);
      expect(isStrictAssetPath("image.png?redirect=https://evil.com")).toBe(
        false,
      );
      expect(isStrictAssetPath("drawing.bmp?")).toBe(false);
    });

    test("rejects hash fragments", () => {
      expect(isStrictAssetPath("/assets/sprite.svg#icon-user")).toBe(false);
      expect(isStrictAssetPath("image.png#main")).toBe(false);
    });

    test("rejects combined query strings and hashes", () => {
      expect(isStrictAssetPath("/img.png?v=1#top")).toBe(false);
    });
  });

  describe("blocks sneaky CSS injection & protocol bypasses", () => {
    test("blocks quotes, parentheses, and spaces (CSS url(...) break-outs)", () => {
      expect(isStrictAssetPath("image.png')/*")).toBe(false);
      expect(isStrictAssetPath('image.png"); background: url("evil')).toBe(
        false,
      );
      expect(isStrictAssetPath("image.png); alert(1);")).toBe(false);
      expect(isStrictAssetPath("image .png")).toBe(false);
    });

    test("blocks absolute and inline schemes", () => {
      expect(isStrictAssetPath("http://evil.com/image.png")).toBe(false);
      expect(isStrictAssetPath("https://evil.com/image.png")).toBe(false);
      expect(isStrictAssetPath("javascript:alert(1)")).toBe(false);
      expect(isStrictAssetPath("JAVASCRIPT:alert(1)")).toBe(false);
      expect(isStrictAssetPath("data:image/png;base64,iVBORw0KGgo...")).toBe(
        false,
      );
      expect(isStrictAssetPath("blob:https://example.com/uuid")).toBe(false);
    });

    test("blocks protocol-relative & backslash redirect tricks", () => {
      expect(isStrictAssetPath("//evil.com/image.png")).toBe(false);
      expect(isStrictAssetPath("\\\\evil.com\\image.png")).toBe(false);
      expect(isStrictAssetPath("/\\evil.com/image.png")).toBe(false);
      expect(isStrictAssetPath("\\/evil.com/image.png")).toBe(false);
    });

    test("blocks whitespace and control character injection attempts", () => {
      expect(isStrictAssetPath("java\nscript:alert(1)")).toBe(false);
      expect(isStrictAssetPath("java\rscript:alert(1)")).toBe(false);
      expect(isStrictAssetPath("java\tscript:alert(1)")).toBe(false);
      expect(isStrictAssetPath("java\0script:alert(1)")).toBe(false);
      expect(isStrictAssetPath("   /assets/image.png?v=1")).toBe(false);
    });

    test("blocks windows paths, unc paths, and odd schemes", () => {
      expect(isStrictAssetPath("C:\\Windows\\System32\\cmd.exe")).toBe(false);
      expect(isStrictAssetPath("c:image.png")).toBe(false);
      expect(isStrictAssetPath("file:///etc/passwd")).toBe(false);
    });

    test("gracefully rejects non-string inputs", () => {
      expect(isStrictAssetPath(null as any)).toBe(false);
      expect(isStrictAssetPath(undefined as any)).toBe(false);
      expect(isStrictAssetPath(12345 as any)).toBe(false);
      expect(isStrictAssetPath({} as any)).toBe(false);
    });
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

  test("classifies Maya nodes, child getters, arrays, and signals", () => {
    const getter = Object.assign(() => ({ nodeID: 1 }), {
      isMayaNodeGetter: true,
    });
    const source = signal("reactive");
    const signalChildren = signal(["a", getter]);
    const plainChildren = ["a", source, getter];

    expect(valueIsArray([])).toBe(true);
    expect(valueIsArray({})).toBe(false);
    expect(valueIsMayaNode({ nodeID: 1 })).toBe(true);
    expect(valueIsMayaNode({ nodeID: 0 })).toBe(false);
    expect(valueIsMayaNode(null)).toBe(false);
    expect(validChild(undefined)).toBe(true);
    expect(validChild("text")).toBe(true);
    expect(validChild(getter)).toBe(true);
    expect(validChild(() => ({}))).toBe(false);
    expect(validChildArray([undefined, "text", getter])).toBe(true);
    expect(validChildArray([1])).toBe(false);
    expect(validChildSignal(source)).toBe(true);
    expect(validSignalOfChildOrChildArray(signalChildren)).toBe(true);
    expect(validArrayOfChildOrChildSignal(plainChildren)).toBe(true);
    expect(validChildOrArrayOfChildOrChildSignal(plainChildren)).toBe(true);
    expect(validChildrenProp(signalChildren)).toBe(true);
    expect(validChildrenProp({ value: 42 })).toBe(false);
  });
});
