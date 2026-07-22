import {
  derive,
  value,
  valueIsSignal,
  type DerivedSignal,
  type NonNullSignalValue,
  type Signal,
} from "@cyftec/signal";
import type { Children, MayaNodeGetter } from "../../types";
import { m } from "../m.ts";

export const ifElement = <S, TC extends Children, FC extends Children>({
  subject,
  isTruthy,
  isFalsy,
}: {
  subject: S;
  isTruthy?: (nonNullSubject: NonNullSignalValue<S>) => TC;
  isFalsy?: (subject: S) => FC;
}) => {
  const deadComponent = m.Span({ style: "display: none;" });
  const compGetter = (unwrap: boolean) => {
    const subjectValue = value(subject);
    if (subjectValue) {
      if (!isTruthy) return deadComponent;
      const truthyComp = isTruthy(
        subject as NonNullSignalValue<typeof subject>,
      );
      return unwrap ? value(truthyComp as any) : truthyComp;
    }

    if (!isFalsy) return deadComponent;
    const falsyComp = isFalsy(subject);
    return unwrap ? value(falsyComp as any) : falsyComp;
  };

  return (
    valueIsSignal(subject) ? derive(() => compGetter(true)) : compGetter(false)
  ) as S extends Signal<any>
    ? DerivedSignal<TC | FC | MayaNodeGetter>
    : TC | FC | MayaNodeGetter;
};
