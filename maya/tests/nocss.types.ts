import { signal } from "@cyftec/signals";
import { component, m } from "../src/core";
import { getCss } from "../src/nocss/css";
import type {
  AppClassNames,
  AtomicClassOverrides,
  BaseClassName,
  ClassNamesPhrase,
} from "../src/nocss/index";

const overriddenBaseClasses = {
  default: { theme: "", "bg-theme": "" },
} as const satisfies AtomicClassOverrides;

const compoundClasses = {
  card: "bg-theme pa2 b--light-silver br4",
} as const;

type AppClassName = AppClassNames<
  BaseClassName,
  typeof overriddenBaseClasses,
  typeof compoundClasses
>;

const css = getCss<AppClassName>();

css("pa2 bg-theme");
css("pointer hover-bg-washed-yellow");
css("card");
css(null, undefined);

const atomicColor = signal<AppClassName>("bg-theme");
atomicColor.value = css("bg-theme");

const optionalAtomicClass = signal<AppClassName | undefined>(undefined);
css(optionalAtomicClass);
css.ifNullable(optionalAtomicClass, "bg-yellow");

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

declare const validatedColor: ClassNamesPhrase;
css.ifNullable(validatedColor, "card");

const optionalPhrase = signal<ClassNamesPhrase | undefined>(undefined);
css(optionalPhrase);
css.ifNullable(optionalPhrase, "card");

const ColorButton = component<{
  classNames?: ClassNamesPhrase;
  color?: AppClassName;
}>(({ classNames, color }) =>
  m.Button({
    class: css("pa2", css.ifNullable(color, "bg-yellow"), classNames),
  }),
);
ColorButton({
  classNames: css("card pa2"),
  color: css.when(signal(true), "bg-theme", "bg-yellow"),
});

const buttonColor = css.when(signal(true), "bg-theme pa2", "bg-yellow pa2");
// @ts-expect-error Atomic color props do not accept a multi-class phrase.
ColorButton({ color: buttonColor });
ColorButton({ classNames: buttonColor });

const colorValue = signal<"red" | "green">("green");
css(colorValue);

// @ts-expect-error Invalid words in a phrase must be rejected.
css("pa2 missing");
// @ts-expect-error Every argument is validated independently.
css("pa2", "missing");
declare const unvalidatedClassNames: string;
// @ts-expect-error Broad strings have not been validated by NoCSS.
css(unvalidatedClassNames);
const invalidCompoundClasses = { invalidCard: "card missing" } as const;
type InvalidCompoundClassesAreRejected = AppClassNames<
  BaseClassName,
  typeof overriddenBaseClasses,
  // @ts-expect-error Compound values may contain only available atomic classes.
  typeof invalidCompoundClasses
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
