import { m } from "@mufw/maya";
import { Link } from "../../../../../@libs/elements";
import { runHighlightJsScriptOnMount } from "../../../../../@libs/utils";
import {
  CODE_EXAMPLES,
  CONCLUSION_PARAS,
  OVERVIEW_PARAS,
  SYNTAX_RULES,
  TITLES,
} from "./constants";

export const GettingFamiliar = m.Div({
  onmount: runHighlightJsScriptOnMount,
  children: [
    m.H3({ class: "black mid-gray-ns", children: TITLES.FIRST_THINGS }),
    m.Div({
      children: m.For({
        subject: OVERVIEW_PARAS,
        map: (para) => m.P({ class: "mt0 mb3", children: para }),
        n: 1,
        nthChild: m.H3({
          class: "black mid-gray-ns",
          children: TITLES.GETTING_FAMILIAR,
        }),
      }),
    }),
    m.Div({
      class: "flex-ns w-100 w-auto-ns mv4 gray",
      children: m.For({
        subject: Object.values(CODE_EXAMPLES),
        map: (example, index) =>
          m.Div({
            class: `b--gray br4 overflow-hidden mb3 lh-copy f6 w-100 w-auto-ns  ${
              index === 0 ? "br--left-ns br-ns" : "br--right-ns"
            }`,
            children: [
              m.Div({
                class: "pv2 ph3 bg-black white f4",
                children: example.title,
              }),
              m.Pre({
                class: "ma0",
                children: m.Code(example.code),
              }),
            ],
          }),
      }),
    }),
    m.Br({}),
    m.H3({
      class: "mv0 lh-solid black mid-gray-ns",
      children: TITLES.SYNTAX_RULES,
    }),
    m.Ul({
      class: "mb4",
      children: m.For({
        subject: SYNTAX_RULES,
        map: (rule) =>
          m.Li({
            class: "mb2",
            children: rule,
          }),
      }),
    }),
    m.P(
      m.For({
        subject: CONCLUSION_PARAS,
        n: 1,
        nthChild: Link({
          colorCss: "purple",
          href: "/docs",
          label: "documentation here",
        }),
        map: (para) => para,
      })
    ),
  ],
});
