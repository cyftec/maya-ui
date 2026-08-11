import {
  derive,
  value,
  valueIsSignal,
  type MaybeSignal,
  type Signal,
} from "@cyftec/signals";
import type { Child, Children } from "./types";
import { validArrayOfChildOrChildSignal } from "./utils";

type Props<P extends Record<string, any>> = {
  [K in keyof P]: P[K] extends
    | (Signal<any> | undefined)
    | (((...args: any) => any) | undefined)
    ? P[K]
    : P[K] extends string | string[] | undefined
      ? MaybeSignal<P[K]>
      : P[K] extends Children
        ? P[K]
        : MaybeSignal<P[K]>;
};
type InnerFragmentProps<P extends Record<string, any>> = {
  [K in keyof P]: P[K] extends
    | (Signal<any> | undefined)
    | (((...args: any) => any) | undefined)
    ? P[K]
    : P[K] extends string | string[] | undefined
      ? Signal<P[K]>
      : P[K] extends Child[]
        ? MaybeSignal<P[K]>
        : P[K] extends Children
          ? P[K]
          : Signal<P[K]>;
};

export type Fragment<P extends Record<string, any>, R> = (props: Props<P>) => R;
export type InnerFragment<P extends Record<string, any>, R> = (
  p: InnerFragmentProps<P>,
) => R;

export const fragment = <P extends Record<string, any>, R extends Children>(
  innerFragment: InnerFragment<P, R>,
): Fragment<P, ReturnType<typeof innerFragment>> => {
  const outerFragment = (props: Props<P> = {} as Props<P>) => {
    const innerFragmentProps = {} as InnerFragmentProps<P>;

    for (const key of Object.keys(props) as Array<keyof P>) {
      if (props[key] === undefined) delete props[key];
    }

    Object.entries(props).forEach((prop) => {
      const [propKey, propValue] = prop as [keyof P, Props<P>[keyof P]];

      const innerPropValue =
        valueIsSignal(propValue) ||
        typeof propValue === "function" ||
        validArrayOfChildOrChildSignal(propValue)
          ? propValue
          : derive(() => value(propValue));

      innerFragmentProps[propKey] =
        innerPropValue as InnerFragmentProps<P>[keyof P];
    });

    return innerFragment(innerFragmentProps);
  };

  return outerFragment;
};
