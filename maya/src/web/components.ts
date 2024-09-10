import { derived, valueIsArrSignal, valueIsSignal } from "@ckzero/maya-signal";
import { htmlTagNames } from "./constants.ts";
import { createEl } from "./core.ts";
import type {
  MayaElement,
  MayaElementProps,
  MayaElementTagName,
  MayaElementsMap,
  MaybeSignalProps,
  MaybeSignalsComponentFn,
  SureSignalProps,
  SureSignalsComponentFn,
} from "./types.ts";

export const m: MayaElementsMap = htmlTagNames.reduce((map, tagName) => {
  const mayaTag = tagName
    .split("")
    .map((char, index) => (!index ? char.toUpperCase() : char))
    .join("") as MayaElementTagName;
  map[mayaTag] = (props: MayaElementProps) => createEl(tagName, props);
  return map;
}, {} as MayaElementsMap);

export function Component<P>(
  comp: SureSignalsComponentFn<P>
): MaybeSignalsComponentFn<P> {
  return function (props: MaybeSignalProps<P>): MayaElement {
    const allProps: SureSignalProps<P> = Object.entries(props).reduce(
      (map, [key, value]) => {
        map[key as keyof P] = (
          valueIsSignal(value) ||
          valueIsArrSignal(value) ||
          typeof value === "function"
            ? value
            : derived(() => value)
        ) as SureSignalProps<P>[keyof P];

        return map;
      },
      {} as SureSignalProps<P>
    );

    return comp(allProps);
  };
}
