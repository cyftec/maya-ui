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

export type ClassNamesHint<ClassName extends string> =
  | ClassName
  | `${string} ${ClassName}`;

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
