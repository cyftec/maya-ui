import {
  val,
  valueIsSignal,
  type MaybeSignal,
  type MaybeSignalObject,
  type Signal,
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
    ? MaybeSignal<P[K]>
    : P[K] extends Children | undefined
    ? P[K]
    : MaybeSignal<P[K]>;
};

type ArgComp<P extends object> = (p: ArgCompProps<P>) => MHtmlElementGetter;
type Component<P extends object> = (props: Props<P>) => MHtmlElementGetter;

export const component =
  <P extends object>(argComponent: ArgComp<P>): Component<P> =>
  (props) => {
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
            : // string child(ren) will be filtered out other type of Children
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
