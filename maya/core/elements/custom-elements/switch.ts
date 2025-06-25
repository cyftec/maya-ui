import {
  derive,
  value,
  valueIsSignal,
  type DerivedSignal,
  type MaybeSignalValue,
  type Signal,
} from "@cyftech/signal";
import type { Child } from "../../../index.types.ts";
import { m } from "../m.ts";

type SwitchReturn<Subject> = Subject extends Signal<any>
  ? DerivedSignal<NonNullable<Child>>
  : NonNullable<Child>;

type SubjectValue<S extends MaybeSignalValue<string | number>> =
  S extends MaybeSignalValue<number>
    ? number
    : S extends MaybeSignalValue<string>
    ? string
    : never;

export type SwitchElement = <
  S extends MaybeSignalValue<string | number>
>(props: {
  subject: S;
  caseMatcher?: (
    subjectValue: SubjectValue<S>,
    matchingCase: string
  ) => boolean;
  defaultCase?: Child;
  cases:
    | MaybeSignalValue<{ [x in string]: Child }>
    | (S extends MaybeSignalValue<number> ? MaybeSignalValue<Child[]> : never);
}) => SwitchReturn<S>;

export const switchElement: SwitchElement = ({
  subject,
  caseMatcher,
  defaultCase,
  cases,
}): SwitchReturn<typeof subject> => {
  const switchReturnGetter = () => {
    const subjectValue = value(subject) as SubjectValue<typeof subject>;
    const casesValue = value(cases);
    let component: Child = undefined;

    for (const [currentCaseKey, comp] of Object.entries(casesValue)) {
      const matchWithCaseMatcher =
        caseMatcher && caseMatcher(subjectValue, currentCaseKey);
      const normalCaseMatch = `${subjectValue}` === currentCaseKey;

      if (matchWithCaseMatcher || normalCaseMatch) {
        component = comp;
        break;
      }
    }
    return component || defaultCase || m.Span({ style: "display: none;" });
  };

  return (
    valueIsSignal(subject) ? derive(switchReturnGetter) : switchReturnGetter()
  ) as SwitchReturn<typeof subject>;
};
