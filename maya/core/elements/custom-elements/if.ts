import {
  derive,
  value,
  valueIsSignal,
  type DerivedSignal,
  type Signal,
} from "@cyftech/signal";
import type { Child } from "../../../index.types.ts";
import { m } from "../m.ts";

type IfReturn<Subject> = Subject extends Signal<any>
  ? DerivedSignal<NonNullable<Child>>
  : NonNullable<Child>;

export type IfElement = <S>(props: {
  subject: S;
  isTruthy?: Child;
  isFalsy?: Child;
}) => IfReturn<S>;

export const ifElement: IfElement = ({ subject, isTruthy, isFalsy }) => {
  const deadComponent = m.Span({ style: "display: none;" });
  const compGetter = () =>
    (!!value(subject) ? isTruthy : isFalsy) || deadComponent;

  return (
    valueIsSignal(subject) ? derive(compGetter) : compGetter()
  ) as IfReturn<typeof subject>;
};
