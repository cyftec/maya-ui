import {
  getNonSignalObject,
  value,
  valueIsMaybeSignalObject,
  valueIsSignal,
  type MaybeSignalObject,
  type MaybeSignalValue,
  type NonSignal,
  type PlainValue,
  type Signal,
} from "@cyftech/signal";
import type {
  Child,
  Children,
  MHtmlElementGetter,
  NonSignalChild,
  SignalChild,
} from "../index.types";

type InnerCompProps<P extends object> = {
  [K in keyof P]: P[K] extends
    | (Signal<any> | undefined)
    | (((...args: any) => any) | undefined)
    ? P[K]
    : P[K] extends string | string[] | undefined
    ? MaybeSignalObject<P[K]>
    : P[K] extends NonSignal<(Child | NonSignalChild | SignalChild)[]>
    ? PlainValue<P[K]>
    : P[K] extends Children
    ? P[K]
    : MaybeSignalObject<P[K]>;
};
type Props<P extends object> = {
  [K in keyof P]: P[K] extends
    | (Signal<any> | undefined)
    | (((...args: any) => any) | undefined)
    ? P[K]
    : P[K] extends string | string[] | undefined
    ? MaybeSignalValue<P[K]>
    : P[K] extends Children
    ? P[K]
    : MaybeSignalValue<P[K]>;
};

type InnerComp<P extends object> = (p: InnerCompProps<P>) => MHtmlElementGetter;
type Component<P extends object> = (props: Props<P>) => MHtmlElementGetter;

const possiblyNonSignalArrayWithMaybeSignalObjectItem = (input: any) => {
  const val = value(input);
  return (
    Array.isArray(val) &&
    (val as unknown[]).some((v) => valueIsMaybeSignalObject(v))
  );
};
export const component =
  <P extends object>(innerComponent: InnerComp<P>): Component<P> =>
  (props) => {
    for (const key of Object.keys(props)) {
      if (props[key as keyof P] === undefined) delete props[key as keyof P];
    }
    const innerCompProps: InnerCompProps<P> = Object.entries(props).reduce(
      (map, prop) => {
        const [propKey, propValue] = prop as [keyof P, Props<P>[keyof P]];

        const innerPropValue =
          valueIsSignal(propValue) || typeof propValue === "function"
            ? propValue
            : possiblyNonSignalArrayWithMaybeSignalObjectItem(propValue)
            ? value(propValue)
            : getNonSignalObject(value(propValue));
        map[propKey] = innerPropValue as InnerCompProps<P>[keyof P];
        return map;
      },
      {} as InnerCompProps<P>
    );
    return innerComponent(innerCompProps);
  };
