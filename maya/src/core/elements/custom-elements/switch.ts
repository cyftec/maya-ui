import {
  derive,
  value,
  valueIsSignal,
  type DerivedSignal,
  type MaybeSignal,
  type Signal,
} from "@cyftec/signal";
import type { Children } from "../../types.ts";
import { m } from "../m.ts";

type SwitchReturn<Subject, C extends Children> =
  Subject extends Signal<unknown> ? DerivedSignal<C> : NonNullable<C>;

type SubjectValue<S extends MaybeSignal<string | number | boolean>> =
  S extends MaybeSignal<string>
    ? string
    : S extends MaybeSignal<number>
      ? number
      : S extends MaybeSignal<boolean>
        ? boolean
        : never;

export const switchElement = <
  S extends MaybeSignal<string | number | boolean>,
  C extends Children,
>({
  subject,
  caseMatcher,
  defaultCase,
  cases,
}: {
  subject: S;
  caseMatcher?: (
    subjectValue: SubjectValue<S>,
    matchingCase: string,
  ) => boolean;
  defaultCase?: () => C;
  cases?: MaybeSignal<{ [x in string]: () => C }>;
}): SwitchReturn<typeof subject, C> => {
  const deadComponent = m.Span({ style: "display: none;" });
  const defaultCaseComponent = defaultCase && defaultCase();

  const switchReturnGetter = (unwrap: boolean) => {
    const subjectValue = value(subject) as SubjectValue<typeof subject>;
    const casesValue = value(cases);
    let component: C = undefined as C;

    for (const [currentCaseKey, comp] of Object.entries(casesValue || {})) {
      const matchWithCaseMatcher =
        caseMatcher && caseMatcher(subjectValue, currentCaseKey);
      const normalCaseMatch = `${subjectValue}` === currentCaseKey;

      if (matchWithCaseMatcher || normalCaseMatch) {
        component = unwrap ? (value(comp() as any) as C) : comp();
        break;
      }
    }
    return component || defaultCaseComponent || deadComponent;
  };

  return (
    valueIsSignal(subject)
      ? derive(() => switchReturnGetter(true))
      : switchReturnGetter(false)
  ) as SwitchReturn<typeof subject, C>;
};
