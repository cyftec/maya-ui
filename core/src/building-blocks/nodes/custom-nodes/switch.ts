import { derived, valueIsSignal, type Signal } from "@cyftec/signal";
import type { CustomNodeSwitch, SwitchCase } from "../../../types";
import { m } from "../html-nodes";

export const customeNodeSwitch: CustomNodeSwitch = ({
  subject,
  defaultCase,
  cases,
}) => {
  const dn = "display: none;";
  const dib = "display: inline-block;";
  const isSignal = valueIsSignal(subject);
  const switchCase = derived(() =>
    (isSignal ? (subject as Signal<SwitchCase>).value : subject).toString()
  );
  const caseEntries = Object.entries(cases);
  const caseKeys = caseEntries.map(([key, _]) => key);
  const isDefaultCase = derived(
    () => defaultCase && !caseKeys.includes(switchCase.value)
  );
  const defaultCaseStyle = derived(() => (isDefaultCase.value ? dib : dn));
  const matchStyle = (match: SwitchCase) =>
    derived(() => (switchCase.value === match ? dib : dn));

  return [
    ...m.If({
      condition: isDefaultCase,
      then: m.Span({
        style: defaultCaseStyle,
        children: defaultCase,
      }),
      otherwise: m.Span({ class: dn }),
    }),
    ...caseEntries.map(([match, node]) => {
      return m.Div({
        style: matchStyle(match),
        children: node,
      });
    }),
  ];
};
