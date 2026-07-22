import { beforeEach, describe, expect, mock, test } from "bun:test";
import { getNonSignalObject, signal } from "@cyftec/signal";
import { m } from "../src/core/elements/m.ts";
import { idGen } from "../src/core/utils/id-generator.ts";

const tick = () => new Promise((resolve) => setTimeout(resolve, 0));

beforeEach(() => {
  document.body.replaceChildren();
  idGen.resetIdCounter();
  window._currentAppPhase = "run";
});

describe("native Maya elements", () => {
  test("sets string, boolean, value, data, ARIA, SVG, and MathML attributes", () => {
    const input = m.Input({
      required: true,
      disabled: false,
      value: "hello",
      "data-state": "ready",
      "aria-label": "Greeting",
    })() as unknown as HTMLInputElement;
    expect(input.hasAttribute("required")).toBe(true);
    expect(input.hasAttribute("disabled")).toBe(false);
    expect(input.value).toBe("hello");
    expect(input.getAttribute("data-state")).toBe("ready");
    expect(input.getAttribute("aria-label")).toBe("Greeting");

    const path = m.Path({ d: "M0 0L1 1", "stroke-width": "2" })();
    expect(path.getAttribute("d")).toBe("M0 0L1 1");
    expect(path.getAttribute("stroke-width")).toBe("2");
    expect(m.Math({ display: "block" })().getAttribute("display")).toBe("block");
  });

  test("reacts to signal attributes only during run phase", () => {
    const title = signal("first");
    const enabled = signal(true);
    const node = m.Button({ title, disabled: enabled, children: "Save" })();
    expect(node.getAttribute("title")).toBe("first");
    expect(node.hasAttribute("disabled")).toBe(true);

    title.value = "second";
    enabled.value = false;
    expect(node.getAttribute("title")).toBe("second");
    expect(node.hasAttribute("disabled")).toBe(false);

    window._currentAppPhase = "build";
    title.value = "ignored while building";
    expect(node.getAttribute("title")).toBe("second");
    window._currentAppPhase = "run";
    title.value = "third";
    expect(node.getAttribute("title")).toBe("third");
  });

  test("renders strings, entities, empty children, non-signals, and reactive child lists", () => {
    const first = signal("one");
    const children = signal<any[]>(["alpha", m.Strong("beta")]);
    const node = m.Div({
      children: [
        "&lt;start&gt;",
        undefined,
        getNonSignalObject(" fixed "),
        first,
        m.Span(children),
      ],
    })();
    expect(node.textContent).toBe("<start> fixed onealphabeta");

    first.value = "ONE";
    children.value = ["gamma"];
    expect(node.textContent).toBe("<start> fixed ONEgamma");
    children.value = ["x", "y", "z"];
    expect(node.textContent).toBe("<start> fixed ONExyz");
  });

  test("rejects invalid children and invalid Maya-node getters", () => {
    expect(() => m.Div({ children: 42 as never })()).toThrow(
      "Invalid children prop",
    );
    const invalidGetter = Object.assign(() => document.createElement("div"), {
      isMayaNodeGetter: true,
    });
    expect(() => m.Div(invalidGetter as never)()).toThrow(
      "Invalid maya-node-getter child",
    );
  });

  test("sanitizes href and style while constructing elements", () => {
    expect(() => m.A({ href: "javascript:alert(1)" })()).toThrow(
      "href attribute value",
    );
    expect(() => m.Div({ style: "background:url(/secret)" })()).toThrow(
      "style attribute value",
    );
  });

  test("dispatches DOM events, prevents keypress defaults, and ignores undefined listeners", () => {
    const click = mock(() => {});
    const keypress = mock(() => {});
    const node = m.Button({
      onclick: click,
      onkeypress: keypress,
      onfocus: undefined,
    })();
    node.dispatchEvent(new window.Event("click"));
    const keyEvent = new window.KeyboardEvent("keypress", { cancelable: true });
    node.dispatchEvent(keyEvent);
    expect(click).toHaveBeenCalledTimes(1);
    expect(keypress).toHaveBeenCalledTimes(1);
    expect(keyEvent.defaultPrevented).toBe(true);
    expect(node.hasAttribute("onfocus")).toBe(false);
  });

  test("runs mount callbacks outside build and unmount callbacks child-first", async () => {
    const mounted = mock(() => {});
    window._currentAppPhase = "build";
    m.Div({ onmount: mounted })();
    await tick();
    expect(mounted).not.toHaveBeenCalled();

    window._currentAppPhase = "run";
    const order: string[] = [];
    const child = m.Span({ onunmount: () => order.push("child") });
    const parent = m.Div({
      onmount: mounted,
      onunmount: () => order.push("parent"),
      children: child,
    })();
    document.body.append(parent);
    await tick();
    expect(mounted).toHaveBeenCalledWith(parent);
    parent.remove();
    await tick();
    expect(order).toEqual(["child", "parent"]);
  });

  test("disposes reactive DOM effects when a node unmounts", async () => {
    const title = signal("before");
    const node = m.Div({ title, onunmount: () => {} })();
    document.body.append(node);
    await tick();
    node.remove();
    await tick();
    title.value = "after";
    expect(node.getAttribute("title")).toBe("before");
  });

  test("hydrates build nodes by deterministic ID and removes temporary IDs", () => {
    const getter = m.Div({ class: "server", children: m.Span("hydrated") });
    window._currentAppPhase = "build";
    idGen.resetIdCounter();
    const built = getter();
    expect(built.getAttribute("data-elem-id")).toBe("1");
    document.body.append(built);

    window._currentAppPhase = "mount";
    idGen.resetIdCounter();
    const mounted = getter();
    expect(mounted).toBe(built);
    expect(mounted.hasAttribute("data-elem-id")).toBe(false);
    expect(mounted.firstElementChild?.hasAttribute("data-elem-id")).toBe(false);
  });
});
