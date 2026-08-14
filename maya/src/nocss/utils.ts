// `keyof` applied directly to a union returns only keys shared by every
// member. The breakpoint maps have no common utility keys, so distribute the
// lookup over each member before collecting its keys.
type KeysOfUnion<T> = T extends T ? keyof T : never;

type ClassNameFromSelector<Selector extends string> =
  Selector extends `${infer ClassName}:${string}` ? ClassName : Selector;

/** Derives HTML class names from every group in an factory-classes map. */
export type ClassNamesFrom<FactoryClasses extends Record<string, object>> =
  Exclude<
    ClassNameFromSelector<
      Extract<KeysOfUnion<FactoryClasses[keyof FactoryClasses]>, string>
    >,
    "constraints"
  >;

/** Returns the first word in a phrase that is not a configured class. */
export type InvalidClassName<
  Phrase extends string,
  ClassName extends string,
> = Phrase extends `${infer Word} ${infer Rest}`
  ? Word extends ClassName
    ? InvalidClassName<Rest, ClassName>
    : Word
  : Phrase extends ClassName | ""
    ? never
    : Phrase;

declare const cssPhraseValue: unique symbol;

/** A CSS phrase that has already been validated by a NoCSS helper. */
export type ClassNamesPhrase = string & {
  readonly [cssPhraseValue]: true;
};

export type AtomicClassGroup = "default" | "ns" | "m" | "l";

/** App CSS may replace factory rules and add application-specific rules. */
export type AtomicClassOverrides = Partial<
  Record<AtomicClassGroup, Record<string, string>>
>;

export type MediaConstraints = {
  ns: { minWidth: string };
  m: { minWidth: string; maxWidth: string };
  l: { minWidth: string };
};

/** Each override is merged with the corresponding factory breakpoint. */
export type MediaConstraintsOverrides = Partial<{
  [Group in keyof MediaConstraints]: Partial<MediaConstraints[Group]>;
}>;

/** Combines factory, override, and compound names without runtime imports. */
export type AppClassNames<
  BaseClassNames extends string,
  Overrides extends Record<string, object>,
  CompoundClasses extends ValidCompoundClasses<
    CompoundClasses,
    BaseClassNames | ClassNamesFrom<Overrides>
  > = {},
> =
  | BaseClassNames
  | ClassNamesFrom<Overrides>
  | Extract<keyof CompoundClasses, string>;

type ValidCompoundClasses<
  CompoundClasses extends Record<string, string>,
  AtomicClassNames extends string,
> = {
  [Name in keyof CompoundClasses]: [
    InvalidClassName<Extract<CompoundClasses[Name], string>, AtomicClassNames>,
  ] extends [never]
    ? Extract<CompoundClasses[Name], string>
    : never;
};
