import {
  deadSignal,
  value,
  valueIsLiveSignal,
  valueIsSignal,
  type DeadSignal,
  type MaybeSignal,
  type PlainValue,
  type Signal,
} from "@cyftec/signal";
import type {
  Child,
  Children,
  DeadSignalChild,
  LiveSignalChild,
} from "./types";

type InnerFragmentProps<P extends Record<string, any>> = {
  [K in keyof P]: P[K] extends
    | (Signal<any> | undefined)
    | (((...args: any) => any) | undefined)
    ? P[K]
    : P[K] extends string | string[] | undefined
      ? Signal<P[K]>
      : P[K] extends DeadSignal<(Child | DeadSignalChild | LiveSignalChild)[]>
        ? PlainValue<P[K]>
        : P[K] extends Child[]
          ? MaybeSignal<P[K]>
          : P[K] extends Children
            ? P[K]
            : Signal<P[K]>;
};
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

export type InnerFragment<P extends Record<string, any>, R> = (
  p: InnerFragmentProps<P>,
) => R;
export type Fragment<P extends Record<string, any>, R> = (props: Props<P>) => R;

const valueIsArrayWithSignalItems = (input: any) => {
  const val = value(input);
  return Array.isArray(val) && (val as unknown[]).some((v) => valueIsSignal(v));
};

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
        valueIsLiveSignal(propValue) || typeof propValue === "function"
          ? propValue
          : valueIsArrayWithSignalItems(propValue)
            ? value(propValue)
            : deadSignal(value(propValue));

      innerFragmentProps[propKey] =
        innerPropValue as InnerFragmentProps<P>[keyof P];
    });

    return innerFragment(innerFragmentProps);
  };

  return outerFragment;
};
