import { signal } from "@cyftec/signals";
import { component, m } from "../src/core";
import { getCss } from "../src/nocss/css";
import type {
  AppClassNames,
  AtomicClassOverrides,
  BaseClassName,
  CheckedCompoundClasses,
  CssPhrase,
  CssPhraseValue,
  CssValue,
} from "../src/nocss/index";

const overriddenBaseClasses = {
  default: { theme: "", "bg-theme": "" },
} as const satisfies AtomicClassOverrides;

type AtomicClassName = AppClassNames<
  BaseClassName,
  typeof overriddenBaseClasses
>;

const compoundClasses = {
  card: "bg-theme pa2 b--light-silver br4",
} as const;

type CompoundClassesAreValid = CheckedCompoundClasses<
  typeof compoundClasses,
  AtomicClassName
>;
const compoundClassesAreValid: CompoundClassesAreValid = true;
void compoundClassesAreValid;

type AppClassName = AppClassNames<
  BaseClassName,
  typeof overriddenBaseClasses,
  typeof compoundClasses
>;

const css = getCss<AppClassName>();

css("pa2 bg-theme");
css("pointer hover-bg-washed-yellow");
css("card");
css.when(true, "bg-theme", "bg-yellow");
css.cases(
  "enabled" as "enabled" | "disabled",
  {
    "bg-theme": "enabled",
    "bg-yellow": "disabled",
  },
  "card",
);
css.ifNullable(signal<"bg-theme" | null>(null), "bg-yellow");
css.ifNullable("bg-theme" as "bg-theme" | undefined, "bg-yellow");
css.ifNullable("red" as "red" | undefined, "bg-green white");

declare const appClassName: AppClassName | undefined;
css.ifNullable(appClassName, "bg-yellow");

declare const validatedColor: CssPhraseValue;
css.ifNullable(validatedColor, "card");

const ColorButton = component<{
  classNames?: CssPhraseValue;
  color?: AppClassName;
}>(({ classNames, color }) =>
  m.Button({
    class: css(
      "pa2",
      css.ifNullable(color, "bg-yellow"),
      classNames,
    ),
  }),
);
ColorButton({
  classNames: css("card"),
  color: css.when(signal(true), "bg-theme", "bg-yellow"),
});

const buttonColor = css.when(
  signal(true),
  "bg-theme pa2",
  "bg-yellow pa2",
);
// @ts-expect-error Atomic color props do not accept a multi-class phrase.
ColorButton({ color: buttonColor });

const color: CssPhrase<"red" | "green"> = "green";
const colorValue: CssValue<"red" | "green"> = signal(color);
css(colorValue);

// @ts-expect-error Invalid words in a phrase must be rejected.
css("pa2 missing");
// @ts-expect-error Every argument is validated independently.
css("pa2", "missing");
const invalidCompoundClasses = { invalidCard: "card missing" } as const;
type InvalidCompoundClassesAreRejected = CheckedCompoundClasses<
  // @ts-expect-error Compound values may contain only atomic class names.
  typeof invalidCompoundClasses,
  AtomicClassName
>;
declare const invalidCompoundClassesAreRejected: InvalidCompoundClassesAreRejected;
void invalidCompoundClassesAreRejected;
// @ts-expect-error Conditional branches use the complete app class union.
css.when(true, "missing", "bg-theme");
// @ts-expect-error The nullable phrase must use the complete app class union.
css.ifNullable(signal<"missing" | null>(null), "bg-theme");
// @ts-expect-error The static fallback must use the complete app class union.
css.ifNullable(signal<"bg-theme" | null>(null), "missing");
// @ts-expect-error Case-object keys use the complete app class union.
css.cases("enabled", { missing: "enabled" });
// @ts-expect-error Selector suffixes are not HTML class names.
css("pointer:hover");
