import {
  derived,
  valueIsSignal,
  type Signal,
} from "../../../../signal/index.ts";
import type { CustomNodeIf } from "../../../types.ts";
import { m } from "../html-nodes.ts";

export const customeNodeIf: CustomNodeIf = ({ condition, then, otherwise }) => {
  const isTruthy = derived(
    () =>
      !!(valueIsSignal(condition)
        ? (condition as Signal<any>).value
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
