import { beforeEach, describe, expect, test } from "bun:test";
import {
  derive,
  signal,
  value,
  valueIsSignal,
  type Signal,
} from "@cyftec/signals";
import { component } from "../src/core/component.ts";
import { fragment } from "../src/core/fragment.ts";
import { m } from "../src/core/elements/m.ts";
import { idGen } from "../src/core/utils/id-generator.ts";

const textFromChildren = (children: any): string => {
  const node = m.Div(children)();
  return node.textContent || "";
};

beforeEach(() => {
  document.body.replaceChildren();
  idGen.resetIdCounter();
  window._currentAppPhase = "run";
});

describe("fragments and components", () => {
  test("normalizes plain props while preserving functions and ordinary signals", () => {
    const live = signal("live");
    const arrayItem = signal("item");
    const plainChildArraySignal = signal(["plain item"]);
    const callback = () => "called";
    let innerProps: Record<string, any> = {};
    const Card = fragment<any, any>((props) => {
      innerProps = props;
      return m.Div(props["text"]);
    });
    const input: Record<string, any> = {
      text: "plain",
      count: 2,
      live,
      callback,
      items: [arrayItem],
      plainItems: plainChildArraySignal,
      absent: undefined,
    };

    expect(Card(input)().textContent).toBe("plain");
    expect(innerProps["text"].value).toBe("plain");
    expect(innerProps["count"].value).toBe(2);
    expect(innerProps["live"]).toBe(live);
    expect(innerProps["callback"]).toBe(callback);
    expect(innerProps["items"]).toEqual([arrayItem]);
    expect(innerProps["plainItems"]).toBe(plainChildArraySignal);
    expect("absent" in innerProps).toBe(false);
    expect("absent" in input).toBe(false);
  });

  test("preserves explicitly wrapped child arrays and component output", () => {
    const children = [m.Span("a"), m.Span("b")];
    const Row = component<any>((props) => m.Div(props["children"]));
    expect((Row({ children }) as any)().textContent).toBe("ab");
    expect((Row({}) as any)().textContent).toBe("");
  });

  test("renders a signal-wrapped array of child signals", () => {
    const firstChild = signal("first");
    const children = signal([firstChild]);
    const Row = component<any>((props) => m.Div(props["children"]));

    const node = (Row({ children }) as any)();
    expect(node.textContent).toBe("first");
  });

  test("unwraps an array signal with signal items before calling the inner fragment", () => {
    const item = signal(1);
    const items = signal([item]);
    let innerItems: unknown;
    const Card = fragment<any, any>((props) => {
      innerItems = props["items"];
      return m.Div();
    });

    Card({ items });

    expect(Array.isArray(innerItems)).toBe(true);
    expect(valueIsSignal((innerItems as unknown[])[0])).toBe(true);
    expect(valueIsSignal(innerItems)).toBe(false);
  });
});

describe("If and Switch custom elements", () => {
  test("selects truthy, falsy, and hidden fallback branches for plain subjects", () => {
    expect(
      textFromChildren(m.If({ subject: 1, isTruthy: (v) => `${v}!` })),
    ).toBe("1!");
    expect(textFromChildren(m.If({ subject: 0, isFalsy: () => "no" }))).toBe(
      "no",
    );
    const hidden = m.Div(m.If({ subject: null }))();
    expect(hidden.firstElementChild?.getAttribute("style")).toBe(
      "display: none;",
    );
  });

  test("reacts to If subject changes and unwraps signal branch results", () => {
    const subject = signal<number | null>(1);
    const output = m.If({
      subject,
      isTruthy: (v) => derive(() => `yes:${value(v as any)}`),
      isFalsy: () => signal("no"),
    });
    const node = m.Div(output)();
    expect(node.textContent).toBe("yes:1");
    subject.value = null;
    expect(node.textContent).toBe("no");
    subject.value = 2;
    expect(node.textContent).toBe("yes:2");
  });

  test("matches Switch cases normally, with a matcher, by default, and reactively", () => {
    expect(
      textFromChildren(m.Switch({ subject: 2, cases: { "2": () => "two" } })),
    ).toBe("two");
    expect(
      textFromChildren(
        m.Switch({
          subject: "ADMIN",
          caseMatcher: (subject, key) => subject.toLowerCase() === key,
          cases: { admin: () => "matched" },
        }),
      ),
    ).toBe("matched");
    expect(
      textFromChildren(
        m.Switch({ subject: false, defaultCase: () => "default" }),
      ),
    ).toBe("default");

    const subject = signal("a");
    const cases = signal<{ [x: string]: () => string }>({
      a: () => "A" as string,
      b: () => "B" as string,
    });
    const node = m.Div(m.Switch({ subject, cases }))();
    expect(node.textContent).toBe("A");
    subject.value = "b";
    expect(node.textContent).toBe("B");
    cases.value = { a: () => "AA", b: () => "BB" };
    expect(node.textContent).toBe("BB");
  });

  test("unwraps reactive Switch case results", () => {
    const subject = signal("yes");
    const cases: { [key: string]: () => Signal<string> } = {
      yes: () => derive(() => "yes"),
      no: () => signal("no"),
    };
    const output = m.Switch({
      subject,
      cases,
    });
    const node = m.Div(output)();

    expect(node.textContent).toBe("yes");
    subject.value = "no";
    expect(node.textContent).toBe("no");
  });
});

describe("For custom element", () => {
  test("maps plain and signal lists and injects one stable child", () => {
    const injected = m.Hr();
    const plain = m.For({
      subject: ["a", "b"],
      map: (item, index) => `${index}:${item}`,
      n: 1,
      nthChild: injected,
    });
    const plainNode = m.Div(plain)();
    expect(plainNode.textContent).toBe("0:a1:b");
    expect(plainNode.children).toHaveLength(1);

    const subject = signal(["x"]);
    const output = m.For({
      subject,
      map: (item) => m.Span(item),
      n: 50,
      nthChild: m.Br(),
    });
    const node = m.Div(output)();
    const injectedNode = node.lastChild;
    expect(node.textContent).toBe("x");
    subject.value = ["y", "z"];
    expect(node.textContent).toBe("yz");
    expect(node.lastChild).toBe(injectedNode);
  });

  test("requires n and nthChild together", () => {
    expect(() =>
      m.For({ subject: [1], map: String, nthChild: m.Hr() }),
    ).toThrow("Either both 'n' and 'nthChild'");
    expect(() => m.For({ subject: [1], map: String, n: 0 })).toThrow(
      "Either both 'n' and 'nthChild'",
    );
  });

  test("validates mutable subjects and mapped children", () => {
    expect(() =>
      m.For({
        subject: signal([1, 2]) as any,
        itemKey: "id" as any,
        map: (() => "x") as any,
      }),
    ).toThrow("item in the list must be an object");
    expect(() =>
      m.For({
        subject: signal({ nope: true }) as any,
        itemKey: "id" as any,
        map: (() => "x") as any,
      }),
    ).toThrow("subject must be an array");
    expect(() =>
      m.For({
        subject: signal([{ id: 1 }]),
        itemKey: "id",
        map: (() => 42) as any,
      }),
    ).toThrow("passed in ForElement is invalid");
  });

  test("reuses keyed DOM nodes across updates, shuffles, removals, and additions", () => {
    const subject = signal([
      { id: 1, label: "A" },
      { id: 2, label: "B" },
    ]);
    const output = m.For({
      subject,
      itemKey: "id",
      map: (item, index) => {
        return m.P([
          derive(() => item.value.label),
          ":",
          derive(() => String(index.value)),
        ]);
      },
    });
    const parent = m.Div(output)();
    const originalA = parent.children[0];
    const originalB = parent.children[1];
    expect(parent.textContent).toBe("A:0B:1");

    subject.value = [
      { id: 2, label: "Bee" },
      { id: 1, label: "A" },
      { id: 3, label: "C" },
    ];
    expect(parent.textContent).toBe("Bee:0A:1C:2");
    expect(parent.children[0]).toBe(originalB);
    expect(parent.children[1]).toBe(originalA);

    const originalC = parent.children[2];
    subject.value = [{ id: 3, label: "See" }];
    expect(parent.textContent).toBe("See:0");
    expect(parent.children[0]).toBe(originalC);
  });
});
