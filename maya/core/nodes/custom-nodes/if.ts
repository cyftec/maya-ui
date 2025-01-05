import type { CustomNodeIf } from "../../../index.types.ts";
import { derived, val } from "@cyftech/signal";
import { m } from "../m.ts";

export const customeNodeIf: CustomNodeIf = ({
  condition,
  whenTruthy,
  whenFalsy,
}) => {
  if (!whenTruthy && !whenFalsy)
    throw `Both 'whenTruthy' and 'whenFalsy' are missing. At least one of them should be provided.`;

  const conditionIsTruthy = derived(() => !!val(condition));

  return derived(() =>
    conditionIsTruthy.value
      ? whenTruthy
        ? whenTruthy()
        : m.Span({ style: "display: none;" })
      : whenFalsy
      ? whenFalsy()
      : m.Span({ style: "display: none;" })
  );
};
