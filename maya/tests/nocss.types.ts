import { signal } from "@cyftec/signals";
import { component, m } from "../src/core";
import { defineCompoundClasses, getCss } from "../src/nocss";
import type {
  AppAtomicClassNames,
  AppClassNames,
  AtomicClassOverrides,
  AtomicClassName,
  ClassNamesPhrase,
  MediaConstraintsOverrides,
} from "../src/nocss";

const mediaConstraintsOverrides = {
  ns: { minWidth: "31em" },
  m: { maxWidth: "59em" },
} as const satisfies MediaConstraintsOverrides;

const atomicClassOverrides = {
  default: {
    theme: "{ color: #ee4440; }",
    "bg-theme": "{ background-color: #ee4440; }",
    "focus-theme:focus": "{ color: #ee4440; }",
  },
  ns: { "theme-ns": "{ color: #ee4440; }" },
  m: { "theme-m": "{ color: #ee4440; }" },
  l: { "theme-l": "{ color: #ee4440; }" },
} as const satisfies AtomicClassOverrides;

type AppAtomicClassName = AppAtomicClassNames<
  AtomicClassName,
  typeof atomicClassOverrides
>;

const compoundClasses = defineCompoundClasses<AppAtomicClassName>()({
  card: "bg-theme pa2 b--light-silver br4",
  action: "pointer hover-bg-washed-yellow",
  "native-control-accent": "dark-blue accent-current",
});

type AppClassName = AppClassNames<
  AtomicClassName,
  typeof atomicClassOverrides,
  typeof compoundClasses
>;

const css = getCss<AppClassName, typeof compoundClasses>(compoundClasses);

// Configuration-derived names include factory, override, pseudo-selector,
// responsive, and compound sources while remaining atomic.
const factoryClassName: AppClassName = "pa2";
const nativeAccentAtomicClassName: AtomicClassName = "accent-current";
const backdropBlurClassName: AppClassName = "backdrop-blur-2";
const overriddenClassName: AppClassName = "bg-theme";
const overriddenPseudoClassName: AppClassName = "focus-theme";
const responsiveOverrideClassName: AppClassName = "theme-m";
const compoundClassName: AppClassName = "card";
void [
  mediaConstraintsOverrides,
  factoryClassName,
  nativeAccentAtomicClassName,
  backdropBlurClassName,
  overriddenClassName,
  overriddenPseudoClassName,
  responsiveOverrideClassName,
  compoundClassName,
];

// css() accepts atomic names, validated phrases, nullish values, and signals.
css();
css("");
css("pa2");
css("accent-current");
css("pa2 bg-theme");
css("native-control-accent");
css("pointer hover-bg-washed-yellow");
css("card", "action");
css(null, undefined);

const validatedAtomic: ClassNamesPhrase = css("bg-theme");
const atomicColor = signal<AppClassName>("bg-theme");
atomicColor.value = css("bg-yellow");
css(atomicColor);

declare const optionalAtomicClass: AppClassName | null | undefined;
const optionalAtomicSignal = signal<AppClassName | null | undefined>(undefined);
css(optionalAtomicClass);
css(optionalAtomicSignal);

declare const validatedPhrase: ClassNamesPhrase;
declare const optionalValidatedPhrase: ClassNamesPhrase | undefined;
const optionalPhraseSignal = signal<ClassNamesPhrase | undefined>(undefined);
css(validatedAtomic, validatedPhrase, optionalValidatedPhrase);
css(optionalPhraseSignal);
css(css("pa2 bg-theme"), css("card"));

// when() supports static and signalled conditions, empty branches, atomic
// outcomes, and multi-class outcomes that can be composed into css().
css.when(true, "bg-theme", "bg-yellow");
css.when(false, "bg-theme", "");
const enabled = signal(true);
const atomicWhen = css.when(enabled, "bg-theme", "bg-yellow");
const phraseWhen = css.when(enabled, "bg-theme pa2", "bg-yellow pa2");
css(atomicWhen, phraseWhen);

// cases() supports plain or signalled subjects, signalled case values,
// phrase keys, optional defaults, and an empty case map.
type Status = "enabled" | "disabled" | "unknown";
const status = signal<Status>("disabled");
const enabledCase = signal<Status>("enabled");
const atomicCases = css.cases(
  status,
  {
    "bg-theme": "enabled",
    "bg-yellow": "disabled",
  },
  "bg-theme",
);
const phraseCases = css.cases(
  status,
  {
    "bg-theme pa2": enabledCase,
    card: "disabled",
  },
  "bg-green white",
);
css.cases("unknown" as Status, {});
css(atomicCases, phraseCases);

// ifNullable() accepts atomic or already-validated phrases, whether plain or
// signalled. Only the first argument may be nullish; the fallback is static.
css.ifNullable(null, "bg-yellow");
css.ifNullable(undefined, "bg-yellow");
css.ifNullable("", "bg-yellow");
css.ifNullable(optionalAtomicClass, "bg-yellow");
css.ifNullable(optionalAtomicSignal, "bg-yellow");
css.ifNullable(validatedPhrase, "card");
css.ifNullable(optionalValidatedPhrase, "card");
css.ifNullable(optionalPhraseSignal, "bg-green white");
css.ifNullable(signal<"bg-theme" | null>(null), "bg-yellow pa2");

// A phrase prop accepts every validated helper result. An atomic prop accepts
// only helpers whose possible output is one atomic AppClassName.
const StyledButton = component<{
  classNames?: ClassNamesPhrase;
  color?: AppClassName;
}>(({ classNames, color }) =>
  m.Button({
    class: css("pa2", css.ifNullable(color, "bg-yellow"), classNames),
  }),
);

StyledButton({ classNames: css("card pa2") });
StyledButton({ classNames: phraseWhen });
StyledButton({ classNames: phraseCases });
StyledButton({ color: css("bg-theme") });
StyledButton({ color: atomicWhen });
StyledButton({ color: atomicCases });
const expandedCompound = css("card");
// @ts-expect-error A compound expands to a multi-class phrase, not one atom.
StyledButton({ color: expandedCompound });

// Atomic/phrase separation is intentional and enforced at consumers.
// @ts-expect-error A raw string has not been validated as a class phrase.
const rawPhrase: ClassNamesPhrase = "pa2 bg-theme";
void rawPhrase;
// @ts-expect-error A multi-class phrase is not one atomic AppClassName.
const phraseIsNotAtomic: AppClassName = "pa2 bg-theme";
void phraseIsNotAtomic;
// @ts-expect-error A validated phrase is still not guaranteed to be atomic.
StyledButton({ color: validatedPhrase });
// @ts-expect-error Multi-class conditional outcomes cannot fill atomic props.
StyledButton({ color: phraseWhen });
// @ts-expect-error Multi-class case outcomes cannot fill atomic props.
StyledButton({ color: phraseCases });

// Every direct input is checked, including unions and signals.
// @ts-expect-error Unknown atomic class name.
css("missing");
// @ts-expect-error Unknown accent atoms use the standard unknown-class path.
css("accent-blue");
// @ts-expect-error Unknown word at the end of a phrase.
css("pa2 missing");
// @ts-expect-error Unknown word at the start of a phrase.
css("missing pa2");
// @ts-expect-error Every argument is validated independently.
css("pa2", "missing");
declare const maybeInvalidClassName: "pa2" | "missing";
// @ts-expect-error Every member of a class-name union must be valid.
css(maybeInvalidClassName);
const maybeInvalidSignal = signal<"pa2" | "missing">("pa2");
// @ts-expect-error Every signalled class-name possibility must be valid.
css(maybeInvalidSignal);
declare const unvalidatedClassNames: string;
// @ts-expect-error Broad strings have not been validated by NoCSS.
css(unvalidatedClassNames);
const unvalidatedSignal = signal<string>("pa2");
// @ts-expect-error Broad signalled strings have not been validated by NoCSS.
css(unvalidatedSignal);
// @ts-expect-error Selector suffixes are not HTML class names.
css("pointer:hover");
// @ts-expect-error css() accepts class phrases, not arbitrary values.
css(42);

// Conditional branches are checked independently.
// @ts-expect-error Unknown truthy branch.
css.when(true, "missing", "bg-theme");
// @ts-expect-error Unknown falsy branch.
css.when(true, "bg-theme", "missing");
// @ts-expect-error Conditional phrases cannot be broad strings.
css.when(true, unvalidatedClassNames, "bg-theme");
// @ts-expect-error Conditional outcomes are static phrases, not nullish inputs.
css.when(true, null, "bg-theme");

// Case keys, case values, and defaults are all constrained.
// @ts-expect-error Unknown class phrase used as a case key.
css.cases(status, { missing: "enabled" });
// @ts-expect-error A case value must be one of the subject's possible values.
css.cases(status, { "bg-theme": "other" });
// @ts-expect-error A signalled case value must match the subject type.
css.cases(status, { "bg-theme": signal<"other">("other") });
// @ts-expect-error Unknown default class phrase.
css.cases(status, { "bg-theme": "enabled" }, "missing");
declare const unvalidatedCases: Record<string, Status>;
// @ts-expect-error Broad case keys have not been validated by NoCSS.
css.cases(status, unvalidatedCases);

// Nullable inputs and their static fallback are checked independently.
// @ts-expect-error Unknown nullable atomic class name.
css.ifNullable("missing" as "missing" | undefined, "bg-theme");
// @ts-expect-error Unknown word in a nullable phrase.
css.ifNullable("pa2 missing" as "pa2 missing" | null, "bg-theme");
// @ts-expect-error A broad nullable string has not been validated by NoCSS.
css.ifNullable(unvalidatedClassNames, "bg-theme");
// @ts-expect-error Unknown static fallback.
css.ifNullable(signal<"bg-theme" | null>(null), "missing");
// @ts-expect-error The static fallback cannot itself be nullish.
css.ifNullable(signal<"bg-theme" | null>(null), null);
// @ts-expect-error Nullable values still have to be CSS phrases.
css.ifNullable(42, "bg-theme");

// Compound definitions are checked where they are declared.
defineCompoundClasses<AppAtomicClassName>()({
  // @ts-expect-error Compound values may contain only available atomic classes.
  invalidCard: "bg-theme missing",
});
defineCompoundClasses<AppAtomicClassName>()({
  // @ts-expect-error A compound must combine at least two atomic classes.
  invalidCard: "bg-theme",
});
defineCompoundClasses<AppAtomicClassName>()({
  // @ts-expect-error A compound may not shadow an atomic class name.
  pa2: "bg-theme br4",
});
const widenedCompoundClasses: Record<string, string> = { card: "pa2" };
// @ts-expect-error Compound values must remain literal so they can be checked.
defineCompoundClasses<AppAtomicClassName>()(widenedCompoundClasses);

// Public config types reject malformed maps while allowing partial media
// overrides.
const invalidAtomicOverrides = {
  default: {
    // @ts-expect-error Atomic declarations are CSS strings.
    invalid: 42,
  },
} as const satisfies AtomicClassOverrides;
void invalidAtomicOverrides;

const invalidAtomicGroup = {
  // @ts-expect-error Only default/ns/m/l class groups exist.
  mobile: { invalid: "" },
} as const satisfies AtomicClassOverrides;
void invalidAtomicGroup;

const invalidMediaConstraint = {
  ns: {
    // @ts-expect-error The ns group only exposes minWidth.
    maxWidth: "60em",
  },
} as const satisfies MediaConstraintsOverrides;
void invalidMediaConstraint;

const invalidMediaGroup = {
  // @ts-expect-error Only ns/m/l media groups exist.
  mobile: { minWidth: "30em" },
} as const satisfies MediaConstraintsOverrides;
void invalidMediaGroup;
