import {
  derive,
  value,
  valueIsLiveSignal,
  type DerivedSignal,
  type LiveSignal,
  type NonNullSignalValue,
} from "@cyftec/signal";
import type { MayaNodeGetter } from "../../types";
import { m } from "../m.ts";

type FilterUnknown<T> = T extends unknown
  ? unknown extends T
    ? never
    : T
  : never;

// Prevent an enclosing `children` context from widening a branch's result.
type NoContext<T> = [T] extends [infer Result] ? Result : never;

type IfReturn<S, TC, FC> =
  S extends LiveSignal<any>
    ? DerivedSignal<FilterUnknown<TC | FC | MayaNodeGetter>>
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
    valueIsLiveSignal(subject)
      ? derive(() => compGetter(true))
      : compGetter(false)
  ) as IfReturn<S, NoContext<TC>, NoContext<FC>>;
}
