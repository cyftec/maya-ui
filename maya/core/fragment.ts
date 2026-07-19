import {
  getNonSignalObject,
  value,
  valueIsSignal,
  valueIsSignalifiedObject,
  type MaybeSignal,
  type NonSignal,
  type PlainValue,
  type Signal,
  type SignalifiedObject,
} from "@cyftec/signal";
import type {
  Child,
  Children,
  NonSignalChild,
  SignalChild,
} from "../index.types";

type InnerFragmentProps<P extends Record<string, any>> = {
  [K in keyof P]: P[K] extends
    | (Signal<any> | undefined)
    | (((...args: any) => any) | undefined)
    ? P[K]
    : P[K] extends string | string[] | undefined
      ? SignalifiedObject<P[K]>
      : P[K] extends NonSignal<(Child | NonSignalChild | SignalChild)[]>
        ? PlainValue<P[K]>
        : P[K] extends Child[]
          ? MaybeSignal<P[K]>
          : P[K] extends Children
            ? P[K]
            : SignalifiedObject<P[K]>;
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

const arrayWithSignalifiedObjectItems = (input: any) => {
  const val = value(input);
  return (
    Array.isArray(val) &&
    (val as unknown[]).some((v) => valueIsSignalifiedObject(v))
  );
};

export const fragment =
  <P extends Record<string, any>, R extends Children>(
    innerFragment: InnerFragment<P, R>,
  ): Fragment<P, ReturnType<typeof innerFragment>> =>
  (props: Props<P> = {} as Props<P>) => {
    for (const key of Object.keys(props) as Array<keyof P>) {
      if (props[key] === undefined) delete props[key];
    }
    const innerFragmentProps: InnerFragmentProps<P> = Object.entries(
      props,
    ).reduce((map, prop) => {
      const [propKey, propValue] = prop as [keyof P, Props<P>[keyof P]];

      const innerPropValue =
        valueIsSignal(propValue) || typeof propValue === "function"
          ? propValue
          : arrayWithSignalifiedObjectItems(propValue)
            ? value(propValue)
            : getNonSignalObject(value(propValue));
      map[propKey] = innerPropValue as InnerFragmentProps<P>[keyof P];
      return map;
    }, {} as InnerFragmentProps<P>);
    return innerFragment(innerFragmentProps);
  };
