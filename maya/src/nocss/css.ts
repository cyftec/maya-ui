import {
  derive,
  value,
  valueIsSignal,
  type DerivedSignal,
  type MaybeSignal,
  type Signal,
} from "@cyftec/signals";
import { NoCssRegistry } from "./registry";
import type { ClassNamesPhrase, InvalidClassName } from "./utils";

type Nullish = null | undefined;

type CssResult<Phrase extends string = string> =
  | (Phrase & ClassNamesPhrase)
  | DerivedSignal<Phrase & ClassNamesPhrase>;

type ClassNameHint<ClassName extends string> = ClassName | (string & {});
type CssInput = MaybeSignal<string | Nullish>;

type UnknownNoCssClassName<ClassName extends string> = {
  readonly __nocssUnknownClassName: `Unknown NoCSS class name: '${ClassName}'`;
};

type PhraseFrom<Input extends CssInput> = Extract<
  Input extends Signal<infer Phrase> ? Phrase : Input,
  string
>;

type Checked<Value, Phrase extends string, ClassName extends string> = [
  InvalidClassName<Phrase, ClassName>,
] extends [never]
  ? Value
  : UnknownNoCssClassName<Extract<InvalidClassName<Phrase, ClassName>, string>>;

type PhraseInput<Phrase extends string, ClassName extends string> = Phrase &
  Checked<Phrase, Phrase, ClassName>;

type CheckedInput<Input extends CssInput, ClassName extends string> =
  Input extends MaybeSignal<ClassNamesPhrase | Nullish>
    ? Input
    : Input extends MaybeSignal<ClassName | Nullish>
      ? Input
      : Checked<Input, PhraseFrom<Input>, ClassName>;

type CheckedInputs<
  Inputs extends readonly CssInput[],
  ClassName extends string,
> = {
  [Index in keyof Inputs]: CheckedInput<Inputs[Index], ClassName>;
};

type CaseValue<Subject> =
  Subject extends Signal<infer Value>
    ? MaybeSignal<Value>
    : MaybeSignal<Subject>;

type CheckedCases<
  Cases extends Record<string, unknown>,
  ClassName extends string,
> = Checked<Cases, Extract<keyof Cases, string>, ClassName>;

type Css<ClassName extends string> = {
  <const AtomicClassName extends ClassName>(
    className: AtomicClassName,
  ): AtomicClassName & ClassNamesPhrase;
  <const Inputs extends readonly CssInput[]>(
    // Validate after inference, preserving the rejected word in the error.
    ...phrases: Inputs &
      ([Inputs] extends [CheckedInputs<Inputs, ClassName>]
        ? unknown
        : CheckedInputs<Inputs, ClassName>)
  ): CssResult;
  when<
    Condition,
    const TruthyPhrase extends ClassNameHint<ClassName>,
    const FalsyPhrase extends ClassNameHint<ClassName>,
  >(
    truthyCondition: Condition,
    truthyClassNames: PhraseInput<TruthyPhrase, ClassName>,
    falsyClassNames: PhraseInput<FalsyPhrase, ClassName>,
  ): CssResult<TruthyPhrase | FalsyPhrase>;
  cases<
    Subject,
    const Cases extends Record<string, CaseValue<Subject>>,
    const DefaultPhrase extends ClassNameHint<ClassName> = "",
  >(
    subject: Subject,
    cases: Cases &
      ([Cases] extends [CheckedCases<Cases, ClassName>]
        ? unknown
        : CheckedCases<Cases, ClassName>),
    defaultCase?: PhraseInput<DefaultPhrase, ClassName>,
  ): CssResult<Extract<keyof Cases, string> | DefaultPhrase | "">;
  ifNullable<
    const NullablePhrase extends CssInput,
    const StaticPhrase extends ClassNameHint<ClassName>,
  >(
    nullableClassNames: NullablePhrase &
      ([NullablePhrase] extends [CheckedInput<NullablePhrase, ClassName>]
        ? unknown
        : CheckedInput<NullablePhrase, ClassName>),
    staticClassNames: PhraseInput<StaticPhrase, ClassName>,
  ): CssResult;
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

    return (
      valueIsSignal(truthyCondition) ? derive(evaluator) : evaluator()
    ) as CssResult<string>;
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

    return (
      isSignalledInput ? derive(evaluator) : evaluator()
    ) as CssResult<string>;
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

    return (
      valueIsSignal(nullableClassNames) ? derive(evaluator) : evaluator()
    ) as CssResult<string>;
  };

  nocss.when = when as Css<ClassName>["when"];
  nocss.cases = cases as Css<ClassName>["cases"];
  nocss.ifNullable = ifNullable as Css<ClassName>["ifNullable"];

  return nocss;
};
