// `keyof` applied directly to a union returns only keys shared by every
// member. The breakpoint maps have no common utility keys, so distribute the
// lookup over each member before collecting its keys.
export type KeysOfUnion<T> = T extends T ? keyof T : never;

/**
 * CSS class names validation utility types
 */
// 1. Validates the whole sentence. Returns 'never' if ANY word is invalid.
type ValidatePhrase<
  T extends string,
  UnionOfWords extends string,
> = T extends `${infer Word} ${infer Rest}`
  ? Word extends UnionOfWords
    ? `${Word} ${ValidatePhrase<Rest, UnionOfWords>}`
    : never
  : T extends UnionOfWords
    ? T
    : T extends ""
      ? ""
      : never;

// 2. Provides the autocomplete hints at the cursor position
type AutocompletePhrase<
  T extends string,
  UnionOfWords extends string,
> = T extends `${infer Rest} `
  ? `${Rest} ${UnionOfWords}`
  : T extends ""
    ? UnionOfWords
    : `${T} ` | T;

// 3. Combines both: Validates the history, and autocompletes the future
export type PhraseConstrain<T extends string, UnionOfWords extends string> = [
  ValidatePhrase<T, UnionOfWords>,
] extends [never]
  ? "Error: Sentence contains invalid words" // Nice error message for old mistakes
  : AutocompletePhrase<T, UnionOfWords>;
