import { m } from "@mufw/maya";
import { Page } from "../@libs/components/Page";
import { Navbar, TitledList } from "../@libs/elements";

const navList = [
  {
    label: "1. Before Start",
    nodes: [
      {
        label: "Resources",
        href: "/",
      },
      {
        label: "Disclaimer",
        href: "/",
      },
    ],
  },
  {
    label: "2. Quickstart",
    nodes: [
      {
        label: "Your first app",
        href: "/",
      },
      {
        label: "Understanding app structure",
        href: "/",
      },
      {
        label: "Brahma, Karma & Maya",
        href: "/",
      },
    ],
  },
  {
    label: "3. Tic Tac Toe",
    nodes: [
      {
        label: "Syntax",
        href: "/",
      },
      {
        label: "Overview",
        href: "/",
      },
      {
        label: "Element",
        href: "/",
      },
      {
        label: "component",
        href: "/",
      },
      {
        label: "Props",
        href: "/",
      },
      {
        label: "Page",
        href: "/",
      },
      {
        label: "App structure",
        href: "/",
      },
    ],
  },
  {
    label: "4. Todos List",
    nodes: [
      {
        label: "What is signal?",
        href: "/",
      },
      {
        label: "Custom implementation",
        href: "/",
      },
      {
        label: "Effect",
        href: "/",
      },
      {
        label: "Derived signals",
        href: "/",
      },
      {
        label: "Signal for mutating list",
        href: "/",
      },
    ],
  },
  {
    label: "5. Living Room",
    nodes: [
      {
        label: "Default HTML page",
        href: "/",
      },
      {
        label: "Router",
        href: "/",
      },
      {
        label: "UI toolkit",
        href: "/",
      },
    ],
  },
];

export default Page({
  title: "Tutorial - Maya",
  app: m.Div({
    class: "flex mt3",
    children: [
      Navbar({
        children: m.For({
          items: navList,
          n: Infinity,
          nthChild: m.P({
            class: "gray f6",
            children: "** end of list **",
          }),
          map: (nav) =>
            TitledList({
              classNames: "mb4 pb3",
              titleClassNames: "f4",
              itemClassNames: "mb2 pb1 f6",
              linkColorCss: "purple",
              header: nav.label,
              links: nav.nodes.map(({ href, label }) => ({
                href,
                label,
              })),
            }),
        }),
      }),
      m.P({
        class: "ph5 mt3 f5 gray flex-grow-1 space-mono",
        children: "Docs  >  Overview  >  Getting familiar",
      }),
    ],
  }),
});
