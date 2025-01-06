import {
  derived,
  valueIsSignal,
  type DerivedSignal,
  type MaybeSignal,
  type Signal,
} from "@cyftech/signal";
import type { Child } from "../../../index.types.ts";
import { m } from "../m.ts";

type SwitchProps = {
  subject: MaybeSignal<string>;
  defaultCase?: Child;
  cases: {
    [x in string]: Child;
  };
};
export type SwitchComponent = (props: SwitchProps) => DerivedSignal<Child>;

export const switchComponent: SwitchComponent = ({
  subject,
  defaultCase,
  cases,
}): DerivedSignal<Child> => {
  const switchCase = derived(() =>
    valueIsSignal(subject)
      ? (subject as Signal<string>).value
      : (subject as string)
  );

  return derived(() => {
    const caseKey = switchCase.value;
    return cases[caseKey] || defaultCase || m.Span({ style: "display: none;" });
  });
};
