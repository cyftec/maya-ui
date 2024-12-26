import {
  derived,
  valueIsSignal,
  type DerivedSignal,
  type Signal,
} from "../../../utils/signal";
import type { Child, SwitchProps } from "../../../index-types.ts";
import { m } from "../m.ts";

export function customeNodeSwitch({
  subject,
  defaultCase,
  cases,
}: SwitchProps): DerivedSignal<Child> {
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
}
