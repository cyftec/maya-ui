import {
  derived,
  val,
  type DerivedSignal,
  type MaybeSignal,
} from "@cyftech/signal";
import type { Child } from "../../../index.types.ts";
import { m } from "../m.ts";

type IfProps = {
  condition: MaybeSignal<any>;
  isTruthy?: Child;
  isFalsy?: Child;
};
export type IfElement = (props: IfProps) => DerivedSignal<Child>;

export const ifElement: IfElement = ({ condition, isTruthy, isFalsy }) => {
  if (!isTruthy && !isFalsy)
    throw `Both 'isTruthy' and 'isFalsy' are missing. At least one of them should be provided.`;

  const conditionIsTruthy = derived(() => !!val(condition));

  return derived(
    () =>
      (conditionIsTruthy.value ? isTruthy : isFalsy) ||
      m.Span({ style: "display: none;" })
  );
};
