import {
  derived,
  val,
  type DerivedSignal,
  type MaybeSignalValue,
} from "@cyftech/signal";
import type { Child } from "../../../index.types.ts";
import { m } from "../m.ts";

type SwitchProps = {
  subject: MaybeSignalValue<string>;
  defaultCase?: Child;
  cases: {
    [x in string]: Child;
  };
};
export type SwitchElement = (props: SwitchProps) => DerivedSignal<Child>;

export const switchElement: SwitchElement = ({
  subject,
  defaultCase,
  cases,
}): DerivedSignal<Child> => {
  const switchCase = derived(() => val(subject));

  return derived(() => {
    const caseKey = switchCase.value;
    return cases[caseKey] || defaultCase || m.Span({ style: "display: none;" });
  });
};
