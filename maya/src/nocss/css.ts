import {
  derive,
  value,
  valueIsSignal,
  type DerivedSignal,
  type MaybeSignal,
  type PlainValue,
  type Signal,
} from "@cyftec/signals";
import { NoCssRegistry } from "./registry";
import type {
  ClassNamesHint,
  ClassNamesPhrase,
  CssPhraseValue,
} from "./utils";

type CssResult<Phrase extends string> =
  | (Phrase & CssPhraseValue)
  | DerivedSignal<Phrase & CssPhraseValue>;

type CssInput<ClassName extends string> =
  | MaybeSignal<ClassNamesHint<ClassName> | null | undefined>
  | MaybeSignal<CssPhraseValue | null | undefined>
  | CssResult<string>;

// The one inference helper: validate the value of every plain/signal argument.
type ValidPhrases<
  Phrases extends readonly CssInput<ClassNames>[],
  ClassNames extends string,
> = {
  [Index in keyof Phrases]: Phrases[Index] extends CssResult<string>
    ? Phrases[Index]
    : Phrases[Index] extends MaybeSignal<ClassNames | null | undefined>
      ? Phrases[Index]
    : Phrases[Index] extends MaybeSignal<
          CssPhraseValue | null | undefined
        >
      ? Phrases[Index]
      : MaybeSignal<
          | ClassNamesPhrase<
              Extract<PlainValue<Phrases[Index]>, string>,
              ClassNames
            >
          | null
          | undefined
        >;
};

type ValidNullablePhrase<
  ClassName extends string,
  NullablePhrase extends MaybeSignal<
    ClassNamesHint<ClassName> | null | undefined
  >,
> = MaybeSignal<
  | Extract<PlainValue<NullablePhrase>, null | undefined>
  | ClassNamesPhrase<Extract<PlainValue<NullablePhrase>, string>, ClassName>
>;

type CaseValue<Subject> =
  Subject extends Signal<infer Value>
    ? MaybeSignal<Value>
    : MaybeSignal<Subject>;

type Css<ClassName extends string> = {
  <const Phrases extends readonly CssInput<ClassName>[]>(
    // The conditional runs after inference, so one bad argument cannot hide
    // behind the valid arguments in the tuple.
    ...phrases: Phrases &
      ([Phrases] extends [ValidPhrases<Phrases, ClassName>] ? unknown : never)
  ): CssResult<string>;
  when<
    Condition,
    const TruthyPhrase extends ClassNamesHint<ClassName>,
    const FalsyPhrase extends ClassNamesHint<ClassName>,
  >(
    truthyCondition: Condition,
    truthyClassNames: ClassNamesPhrase<TruthyPhrase, ClassName>,
    falsyClassNames: ClassNamesPhrase<FalsyPhrase, ClassName>,
  ): CssResult<TruthyPhrase | FalsyPhrase>;
  cases<
    Subject,
    const Phrase extends ClassNamesHint<ClassName>,
    const DefaultPhrase extends ClassNamesHint<ClassName>,
  >(
    subject: Subject,
    cases: {
      [Key in Phrase]: Key extends ClassNamesPhrase<Key, ClassName>
        ? CaseValue<Subject>
        : never;
    } & Partial<Record<ClassNamesHint<ClassName>, CaseValue<Subject>>>,
    defaultCase?: ClassNamesPhrase<DefaultPhrase, ClassName>,
  ): CssResult<Phrase | DefaultPhrase | "">;
  ifNullable<const StaticPhrase extends ClassNamesHint<ClassName>>(
    nullableClassNames: MaybeSignal<CssPhraseValue | null | undefined>,
    staticClassNames: ClassNamesPhrase<StaticPhrase, ClassName>,
  ): CssResult<CssPhraseValue>;
  ifNullable<const StaticPhrase extends ClassNamesHint<ClassName>>(
    nullableClassNames: MaybeSignal<ClassName | null | undefined>,
    staticClassNames: ClassNamesPhrase<StaticPhrase, ClassName>,
  ): CssResult<CssPhraseValue>;
  ifNullable<
    const NullablePhrase extends MaybeSignal<
      ClassNamesHint<ClassName> | null | undefined
    >,
    const StaticPhrase extends ClassNamesHint<ClassName>,
  >(
    nullableClassNames: NullablePhrase &
      ([NullablePhrase] extends [
        ValidNullablePhrase<ClassName, NullablePhrase>,
      ]
        ? unknown
        : never),
    staticClassNames: ClassNamesPhrase<StaticPhrase, ClassName>,
  ): CssResult<CssPhraseValue>;
};

/**
 * Creates a typed class helper. `when` and `cases` register every declared
 * outcome during a static build; direct signal values register when evaluated.
 */
export const getCss = function <ClassName extends string>() {
  const nocss = ((...phrases: MaybeSignal<string | null | undefined>[]) => {
    const evaluator = () =>
      phrases
        .reduce((array, phrase) => {
          const plainPhrase = value(phrase) as string | null | undefined;
          if (plainPhrase === null || plainPhrase === undefined) return array;
          const phraseValue = NoCssRegistry.registerClassName(plainPhrase);
          const clasNamesArray = phraseValue.split(" ").filter((n) => !!n);
          array.push(...clasNamesArray);
          return array;
        }, [] as string[])
        .join(" ");

    const isSignalledInput = phrases.some((phrase) => valueIsSignal(phrase));
    return isSignalledInput ? derive(evaluator) : evaluator();
  }) as Css<ClassName>;

  const when = <Condition>(
    truthyCondition: Condition,
    truthyClassNames: string,
    falsyClassNames: string,
  ): CssResult<string> => {
    const truthyClasses = NoCssRegistry.registerClassName(truthyClassNames);
    const falsyClasses = NoCssRegistry.registerClassName(falsyClassNames);
    const evaluator = () =>
      value(truthyCondition) ? truthyClasses : falsyClasses;

    return (valueIsSignal(truthyCondition)
      ? derive(evaluator)
      : evaluator()) as CssResult<string>;
  };

  const cases = <Subject>(
    subject: Subject,
    cases: Record<string, CaseValue<Subject>>,
    defaultCase?: string,
  ): CssResult<string> => {
    const registeredCases = Object.entries(cases) as [
      string,
      CaseValue<Subject>,
    ][];

    registeredCases.forEach(([classNames]) => {
      NoCssRegistry.registerClassName(classNames);
    });

    if (defaultCase) {
      NoCssRegistry.registerClassName(defaultCase);
    }

    const evaluator = () => {
      for (const [classNamesPhrase, possibleCase] of registeredCases) {
        if (value(possibleCase) === value(subject)) {
          return classNamesPhrase;
        }
      }
      return defaultCase || "";
    };

    const isSignalledInput =
      valueIsSignal(subject) ||
      registeredCases.some(([, subjectCase]) => valueIsSignal(subjectCase));

    return (isSignalledInput ? derive(evaluator) : evaluator()) as CssResult<string>;
  };

  const ifNullable = <NullablePhrase extends string | null | undefined>(
    nullableClassNames: MaybeSignal<NullablePhrase>,
    staticClassNames: string,
  ): CssResult<string> => {
    const registeredStaticClasses =
      NoCssRegistry.registerClassName(staticClassNames);
    const evaluator = () => {
      const nullableClasses = value(nullableClassNames);
      return nullableClasses === null || nullableClasses === undefined
        ? registeredStaticClasses
        : NoCssRegistry.registerClassName(nullableClasses);
    };

    return (valueIsSignal(nullableClassNames)
      ? derive(evaluator)
      : evaluator()) as CssResult<string>;
  };

  nocss.when = when as Css<ClassName>["when"];
  nocss.cases = cases as Css<ClassName>["cases"];
  nocss.ifNullable = ifNullable as Css<ClassName>["ifNullable"];

  return nocss;
};
