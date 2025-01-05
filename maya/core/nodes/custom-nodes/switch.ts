import type { Child, CustomNodeSwitch } from "../../../index.types.ts";
import {
  derived,
  valueIsSignal,
  type DerivedSignal,
  type Signal,
} from "@cyftech/signal";
import { m } from "../m.ts";

export const customeNodeSwitch: CustomNodeSwitch = ({
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
    return cases[caseKey]
      ? cases[caseKey]()
      : defaultCase
      ? defaultCase()
      : m.Span({ style: "display: none;" });
  });
};
