import {
  derive,
  value,
  valueIsSignal,
  type DerivedSignal,
  type Signal,
  type NonNullSignalValue,
} from "@cyftec/signals";
import type {
  FilterUnknown,
  MayaNodeGetter,
  NoContext,
  UnwrapSignal,
} from "../../types";
import { m } from "../m.ts";

type IfReturn<S, TC, FC> =
  S extends Signal<any>
    ? DerivedSignal<FilterUnknown<UnwrapSignal<TC> | UnwrapSignal<FC> | MayaNodeGetter>>
    : FilterUnknown<TC | FC | MayaNodeGetter>;

export function ifElement<S, TC, FC>({
  subject,
  isTruthy,
  isFalsy,
}: {
  subject: S;
  isTruthy?: (nonNullSubject: NonNullSignalValue<S>) => TC;
  isFalsy?: (subject: S) => FC;
}): IfReturn<S, NoContext<TC>, NoContext<FC>> {
  const deadComponent = m.Span({ style: "display: none;" });
  const compGetter = (plainValue: boolean) => {
    const subjectValue = value(subject);
    if (subjectValue) {
      if (!isTruthy) return deadComponent;
      const truthyComp = isTruthy(
        subject as NonNullSignalValue<typeof subject>,
      );
      return plainValue ? value(truthyComp as any) : truthyComp;
    }

    if (!isFalsy) return deadComponent;
    const falsyComp = isFalsy(subject);
    return plainValue ? value(falsyComp as any) : falsyComp;
  };

  return (
    valueIsSignal(subject) ? derive(() => compGetter(true)) : compGetter(false)
  ) as IfReturn<S, NoContext<TC>, NoContext<FC>>;
}
