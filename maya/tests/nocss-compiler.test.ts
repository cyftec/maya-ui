import { describe, expect, test } from "bun:test";
import { buildNoCssStylesheet } from "../src/nocss/compiler.ts";

describe("no-css compiler", () => {
  test("emits only used atomic rules and compiles compound aliases", () => {
    const stylesheet = buildNoCssStylesheet(["card", "hover-bg-washed-yellow"], {
      overriddenBaseClasses: {
        default: {
          "bg-theme": "{ background-color: #ee4440; }",
        },
      },
      compoundClasses: { card: "bg-theme pa2" },
    });

    expect(stylesheet).toContain(".card{ background-color: #ee4440; }");
    expect(stylesheet).toContain(".card{ padding: .5rem; }");
    expect(stylesheet).toContain(
      ".hover-bg-washed-yellow:hover{ background-color: #fffceb; }",
    );
    expect(stylesheet).toContain(
      ".hover-bg-washed-yellow:focus{ background-color: #fffceb; }",
    );
    expect(stylesheet).not.toContain(".bg-yellow{");
  });

  test("uses overridden media constraints for responsive factory classes", () => {
    const stylesheet = buildNoCssStylesheet(["pa2-ns"], {
      overriddenMediaConstraints: { ns: { minWidth: "31em" } },
    });

    expect(stylesheet).toBe(
      "@media (min-width:31em){.pa2-ns{ padding: .5rem; }}",
    );
  });

  test("rejects circular compound aliases", () => {
    expect(() =>
      buildNoCssStylesheet(["card"], {
        compoundClasses: { card: "panel", panel: "card" },
      }),
    ).toThrow("Circular nocss compound class: 'card'.");
  });
});
