import { m } from "@mufw/maya";
import { Page } from "../@libs/components/Page";
import { Navbar, TitledList, ViewFrame } from "../@libs/elements";

const chapters = [
  {
    title: "1. Overview",
    topics: [
      {
        title: "Getting familiar",
        href: "/",
      },
      {
        title: "Prerequisite",
        href: "/",
      },
      {
        title: "Installation",
        href: "/",
      },
      {
        title: "App structure",
        href: "/",
      },
      {
        title: "Brahma, Karma & Maya",
        href: "/",
      },
      {
        title: "Karma config",
        href: "/",
      },
    ],
  },
  {
    title: "2. Brahma (CLI)",
    topics: [
      {
        title: "Why the CLI?",
        href: "/",
      },
      {
        title: "brahma create",
        href: "/",
      },
      {
        title: "brahma install",
        href: "/",
      },
      {
        title: "brahma add",
        href: "/",
      },
      {
        title: "brahma remove",
        href: "/",
      },
      {
        title: "brahma publish",
        href: "/",
      },
    ],
  },
  {
    title: "3. Maya",
    topics: [
      {
        title: "Syntax",
        href: "/",
      },
      {
        title: "Overview",
        href: "/",
      },
      {
        title: "Element",
        href: "/",
      },
      {
        title: "component",
        href: "/",
      },
      {
        title: "Props",
        href: "/",
      },
      {
        title: "Page",
        href: "/",
      },
    ],
  },
  {
    title: "4. Signal",
    topics: [
      {
        title: "What is signal?",
        href: "/",
      },
      {
        title: "Custom implementation",
        href: "/",
      },
      {
        title: "Effect",
        href: "/",
      },
      {
        title: "Derived signals",
        href: "/",
      },
      {
        title: "Signal for mutating list",
        href: "/",
      },
    ],
  },
  {
    title: "5. Toolbox",
    topics: [
      {
        title: "Default HTML page",
        href: "/",
      },
      {
        title: "Router",
        href: "/",
      },
      {
        title: "UI toolkit",
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
          ...chapters.map(({ title, topics }) =>
            TitledList({
              classNames: "mb4 pb3",
              titleClassNames: "f4",
              itemClassNames: "mb2 pb1 f6",
              linkColorCss: "purple",
              title: title,
              links: topics,
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
