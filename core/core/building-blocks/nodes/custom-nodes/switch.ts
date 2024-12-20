import {
  derived,
  valueIsSignal,
  type Signal,
} from "../../../../signal/index.ts";
import type { CustomNodeSwitch } from "../../../types.ts";
import { m } from "../html-nodes.ts";

export const customeNodeSwitch: CustomNodeSwitch = ({
  subject,
  defaultCase,
  cases,
}) => {
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
