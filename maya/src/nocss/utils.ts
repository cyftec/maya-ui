// `keyof` applied directly to a union returns only keys shared by every
// member. The breakpoint maps have no common utility keys, so distribute the
// lookup over each member before collecting its keys.
type KeysOfUnion<T> = T extends T ? keyof T : never;

type ClassNameFromSelector<Selector extends string> =
  Selector extends `${infer ClassName}:${string}` ? ClassName : Selector;

/** Derives HTML atomic class names from every group in a factory map. */
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

/** Combines factory atoms with application atomic overrides. */
export type AppAtomicClassNames<
  BaseAtomicClassNames extends string,
  Overrides extends Record<string, object>,
> = BaseAtomicClassNames | ClassNamesFrom<Overrides>;

/** Combines application atomic and compound names without runtime imports. */
export type AppClassNames<
  AtomicClassNames extends string,
  Overrides extends Record<string, object>,
  CompoundClasses extends ValidCompoundClasses<
    CompoundClasses,
    AppAtomicClassNames<AtomicClassNames, Overrides>
  > = {},
> =
  | AppAtomicClassNames<AtomicClassNames, Overrides>
  | Extract<keyof CompoundClasses, string>;

type ValidCompoundClasses<
  CompoundClasses extends Record<string, string>,
  AtomicClassNames extends string,
> = {
  [Name in keyof CompoundClasses]: Name extends string
    ? Name extends AtomicClassNames
      ? never
      : ValidCompoundClassValue<
            Extract<CompoundClasses[Name], string>,
            AtomicClassNames
          >
    : never;
};

type ValidCompoundClassValue<
  Phrase extends string,
  AtomicClassNames extends string,
> = [InvalidClassName<Phrase, AtomicClassNames>] extends [never]
  ? Phrase extends `${string} ${infer Rest}`
    ? Rest extends ""
      ? never
      : Phrase
    : never
  : never;

/**
 * Defines a typed map from a meaningful UI role to two or more atomic names.
 * The resulting map is passed to getCss(), which expands roles before writing
 * the DOM class attribute or registering names for stylesheet generation.
 */
export const defineCompoundClasses = <AtomicClassNames extends string>() =>
  <const CompoundClasses extends Record<string, string>>(
    compoundClasses: CompoundClasses &
      ValidCompoundClasses<CompoundClasses, AtomicClassNames>,
  ): CompoundClasses => compoundClasses;
