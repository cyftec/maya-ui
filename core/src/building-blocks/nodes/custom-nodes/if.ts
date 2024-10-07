import { derived, valueIsSignal, type Signal } from "@cyftec/signal";
import type { CustomNodeIf } from "../../../types";
import { m } from "../html-nodes";

export const customeNodeIf: CustomNodeIf = ({ condition, then, otherwise }) => {
  const dn = "display: none;";
  const dib = "display: inline-block;";
  const isSignal = valueIsSignal(condition);
  const isTruthy = derived(() =>
    isSignal ? (condition as Signal<any>).value : condition
  );
  const thenStyle = derived(() => (isTruthy.value ? dib : dn));
  const owStyle = derived(() => (isTruthy.value ? dn : dib));

  return [
    m.Div({
      style: thenStyle,
      children: then,
    }),
    m.Div({
      style: owStyle,
      children: otherwise,
    }),
  ];
};
