import { derived, valueIsSignal, type Signal } from "../../../utils/signal";
import type { CustomNodeIf } from "../../../index-types.ts";
import { m } from "../m.ts";

export const customeNodeIf: CustomNodeIf = ({ condition, then, otherwise }) => {
  const isTruthy = derived(
    () =>
      !!(valueIsSignal(condition)
        ? (condition as Signal<unknown>).value
        : condition)
  );

  return derived(() =>
    isTruthy.value
      ? then()
      : otherwise
      ? otherwise()
      : m.Span({ style: "display: none;" })
  );
};
