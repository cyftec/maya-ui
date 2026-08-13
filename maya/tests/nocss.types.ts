import { signal } from "@cyftec/signals";
import { getCss } from "../src/nocss/css";
import type { ClassNamesFrom, ClassNamesPhrase } from "../src/nocss/utils";

const factoryClasses = {
  default: {
    mv2: "",
    pa4: "",
    "bg-yellow": "",
    "bg-light-gray": "",
    "pointer:hover": "",
    "hover-bg-washed-yellow:hover": "",
    red: "",
    green: "",
  },
  large: {
    constraints: { minWidth: "60em" },
    "pa4-l": "",
  },
} as const;

type AppClassNames = ClassNamesFrom<typeof factoryClasses>;

const css = getCss<AppClassNames>();

css("mv2 pa4");
css("pointer hover-bg-washed-yellow");
css("pa4-l");
css.when(true, "bg-yellow", "bg-light-gray");
css.cases(
  "enabled" as "enabled" | "disabled",
  {
    "bg-yellow": "enabled",
    "bg-light-gray": "disabled",
  },
  "pa4",
);

const color: ClassNamesPhrase<"red" | "green", AppClassNames> = "green";
css(color);
css(signal<ClassNamesPhrase<"red" | "green", AppClassNames>>("green"));

// @ts-expect-error Invalid words in a phrase must be rejected.
css("mv2 pa4sada");
// @ts-expect-error Every argument is validated independently.
css("mv2", "pa4sada");
// @ts-expect-error A valid final word must not hide an invalid earlier word.
css("missing mv2");
// @ts-expect-error Invalid members of a signal union must be rejected.
css(signal<"green" | "missing mv2">("green"));
// @ts-expect-error Conditional branches use the factory's class-name union.
css.when(true, "bg-yellowdsa", "bg-light-gray");
// @ts-expect-error Conditional phrases validate every word.
css.when(true, "missing bg-yellow", "bg-light-gray");
// @ts-expect-error Case-object keys use the factory's class-name union.
css.cases("enabled", { "bg-yellowdsa": "enabled" });
// @ts-expect-error Case phrases validate every word.
css.cases("enabled", { "missing bg-yellow": "enabled" });
// @ts-expect-error Selector suffixes are not HTML class names.
css("pointer:hover");
// @ts-expect-error Responsive configuration is not an HTML class name.
css("constraints");
