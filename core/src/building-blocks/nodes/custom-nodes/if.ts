import { derived, valueIsSignal, type Signal } from "@cyftec/signal";
import type { CustomNodeIf } from "../../../types";

export const customeNodeIf: CustomNodeIf = ({ condition, then, otherwise }) => {
  const isTruthy = derived(() =>
    valueIsSignal(condition) ? (condition as Signal<any>).value : condition
  );

  return derived(() => (isTruthy.value ? then() : otherwise()));
};
