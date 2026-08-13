import { describe, expect, test } from "bun:test";
import { signal, value } from "@cyftec/signals";
import { getCss } from "../src/nocss/css.ts";

describe("no-css helpers", () => {
  test("combines phrases and reacts to conditional classes", () => {
    const css = getCss<"mv2" | "bg-yellow" | "bg-light-gray">();
    const isOn = signal(false);
    const classNames = css(
      "mv2",
      css.when(isOn, "bg-yellow", "bg-light-gray"),
    );

    expect(value(classNames) as string).toBe("mv2 bg-light-gray");
    isOn.value = true;
    expect(value(classNames) as string).toBe("mv2 bg-yellow");
  });

  test("selects matching case classes reactively", () => {
    const css = getCss<"mv2" | "bg-yellow" | "bg-light-gray">();
    const state = signal<"on" | "off">("off");
    const classNames = css.cases(
      state,
      { "bg-yellow": "on", "bg-light-gray": "off" },
      "mv2",
    );

    expect(value(classNames)).toBe("bg-light-gray");
    state.value = "on";
    expect(value(classNames)).toBe("bg-yellow");
  });
});
