import {
  derived,
  val,
  type DerivedSignal,
  type MaybeSignalValue,
} from "@cyftech/signal";
import type { Child } from "../../../index.types.ts";
import { m } from "../m.ts";

type IfProps = {
  condition: MaybeSignalValue<any>;
  isTruthy?: Child;
  isFalsy?: Child;
};
export type IfElement = (props: IfProps) => DerivedSignal<Child>;

export const ifElement: IfElement = ({ condition, isTruthy, isFalsy }) => {
  const conditionIsTruthy = derived(() => !!val(condition));

  return derived(
    () =>
      (conditionIsTruthy.value ? isTruthy : isFalsy) ||
      m.Span({ style: "display: none;" })
  );
};
