import {
  derived,
  val,
  valueIsSignal,
  type DerivedSignal,
  type Signal,
} from "@cyftech/signal";
import type { Child } from "../../../index.types.ts";
import { m } from "../m.ts";

type IfReturnComponent<C> = C extends Signal<any>
  ? DerivedSignal<Child>
  : Child;

export const ifElement = <C>({
  condition,
  isTruthy,
  isFalsy,
}: {
  condition: C;
  isTruthy?: Child;
  isFalsy?: Child;
}): IfReturnComponent<C> => {
  const deadComponent = m.Span({ style: "display: none;" });
  const compGetter = () =>
    (!!val(condition) ? isTruthy : isFalsy) || deadComponent;

  return (
    valueIsSignal(condition) ? derived(compGetter) : compGetter()
  ) as IfReturnComponent<typeof condition>;
};
