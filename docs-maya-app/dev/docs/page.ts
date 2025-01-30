import { m } from "@mufw/maya";
import { Page } from "../@libs/components/Page";
import { Navbar, TitledList, ViewFrame } from "../@libs/elements";

const navList = [
  {
    label: "1. Overview",
    nodes: [
      {
        label: "Getting familiar",
        href: "/",
      },
      {
        label: "Prerequisite",
        href: "/",
      },
      {
        label: "Installation",
        href: "/",
      },
      {
        label: "App structure",
        href: "/",
      },
      {
        label: "Brahma, Karma & Maya",
        href: "/",
      },
      {
        label: "Karma config",
        href: "/",
      },
    ],
  },
  {
    label: "2. Brahma (CLI)",
    nodes: [
      {
        label: "Why the CLI?",
        href: "/",
      },
      {
        label: "brahma create",
        href: "/",
      },
      {
        label: "brahma install",
        href: "/",
      },
      {
        label: "brahma add",
        href: "/",
      },
      {
        label: "brahma remove",
        href: "/",
      },
      {
        label: "brahma publish",
        href: "/",
      },
    ],
  },
  {
    label: "3. Maya",
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
    ],
  },
  {
    label: "4. Signal",
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
    label: "5. Toolbox",
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
  title: "",
  app: m.Div({
    class: "flex mt3",
    children: [
      Navbar({
        children: [
          ...navList.map((nav) =>
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
            })
          ),
          m.P({
            class: "gray f6",
            children: "** end of list **",
          }),
        ],
      }),
      m.P({
        class: "ph5 mt3 f5 gray flex-grow-1 space-mono",
        children: "Docs  >  Overview  >  Getting familiar",
      }),
    ],
  }),
});
