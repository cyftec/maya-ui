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
  whenTruthy?: Child;
  whenFalsy?: Child;
};
export type IfComponent = (props: IfProps) => DerivedSignal<Child>;

export const ifComponent: IfComponent = ({
  condition,
  whenTruthy,
  whenFalsy,
}) => {
  if (!whenTruthy && !whenFalsy)
    throw `Both 'whenTruthy' and 'whenFalsy' are missing. At least one of them should be provided.`;

  const conditionIsTruthy = derived(() => !!val(condition));

  return derived(
    () =>
      (conditionIsTruthy.value ? whenTruthy : whenFalsy) ||
      m.Span({ style: "display: none;" })
  );
};
