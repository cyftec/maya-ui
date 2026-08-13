import { getCss } from "../src/nocss/css";
import type { ClassNamesPhrase } from "../src/nocss/registry";

type AppClassNames =
  | "mv2"
  | "pa4"
  | "bg-yellow"
  | "bg-light-gray"
  | "pointer"
  | "hover-bg-washed-yellow"
  | "red"
  | "green";

const css = getCss<AppClassNames>();

css("mv2 pa4");
css("pointer hover-bg-washed-yellow");
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

// @ts-expect-error Invalid words in a phrase must be rejected.
css("mv2 pa4sada");
// @ts-expect-error Conditional branches use the factory's class-name union.
css.when(true, "bg-yellowdsa", "bg-light-gray");
// @ts-expect-error Case-object keys use the factory's class-name union.
css.cases("enabled", { "bg-yellowdsa": "enabled" });
