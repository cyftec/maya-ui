import {
  derive,
  value,
  valueIsSignal,
  type DerivedSignal,
  type NonNullSignalValue,
  type Signal,
} from "@cyftec/signal";
import type { Children, MHtmlElementGetter } from "../../types";
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
    const truthyComp: TC =
      isTruthy &&
      (unwrap
        ? value(isTruthy(subject as NonNullSignalValue<typeof subject>) as any)
        : isTruthy(subject as NonNullSignalValue<typeof subject>));

    const falsyComp: FC =
      isFalsy && (unwrap ? value(isFalsy(subject) as any) : isFalsy(subject));

    return !!value(subject)
      ? isTruthy
        ? truthyComp
        : deadComponent
      : isFalsy
        ? falsyComp
        : deadComponent;
  };

  return (
    valueIsSignal(subject) ? derive(() => compGetter(true)) : compGetter(false)
  ) as S extends Signal<any>
    ? DerivedSignal<TC | FC | MHtmlElementGetter>
    : TC | FC | MHtmlElementGetter;
};
