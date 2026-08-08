import {
  derive,
  value,
  valueIsLiveSignal,
  type DerivedSignal,
  type NonNullSignalValue,
  type LiveSignal,
  type PlainValue,
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
  ) as S extends LiveSignal<any>
    ? DerivedSignal<PlainValue<TC | FC | MayaNodeGetter>>
    : TC | FC | MayaNodeGetter;
};
