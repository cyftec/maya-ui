export type SignalsEffect = { dispose: () => void };
export type Signal<T> = { value: T };
export type SourceSignal<T> = Signal<T>;
export type DerivedSignal<T> = Signal<T>;
export type SignalifiedObject<T> = Signal<T>;
export type NonSignal<T> = { value: T };
export type PlainValue<T> = T;
export type MaybeSignal<T> = T | Signal<T>;
export type NonNullSignalValue<T> = NonNullable<T>;

export const effect: (callback: () => void) => SignalsEffect;
export const signal: <T>(initialValue: T) => SourceSignal<T>;
export const derive: <T>(
  callback: (previousValue?: T) => T,
) => DerivedSignal<T>;
export const value: <T>(value: MaybeSignal<T>) => T;
export const valueIsSignal: (value: unknown) => value is Signal<unknown>;
export const valueIsSignalifiedObject: (
  value: unknown,
) => value is SignalifiedObject<unknown>;
export const valueIsNonSignalObject: (
  value: unknown,
) => value is NonSignal<unknown>;
export const getNonSignalObject: <T>(value: T) => NonSignal<T>;
export const promstates: (...args: any[]) => any;
