import {
  derive,
  value,
  valueIsSignal,
  type DerivedSignal,
  type Signal,
} from "@cyftech/signal";
import type { Child } from "../../../index.types.ts";
import { m } from "../m.ts";

type SwitchReturn<Subject> = Subject extends Signal<any>
  ? DerivedSignal<NonNullable<Child>>
  : NonNullable<Child>;

export type SwitchElement = <S>(props: {
  subject: S;
  caseMatcher?: (subject: S, matchingCase: string) => boolean;
  defaultCase?: Child;
  cases: {
    [x in string]: Child;
  };
}) => SwitchReturn<S>;

export const switchElement: SwitchElement = ({
  subject,
  caseMatcher,
  defaultCase,
  cases,
}): SwitchReturn<typeof subject> => {
  const switchReturnGetter = () => {
    const subjectValue = value(subject);
    let component: Child = undefined;
    for (const [key, comp] of Object.entries(cases)) {
      if ((caseMatcher && caseMatcher(subject, key)) || subjectValue === key) {
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
