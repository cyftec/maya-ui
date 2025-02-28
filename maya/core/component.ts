import {
  val,
  valueIsSignal,
  type MaybeSignalObject,
  type Signal,
  type MaybeSignalValue,
} from "@cyftech/signal";
import type { Children, MHtmlElementGetter } from "../index.types";
import { validChildren } from "../utils";

type ArgCompProps<P extends object> = {
  [K in keyof P]: P[K] extends
    | (Signal<any> | undefined)
    | (((...args: any) => any) | undefined)
    ? P[K]
    : P[K] extends string | string[] | undefined
    ? MaybeSignalObject<P[K]>
    : P[K] extends Children | undefined
    ? P[K]
    : MaybeSignalObject<P[K]>;
};
type Props<P extends object> = {
  [K in keyof P]: P[K] extends
    | Signal<any>
    | (((...args: any) => any) | undefined)
    ? P[K]
    : P[K] extends string | string[] | undefined
    ? MaybeSignalValue<P[K]>
    : P[K] extends Children | undefined
    ? P[K]
    : MaybeSignalValue<P[K]>;
};

type ArgComp<P extends object> = (p: ArgCompProps<P>) => MHtmlElementGetter;
type Component<P extends object> = (props: Props<P>) => MHtmlElementGetter;

export const component =
  <P extends object>(argComponent: ArgComp<P>): Component<P> =>
  (props) => {
    for (const key of Object.keys(props)) {
      if (props[key as keyof P] === undefined) delete props[key as keyof P];
    }
    const argCompProps: ArgCompProps<P> = Object.entries(props).reduce(
      (map, prop) => {
        const [propKey, propValue] = prop as [keyof P, Props<P>[keyof P]];

        const isPossiblyStringChild = typeof propValue === "string";
        const isPossiblyStringArrayChildren =
          Array.isArray(propValue) &&
          propValue.every((v) => typeof v === "string");

        const internalPropValue =
          valueIsSignal(propValue) || typeof propValue === "function"
            ? propValue
            : isPossiblyStringChild || isPossiblyStringArrayChildren
            ? {
                type: "non-signal",
                get value() {
                  return val(propValue);
                },
              }
            : // string child(ren) will be filtered out from other type of Children
            validChildren(propValue)
            ? propValue
            : {
                type: "non-signal",
                get value() {
                  return val(propValue);
                },
              };
        map[propKey] = internalPropValue as ArgCompProps<P>[keyof P];
        return map;
      },
      {} as ArgCompProps<P>
    );
    return argComponent(argCompProps);
  };
