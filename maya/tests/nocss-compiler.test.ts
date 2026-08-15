import { beforeEach, describe, expect, test } from "bun:test";
import { signal } from "@cyftec/signals";
import {
  buildNoCssStylesheet,
  getUsedNoCssClassNames,
  resetNoCssBuildRegistry,
} from "../src/nocss/compiler.ts";
import { getCss } from "../src/nocss/css.ts";

beforeEach(resetNoCssBuildRegistry);

describe("no-css compiler", () => {
  test("returns empty CSS for an empty class-name collection", () => {
    expect(buildNoCssStylesheet([])).toBe("");
  });

  test("rejects unknown class names instead of silently omitting their CSS", () => {
    expect(() => buildNoCssStylesheet(["not-in-the-repository"])).toThrow(
      "Unknown NoCSS atomic class 'not-in-the-repository'.",
    );
  });

  test("accepts any iterable and emits duplicate used names only once", () => {
    function* usedClassNames() {
      yield "pa2";
      yield "pa2";
    }

    expect(buildNoCssStylesheet(usedClassNames())).toBe(
      ".pa2{ padding: .5rem; }",
    );
  });

  test("emits only used atomic rules, including every pseudo selector", () => {
    const stylesheet = buildNoCssStylesheet(["pa2", "hover-bg-washed-yellow"]);

    expect(stylesheet).toContain(".pa2{ padding: .5rem; }");
    expect(stylesheet).toContain(
      ".hover-bg-washed-yellow:hover{ background-color: #fffceb; }",
    );
    expect(stylesheet).toContain(
      ".hover-bg-washed-yellow:focus{ background-color: #fffceb; }",
    );
    expect(stylesheet).not.toContain(".bg-yellow{");
  });

  test("replaces factory declarations and adds custom classes in every group", () => {
    const stylesheet = buildNoCssStylesheet(
      ["pa2", "app", "app-ns", "app-m", "app-l"],
      {
        atomicClassOverrides: {
          default: {
            pa2: "{ padding: 2rem; }",
            app: "{ display: block; }",
          },
          ns: { "app-ns": "{ display: grid; }" },
          m: { "app-m": "{ display: flex; }" },
          l: { "app-l": "{ display: none; }" },
        },
      },
    );

    expect(stylesheet).toBe(
      ".pa2{ padding: 2rem; }.app{ display: block; }" +
        "@media (min-width:30em){.app-ns{ display: grid; }}" +
        "@media (min-width:30em) and (max-width:60em){.app-m{ display: flex; }}" +
        "@media (min-width:60em){.app-l{ display: none; }}",
    );
    expect(stylesheet).not.toContain("padding: .5rem");
  });

  test("merges media overrides and converts constraint names to CSS syntax", () => {
    const stylesheet = buildNoCssStylesheet(["pa2-ns", "pa2-m", "pa2-l"], {
      mediaConstraintsOverrides: {
        ns: { minWidth: "31em" },
        m: { minWidth: "32em", maxWidth: "59em" },
        l: { minWidth: "61em" },
      },
    });

    expect(stylesheet).toBe(
      "@media (min-width:31em){.pa2-ns{ padding: .5rem; }}" +
        "@media (min-width:32em) and (max-width:59em){.pa2-m{ padding: .5rem; }}" +
        "@media (min-width:61em){.pa2-l{ padding: .5rem; }}",
    );
  });

  test("emits only atomic selectors for compound helper output", () => {
    const compoundClasses = {
      button: "pa2 hover-bg-washed-yellow pa2-m",
    } as const;
    const css = getCss<
      "button" | "pa2" | "hover-bg-washed-yellow" | "pa2-m",
      typeof compoundClasses
    >(compoundClasses);
    expect(String(css("button"))).toBe("pa2 hover-bg-washed-yellow pa2-m");

    const stylesheet = buildNoCssStylesheet(getUsedNoCssClassNames(), {
      compoundClasses: {
        button: "pa2 hover-bg-washed-yellow pa2-m",
      },
    });

    expect(stylesheet).toBe(
      ".pa2{ padding: .5rem; }" +
        ".hover-bg-washed-yellow:hover{ background-color: #fffceb; }" +
        ".hover-bg-washed-yellow:focus{ background-color: #fffceb; }" +
        "@media (min-width:30em) and (max-width:60em){.pa2-m{ padding: .5rem; }}",
    );
    expect(stylesheet).not.toContain(".button");
  });

  test("rejects compounds that are not flat atomic maps", () => {
    expect(() =>
      buildNoCssStylesheet([], {
        compoundClasses: { card: "pa2 missing" },
      }),
    ).toThrow("Unknown NoCSS atomic class 'missing' in compound class 'card'.");

    expect(() =>
      buildNoCssStylesheet([], {
        compoundClasses: { card: "pa2" },
      }),
    ).toThrow(
      "NoCSS compound class 'card' must contain at least two atomic classes.",
    );

    expect(() =>
      buildNoCssStylesheet([], {
        compoundClasses: { surface: "pa2 br4", card: "surface pa2" },
      }),
    ).toThrow(
      "NoCSS compound class 'card' must not contain compound class 'surface'.",
    );

    expect(() =>
      buildNoCssStylesheet([], {
        compoundClasses: { pa2: "br4 ba" },
      }),
    ).toThrow("NoCSS compound class 'pa2' conflicts with an atomic class.");
  });

  test("rejects compound names that reach the stylesheet compiler", () => {
    expect(() =>
      buildNoCssStylesheet(["card"], {
        compoundClasses: { card: "pa2 br4" },
      }),
    ).toThrow(
      "NoCSS compound class 'card' reached the stylesheet compiler. Pass compoundClasses to getCss() so it expands to atomic classes first.",
    );
  });

  test("emits atomics from a compound with application overrides", () => {
    const stylesheet = buildNoCssStylesheet(["bg-theme", "pa2", "br4"], {
      atomicClassOverrides: {
        default: { "bg-theme": "{ background: tomato; }" },
      },
    });

    expect(stylesheet).toContain(".bg-theme{ background: tomato; }");
    expect(stylesheet).toContain(".pa2{ padding: .5rem; }");
    expect(stylesheet).toContain(".br4{ border-radius: 1rem; }");
  });

  test("compiles every declared helper outcome collected during rendering", () => {
    const css = getCss<"pa2" | "bg-yellow" | "bg-light-gray" | "dn">();
    const enabled = signal(false);

    css("pa2", css.when(enabled, "bg-yellow", "bg-light-gray"));
    css.cases("visible", { dn: "hidden" });

    const stylesheet = buildNoCssStylesheet(getUsedNoCssClassNames());

    expect(stylesheet).toContain(".pa2{ padding: .5rem; }");
    expect(stylesheet).toContain(".bg-yellow{ background-color: #ffd700; }");
    expect(stylesheet).toContain(".bg-light-gray{ background-color: #eee; }");
    expect(stylesheet).toContain(".dn{ display: none; }");
  });
});
