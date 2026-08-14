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
import type { ClassNamesHint, ClassNamesPhrase } from "./utils";

type CssResult<Phrase extends string> = Phrase | DerivedSignal<Phrase>;

// The one inference helper: validate the value of every plain/signal argument.
type ValidPhrases<
  Phrases extends readonly MaybeSignal<ClassNamesHint<ClassNames>>[],
  ClassNames extends string,
> = {
  [Index in keyof Phrases]: MaybeSignal<
    ClassNamesPhrase<Extract<PlainValue<Phrases[Index]>, string>, ClassNames>
  >;
};

type CaseValue<Subject> =
  Subject extends Signal<infer Value>
    ? MaybeSignal<Value>
    : MaybeSignal<Subject>;

type Css<ClassName extends string> = {
  <const Phrases extends readonly MaybeSignal<ClassNamesHint<ClassName>>[]>(
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
};

/**
 * Creates a typed class helper. `when` and `cases` register every declared
 * outcome during a static build; direct signal values register when evaluated.
 */
export const getCss = function <ClassName extends string>() {
  const nocss = ((...phrases: MaybeSignal<string>[]) => {
    const evaluator = () =>
      phrases
        .reduce((array, phrase) => {
          const phraseValue = NoCssRegistry.registerClassName(value(phrase));
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

    return valueIsSignal(truthyCondition) ? derive(evaluator) : evaluator();
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

    return isSignalledInput ? derive(evaluator) : evaluator();
  };

  nocss.when = when as Css<ClassName>["when"];
  nocss.cases = cases as Css<ClassName>["cases"];

  return nocss;
};
