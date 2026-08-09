import { signal, type DerivedSignal } from "@cyftec/signal";
import { m } from "../src/core/elements/m.ts";
import type { MayaNodeGetter } from "../src/core/types.ts";

type Equal<Left, Right> =
  (<T>() => T extends Left ? 1 : 2) extends
  (<T>() => T extends Right ? 1 : 2)
    ? true
    : false;
type Assert<T extends true> = T;

const ifStandalone = m.If({
  subject: signal(true),
  isTruthy: () => m.Span("shown"),
});
export type IfStandaloneIsDerivedNode = Assert<
  Equal<typeof ifStandalone, DerivedSignal<MayaNodeGetter>>
>;

// The enclosing `children` type must not widen m.If's branch result.
m.Div({
  children: m.If({
    subject: signal(true),
    isTruthy: () => m.Span("shown"),
  }),
});

const switchStandalone = m.Switch({
  subject: signal("shown"),
  cases: { shown: () => m.Span("shown") },
});
export type SwitchStandaloneIsDerivedNode = Assert<
  Equal<typeof switchStandalone, DerivedSignal<MayaNodeGetter>>
>;

// Switch has the same contextual-inference boundary as If.
m.Div({
  children: m.Switch({
    subject: signal("shown"),
    cases: { shown: () => m.Span("shown") },
  }),
});

const switchFallback = m.Switch({ subject: signal("missing") });
export type SwitchFallbackIsDerivedNode = Assert<
  Equal<typeof switchFallback, DerivedSignal<MayaNodeGetter>>
>;

m.Div({ children: m.Switch({ subject: signal("missing") }) });
