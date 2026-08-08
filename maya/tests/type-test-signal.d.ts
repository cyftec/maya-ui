export type Effect = { dispose: () => void };
export type LiveSignal<T> = { value: T };
export type Signal<T> = { value: T };
export type SourceSignal<T> = Signal<T> & {
  props: () => T extends Record<string, any>
    ? { [K in keyof T]: DerivedSignal<T[K]> }
    : never;
};
export type DerivedSignal<T> = Signal<T>;
export type DeadSignal<T> = { value: T };
export type PlainValue<T> = T;
export type MaybeSignal<T> = T | Signal<T>;
export type NonNullSignalValue<T> = NonNullable<T>;

export const effect: (callback: () => void) => Effect;
export const signal: <T>(initialValue: T) => SourceSignal<T>;
export const derive: <T>(
  callback: (previousValue?: T) => T,
) => DerivedSignal<T>;
export const value: <T>(value: MaybeSignal<T>) => T;
export const valueIsLiveSignal: (
  value: unknown,
) => value is LiveSignal<unknown>;
export const valueIsSignal: (value: unknown) => value is Signal<unknown>;
export const valueIsDeadSignal: (
  value: unknown,
) => value is DeadSignal<unknown>;
export const deadSignal: <T>(value: T) => DeadSignal<T>;
export const promstates: (...args: any[]) => any;
