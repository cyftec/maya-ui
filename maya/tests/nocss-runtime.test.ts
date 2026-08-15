import { beforeEach, describe, expect, test } from "bun:test";
import { signal, value, valueIsSignal } from "@cyftec/signals";
import {
  getUsedNoCssClassNames,
  resetNoCssBuildRegistry,
} from "../src/nocss/compiler.ts";
import { getCss } from "../src/nocss/css.ts";

const readClassNames = (classNames: unknown) => value(classNames) as string;

beforeEach(resetNoCssBuildRegistry);

describe("css", () => {
  test("combines static phrases and ignores nullish or empty inputs", () => {
    const css = getCss<"red" | "green">();

    expect(readClassNames(css())).toBe("");

    const classNames = css("red", "", null, "green", undefined, "red");

    expect(valueIsSignal(classNames)).toBe(false);
    expect(readClassNames(classNames)).toBe("red green red");
    expect(getUsedNoCssClassNames()).toEqual(new Set(["red", "green"]));
  });

  test("reacts to signalled phrases and records every evaluated value", () => {
    const css = getCss<"base" | "red" | "green">();
    const color = signal<"red" | "green" | null | undefined>("red");
    const classNames = css("base", color);

    expect(valueIsSignal(classNames)).toBe(true);
    expect(readClassNames(classNames)).toBe("base red");

    color.value = undefined;
    expect(readClassNames(classNames)).toBe("base");

    color.value = "green";
    expect(readClassNames(classNames)).toBe("base green");

    color.value = null;
    expect(readClassNames(classNames)).toBe("base");
    expect(getUsedNoCssClassNames()).toEqual(
      new Set(["base", "red", "green"]),
    );
  });

  test("composes helper results as validated phrases", () => {
    const css = getCss<"mv2" | "bg-yellow" | "bg-light-gray">();
    const isOn = signal(false);
    const classNames = css(
      "mv2",
      css.when(isOn, "bg-yellow", "bg-light-gray"),
    );

    expect(readClassNames(classNames)).toBe("mv2 bg-light-gray");
    isOn.value = true;
    expect(readClassNames(classNames)).toBe("mv2 bg-yellow");
    expect(getUsedNoCssClassNames()).toEqual(
      new Set(["mv2", "bg-yellow", "bg-light-gray"]),
    );
  });

  test("expands compounds before updating the DOM class value or registry", () => {
    const compoundClasses = { card: "red green" } as const;
    const css = getCss<"card" | "red" | "green", typeof compoundClasses>(
      compoundClasses,
    );

    expect(readClassNames(css("card"))).toBe("red green");
    expect(readClassNames(css("card", "red"))).toBe("red green red");
    expect(getUsedNoCssClassNames()).toEqual(new Set(["red", "green"]));
  });
});

describe("css.when", () => {
  test("selects plain truthy and falsy branches without creating signals", () => {
    const css = getCss<"red" | "green" | "blue">();
    const truthy = css.when(true, "red green", "blue");
    const falsy = css.when(false, "red", "green blue");

    expect(valueIsSignal(truthy)).toBe(false);
    expect(valueIsSignal(falsy)).toBe(false);
    expect(readClassNames(truthy)).toBe("red green");
    expect(readClassNames(falsy)).toBe("green blue");
    expect(getUsedNoCssClassNames()).toEqual(
      new Set(["red", "green", "blue"]),
    );
  });

  test("reacts to a signalled condition and registers both outcomes eagerly", () => {
    const css = getCss<"red" | "green">();
    const enabled = signal(false);
    const classNames = css.when(enabled, "green", "red");

    expect(valueIsSignal(classNames)).toBe(true);
    expect(getUsedNoCssClassNames()).toEqual(new Set(["green", "red"]));
    expect(readClassNames(classNames)).toBe("red");

    enabled.value = true;
    expect(readClassNames(classNames)).toBe("green");
  });

  test("expands compound outcomes eagerly", () => {
    const compoundClasses = { card: "red green" } as const;
    const css = getCss<"card" | "red" | "green", typeof compoundClasses>(
      compoundClasses,
    );
    const enabled = signal(false);
    const classNames = css.when(enabled, "card", "green");

    expect(readClassNames(classNames)).toBe("green");
    enabled.value = true;
    expect(readClassNames(classNames)).toBe("red green");
    expect(getUsedNoCssClassNames()).toEqual(new Set(["red", "green"]));
  });
});

describe("css.cases", () => {
  test("handles a static match, a default, and an empty fallback", () => {
    const css = getCss<"red" | "green" | "blue" | "bold">();
    type Status = "idle" | "busy" | "missing";
    const cases = { "red bold": "busy", green: "idle" } as const;

    expect(readClassNames(css.cases("busy" as Status, cases, "blue"))).toBe(
      "red bold",
    );
    expect(readClassNames(css.cases("missing" as Status, cases, "blue"))).toBe(
      "blue",
    );
    expect(readClassNames(css.cases("missing" as Status, cases))).toBe("");
    expect(readClassNames(css.cases("missing" as Status, {}))).toBe("");
    expect(getUsedNoCssClassNames()).toEqual(
      new Set(["red", "bold", "green", "blue"]),
    );
  });

  test("reacts when the subject changes", () => {
    const css = getCss<"mv2" | "bg-yellow" | "bg-light-gray">();
    const state = signal<"on" | "off" | "unknown">("off");
    const classNames = css.cases(
      state,
      { "bg-yellow": "on", "bg-light-gray": "off" },
      "mv2",
    );

    expect(valueIsSignal(classNames)).toBe(true);
    expect(readClassNames(classNames)).toBe("bg-light-gray");
    state.value = "on";
    expect(readClassNames(classNames)).toBe("bg-yellow");
    state.value = "unknown";
    expect(readClassNames(classNames)).toBe("mv2");
    expect(getUsedNoCssClassNames()).toEqual(
      new Set(["bg-yellow", "bg-light-gray", "mv2"]),
    );
  });

  test("reacts when a case value changes and uses the first match", () => {
    const css = getCss<"red" | "green" | "blue">();
    type Status = "on" | "off";
    const redCase = signal<Status>("off");
    const classNames = css.cases(
      "on" as Status,
      { red: redCase, green: "on" },
      "blue",
    );

    expect(valueIsSignal(classNames)).toBe(true);
    expect(readClassNames(classNames)).toBe("green");
    redCase.value = "on";
    expect(readClassNames(classNames)).toBe("red");
  });

  test("expands compound case keys", () => {
    const compoundClasses = { card: "red green" } as const;
    const css = getCss<"card" | "red" | "green", typeof compoundClasses>(
      compoundClasses,
    );

    expect(readClassNames(css.cases("card", { card: "card" }))).toBe(
      "red green",
    );
    expect(getUsedNoCssClassNames()).toEqual(new Set(["red", "green"]));
  });
});

describe("css.ifNullable", () => {
  test("uses its fallback only for static nullish values", () => {
    const css = getCss<"red" | "green">();

    expect(readClassNames(css.ifNullable(null, "green"))).toBe("green");
    expect(readClassNames(css.ifNullable(undefined, "green"))).toBe("green");
    expect(readClassNames(css.ifNullable("red", "green"))).toBe("red");
    expect(readClassNames(css.ifNullable("", "green"))).toBe("");
    expect(getUsedNoCssClassNames()).toEqual(new Set(["green", "red"]));
  });

  test("reacts to nullable signals while preserving an empty phrase", () => {
    const css = getCss<"red" | "green">();
    const color = signal<"red" | "" | null | undefined>(undefined);
    const classNames = css.ifNullable(color, "green");

    expect(valueIsSignal(classNames)).toBe(true);
    expect(readClassNames(classNames)).toBe("green");
    color.value = "";
    expect(readClassNames(classNames)).toBe("");
    color.value = "red";
    expect(readClassNames(classNames)).toBe("red");
    color.value = null;
    expect(readClassNames(classNames)).toBe("green");
    expect(getUsedNoCssClassNames()).toEqual(new Set(["green", "red"]));
  });

  test("expands compound nullable values and fallbacks", () => {
    const compoundClasses = { card: "red green" } as const;
    const css = getCss<"card" | "red" | "green", typeof compoundClasses>(
      compoundClasses,
    );
    const optional = signal<"card" | null>(null);
    const classNames = css.ifNullable(optional, "card");

    expect(readClassNames(classNames)).toBe("red green");
    optional.value = "card";
    expect(readClassNames(classNames)).toBe("red green");
    expect(getUsedNoCssClassNames()).toEqual(new Set(["red", "green"]));
  });
});

describe("NoCSS build registry", () => {
  test("deduplicates tokens, returns snapshots, and can be reset", () => {
    const css = getCss<"red" | "green">();
    css("red red");

    const snapshot = getUsedNoCssClassNames();
    snapshot.add("green");

    expect(getUsedNoCssClassNames()).toEqual(new Set(["red"]));
    resetNoCssBuildRegistry();
    expect(getUsedNoCssClassNames()).toEqual(new Set());
  });
});
