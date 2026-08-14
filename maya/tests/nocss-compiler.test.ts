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
  test("returns empty CSS for empty or unknown class-name collections", () => {
    expect(buildNoCssStylesheet([])).toBe("");
    expect(buildNoCssStylesheet(["not-in-the-repository"])).toBe("");
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
    const stylesheet = buildNoCssStylesheet([
      "pa2",
      "hover-bg-washed-yellow",
    ]);

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
        overriddenBaseClasses: {
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
      overriddenMediaConstraints: {
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

  test("compiles compound aliases with atomic, pseudo, and responsive rules", () => {
    const stylesheet = buildNoCssStylesheet(["button"], {
      compoundClasses: {
        button: "pa2 hover-bg-washed-yellow pa2-m",
      },
    });

    expect(stylesheet).toBe(
      ".button{ padding: .5rem; }" +
        ".button:hover{ background-color: #fffceb; }" +
        ".button:focus{ background-color: #fffceb; }" +
        "@media (min-width:30em) and (max-width:60em){.button{ padding: .5rem; }}",
    );
  });

  test("recursively expands nested compound aliases", () => {
    const stylesheet = buildNoCssStylesheet(["card"], {
      overriddenBaseClasses: {
        default: { "bg-theme": "{ background: tomato; }" },
      },
      compoundClasses: {
        surface: "bg-theme pa2",
        card: "surface br4",
      },
    });

    expect(stylesheet).toContain(".card{ background: tomato; }");
    expect(stylesheet).toContain(".card{ padding: .5rem; }");
    expect(stylesheet).toContain(".card{ border-radius: 1rem; }");
    expect(stylesheet).not.toContain(".surface{");
  });

  test("rejects direct and indirect compound cycles", () => {
    expect(() =>
      buildNoCssStylesheet(["card"], {
        compoundClasses: { card: "card" },
      }),
    ).toThrow("Circular nocss compound class: 'card'.");

    expect(() =>
      buildNoCssStylesheet(["card"], {
        compoundClasses: { card: "panel", panel: "card" },
      }),
    ).toThrow("Circular nocss compound class: 'card'.");
  });

  test("compiles every declared helper outcome collected during rendering", () => {
    const css = getCss<"pa2" | "bg-yellow" | "bg-light-gray" | "dn">();
    const enabled = signal(false);

    css("pa2", css.when(enabled, "bg-yellow", "bg-light-gray"));
    css.cases("visible", { dn: "hidden" });

    const stylesheet = buildNoCssStylesheet(getUsedNoCssClassNames());

    expect(stylesheet).toContain(".pa2{ padding: .5rem; }");
    expect(stylesheet).toContain(".bg-yellow{ background-color: #ffd700; }");
    expect(stylesheet).toContain(
      ".bg-light-gray{ background-color: #eee; }",
    );
    expect(stylesheet).toContain(".dn{ display: none; }");
  });
});
