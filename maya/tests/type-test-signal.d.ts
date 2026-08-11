export type Receiver = {
  readonly id: number;
  readonly run: () => void;
  readonly dispose: () => void;
};

export type SignalType = "source-signal" | "derived-signal";

export type BaseSourceSignal<T> = {
  readonly type: SignalType;
  readonly id: number;
  readonly prevValue: T | undefined;
  readonly nonReactiveValue: T;
  value: T;
  mutateWith(mutatedSignalEvaluator: (old: T) => T): void;
};

export type BaseDerivedSignal<T> = {
  readonly type: SignalType;
  readonly prevValue: T | undefined;
  readonly nonReactiveValue: T;
  readonly value: T;
  readonly dispose: () => void;
};

type ObjectSignalMethods<T> = T extends Record<string, any>
  ? { props: () => { [K in keyof T]: DerivedSignal<T[K]> } }
  : {};

export type SourceSignal<T> = BaseSourceSignal<T> & ObjectSignalMethods<T>;
export type DerivedSignal<T> = BaseDerivedSignal<T> & ObjectSignalMethods<T>;
export type Signal<T> = SourceSignal<T> | DerivedSignal<T>;
export type MaybeSignal<T> = T | Signal<T>;
export type PlainValue<I extends MaybeSignal<unknown>> =
  I extends Signal<infer T> ? T : I;
export type NonNullSignalValue<S> = S extends SourceSignal<infer T>
  ? SourceSignal<NonNullable<T>>
  : S extends DerivedSignal<infer T>
    ? DerivedSignal<NonNullable<T>>
    : NonNullable<S>;

export const effect: (callback: () => void) => Receiver;
export const signal: <T>(
  initialValue: T,
  nonNullInitialValue?: NonNullable<T>,
) => SourceSignal<T>;
export const derive: <T>(
  callback: (previousValue: T | undefined) => T,
  nonNullInitialValue?: NonNullable<T>,
) => DerivedSignal<T>;
export const deadZone: <T>(callback: () => T) => T;
export function value<T>(input: MaybeSignal<T>): T;
export function value<I>(input: I): PlainValue<I>;
export const valueIsSignal: (input: MaybeSignal<any>) => boolean;
export const promstates: <R, Args extends any[], I>(
  promiseFn: (...args: Args) => Promise<R>,
  initialValue?: I,
  ultimately?: () => void,
) => readonly [
  (...args: Args) => Promise<void>,
  DerivedSignal<unknown extends I ? R | undefined : R | I>,
  DerivedSignal<Error | undefined>,
  DerivedSignal<boolean>,
];
