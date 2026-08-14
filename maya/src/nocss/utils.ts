import type { MaybeSignal } from "@cyftec/signals";

// `keyof` applied directly to a union returns only keys shared by every
// member. The breakpoint maps have no common utility keys, so distribute the
// lookup over each member before collecting its keys.
export type KeysOfUnion<T> = T extends T ? keyof T : never;

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

/**
 * CSS class names validation utility types
 */
type InvalidWords<
  Phrase extends string,
  ClassName extends string,
> = Phrase extends `${infer Word} ${infer Rest}`
  ? Word extends ClassName
    ? InvalidWords<Rest, ClassName>
    : Word
  : Phrase extends ClassName | ""
    ? never
    : Phrase;

/**
 * Keeps known classes in editor completions while accepting a phrase during
 * inference. Validation is performed separately by `InvalidWords`.
 *
 * Avoid constructing `${string} ${ClassName}` here: with the factory map that
 * eagerly materialises thousands of template-literal union members, and the
 * type is subsequently used in generic constraints and `Record` keys.
 */
export type ClassNamesHint<ClassName extends string> =
  | ClassName
  | (string & {});

export type PhraseConstrain<
  Phrase extends string,
  ClassName extends string,
> = ClassNamesHint<ClassName> &
  ([InvalidWords<Phrase, ClassName>] extends [never] ? unknown : never);

/** A space-separated phrase containing only known class names. */
export type ClassNamesPhrase<
  Phrase extends string,
  ClassName extends string,
> = string extends Phrase
  ? never
  : // Keep the broad hint union intact until TypeScript infers the actual phrase.
    ClassNamesHint<ClassName> extends Phrase
    ? Phrase
    : Phrase & PhraseConstrain<Phrase, ClassName>;

/** A public, readable name for narrowing a class-name phrase variable. */
export type CssPhrase<
  Phrase extends string,
  ClassName extends string = string,
> = ClassNamesPhrase<Phrase, ClassName>;

declare const cssPhraseValue: unique symbol;

/** A CSS phrase that has already been validated by a NoCSS helper. */
export type CssPhraseValue = string & {
  readonly [cssPhraseValue]: true;
};

/** A plain or signalled class-name phrase. */
export type CssValue<
  Phrase extends string,
  ClassName extends string = string,
> = MaybeSignal<CssPhrase<Phrase, ClassName>>;

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

/**
 * Combines factory names, app atomic names, and app compound names without
 * importing either map at runtime.
 */
export type AppClassNames<
  BaseClassNames extends string,
  Overrides extends Record<string, object>,
  CompoundClasses extends Record<string, string> = {},
> =
  | BaseClassNames
  | ClassNamesFrom<Overrides>
  | Extract<keyof CompoundClasses, string>;

type ValidCompoundClasses<
  CompoundClasses extends Record<string, string>,
  AtomicClassNames extends string,
> = {
  [Name in keyof CompoundClasses]: CssPhrase<
    Extract<CompoundClasses[Name], string>,
    AtomicClassNames
  >;
};

/**
 * Type-only validation for a compound-class map. It keeps the map out of the
 * browser bundle while ensuring every compound value uses atomic names only.
 */
export type CheckedCompoundClasses<
  CompoundClasses extends ValidCompoundClasses<
    CompoundClasses,
    AtomicClassNames
  >,
  AtomicClassNames extends string,
> = true;
