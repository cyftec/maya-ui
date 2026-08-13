import {
  derive,
  value,
  valueIsSignal,
  type DerivedSignal,
  type MaybeSignal,
  type Signal,
} from "@cyftec/signals";
import { NoCssRegistry, type ClassNamesPhrase } from "./registry";

type NoCssReturnType<T extends string, ClassNamesUnion extends string> =
  | DerivedSignal<ClassNamesPhrase<T, ClassNamesUnion>>
  | ClassNamesPhrase<T, ClassNamesUnion>;

type PhraseValue<Phrase> =
  Phrase extends MaybeSignal<infer Value> ? Extract<Value, string> : never;

type PhraseValues<Phrases extends readonly MaybeSignal<string>[]> = PhraseValue<
  Phrases[number]
>;

type ValidatedPhraseInput<Phrase, ClassNamesUnion extends string> =
  Phrase extends MaybeSignal<infer Value>
    ? [Value] extends [string]
      ? MaybeSignal<ClassNamesPhrase<Value, ClassNamesUnion>>
      : never
    : never;

type ValidatedPhraseInputs<
  Phrases extends readonly MaybeSignal<string>[],
  ClassNamesUnion extends string,
> = {
  [Index in keyof Phrases]: ValidatedPhraseInput<
    Phrases[Index],
    ClassNamesUnion
  >;
};

type NoCssCaseInput<S> =
  S extends Signal<infer V> ? MaybeSignal<V> : MaybeSignal<S>;

type NoCssCases<
  S,
  ClassNamesUnion extends string,
  Cases extends Record<string, unknown>,
> = {
  [ClassNames in keyof Cases]: ClassNames extends string
    ? ClassNames extends ClassNamesPhrase<ClassNames, ClassNamesUnion>
      ? NoCssCaseInput<S>
      : never
    : never;
};

type Css<ClassNamesUnion extends string> = {
  <const Phrases extends readonly MaybeSignal<string>[]>(
    ...phrases: Phrases & ValidatedPhraseInputs<Phrases, ClassNamesUnion>
  ): NoCssReturnType<PhraseValues<Phrases>, ClassNamesUnion>;
  when: <C, const T extends string, const F extends string>(
    truthyCondition: C,
    truhtyClassNames: ClassNamesPhrase<T, ClassNamesUnion>,
    falsyClassNames: ClassNamesPhrase<F, ClassNamesUnion>,
  ) => NoCssReturnType<T | F, ClassNamesUnion>;
  cases: <
    S,
    const Cases extends Record<string, unknown>,
    const D extends string,
  >(
    subject: S,
    cases: Cases & NoCssCases<S, ClassNamesUnion, Cases>,
    defaultCase?: ClassNamesPhrase<D, ClassNamesUnion>,
  ) => NoCssReturnType<Extract<keyof Cases, string> | D, ClassNamesUnion>;
};

export const getCss = function <ClassNamesUnion extends string>() {
  const nocss = ((...phrases: MaybeSignal<string>[]) => {
    const evaluator = () =>
      phrases
        .reduce((array, phrase) => {
          const phraseValue = NoCssRegistry.registerAndReturn(value(phrase));
          const clasNamesArray = phraseValue.split(" ").filter((n) => !!n);
          array.push(...clasNamesArray);
          return array;
        }, [] as string[])
        .join(" ");

    const isSignalledInput = phrases.some((phrase) => valueIsSignal(phrase));
    return isSignalledInput ? derive(evaluator) : evaluator();
  }) as Css<ClassNamesUnion>;

  nocss.when = <C, const T extends string, const F extends string>(
    truthyCondition: C,
    truhtyClassNames: ClassNamesPhrase<T, ClassNamesUnion>,
    falsyClassNames: ClassNamesPhrase<F, ClassNamesUnion>,
  ): NoCssReturnType<T | F, ClassNamesUnion> => {
    const truthyClasses = NoCssRegistry.registerAndReturn<T, ClassNamesUnion>(
      truhtyClassNames,
    );
    const falsyClasses = NoCssRegistry.registerAndReturn<F, ClassNamesUnion>(
      falsyClassNames,
    );
    const evaluator = () =>
      (value(truthyCondition)
        ? truthyClasses
        : falsyClasses) as ClassNamesPhrase<T | F, ClassNamesUnion>;

    return valueIsSignal(truthyCondition) ? derive(evaluator) : evaluator();
  };

  nocss.cases = <
    S,
    const Cases extends Record<string, unknown>,
    const D extends string,
  >(
    subject: S,
    cases: Cases & NoCssCases<S, ClassNamesUnion, Cases>,
    defaultCase?: ClassNamesPhrase<D, ClassNamesUnion>,
  ): NoCssReturnType<Extract<keyof Cases, string> | D, ClassNamesUnion> => {
    type CaseClassNames = Extract<keyof Cases, string>;
    const registeredCases = Object.entries(cases) as [
      CaseClassNames,
      NoCssCaseInput<S>,
    ][];

    registeredCases.forEach(([classNames]) => {
      NoCssRegistry.registerAndReturn<CaseClassNames, ClassNamesUnion>(
        classNames as ClassNamesPhrase<CaseClassNames, ClassNamesUnion>,
      );
    });

    if (defaultCase) {
      NoCssRegistry.registerAndReturn<D, ClassNamesUnion>(defaultCase);
    }

    const evaluator = () => {
      for (const [classNamesPhrase, possibleCase] of registeredCases) {
        if (value(possibleCase) === value(subject)) {
          return classNamesPhrase as ClassNamesPhrase<
            CaseClassNames | D,
            ClassNamesUnion
          >;
        }
      }
      return (defaultCase || "") as ClassNamesPhrase<
        CaseClassNames | D,
        ClassNamesUnion
      >;
    };

    const isSignalledInput =
      valueIsSignal(subject) ||
      registeredCases.some(([, subjectCase]) => valueIsSignal(subjectCase));

    return isSignalledInput ? derive(evaluator) : evaluator();
  };

  return nocss;
};
