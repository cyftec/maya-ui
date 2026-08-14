import { beforeEach, describe, expect, test } from "bun:test";
import { signal, value } from "@cyftec/signals";
import { getCss } from "../src/nocss/css.ts";

const usedClassNames = (
  globalThis as typeof globalThis & {
    __noCssGlobalRegistry: { usedClassNames: Set<string> };
  }
).__noCssGlobalRegistry.usedClassNames;

beforeEach(() => usedClassNames.clear());

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
    expect(usedClassNames).toEqual(
      new Set(["mv2", "bg-yellow", "bg-light-gray"]),
    );
  });

  test("selects matching case classes reactively", () => {
    const css = getCss<"mv2" | "bg-yellow" | "bg-light-gray">();
    const state = signal<"on" | "off">("off");
    const classNames = css.cases(
      state,
      { "bg-yellow": "on", "bg-light-gray": "off" },
      "mv2",
    );

    expect(value(classNames) as string).toBe("bg-light-gray");
    state.value = "on";
    expect(value(classNames) as string).toBe("bg-yellow");
    expect(usedClassNames).toEqual(
      new Set(["bg-yellow", "bg-light-gray", "mv2"]),
    );
  });

  test("accepts a signalled class phrase and records each evaluated value", () => {
    const css = getCss<"red" | "green">();
    const colorSignal = signal<"red" | "green">("red");
    const classNames = css(colorSignal);

    expect(value(classNames) as string).toBe("red");
    colorSignal.value = "green";
    expect(value(classNames) as string).toBe("green");
    expect(usedClassNames).toEqual(new Set(["red", "green"]));
  });

  test("ignores absent nullable class phrases", () => {
    const css = getCss<"red">();

    expect(value(css("red", null, undefined)) as string).toBe("red");
    expect(usedClassNames).toEqual(new Set(["red"]));
  });

  test("uses a static class phrase while a nullable phrase is absent", () => {
    const css = getCss<"red" | "green">();
    const color = signal<"red" | "" | null | undefined>(undefined);
    const classNames = css.ifNullable(color, "green");

    expect(value(classNames) as string).toBe("green");
    color.value = "";
    expect(value(classNames) as string).toBe("");
    color.value = "red";
    expect(value(classNames) as string).toBe("red");
    color.value = null;
    expect(value(classNames) as string).toBe("green");
    expect(usedClassNames).toEqual(new Set(["green", "red"]));
  });
});
