import { m } from "@mufw/maya";
import { ChaptersPage } from "../@libs/components";
import { ComingSoon } from "../@libs/components/ComingSoon";

const DOCS_CHAPTERS = [
  {
    title: "Overview",
    topics: [
      {
        title: "Getting familiar",
        article: ComingSoon,
      },
      {
        title: "Prerequisites",
        article: ComingSoon,
      },
      {
        title: "Installation",
        article: ComingSoon,
      },
      {
        title: "App structure",
        article: ComingSoon,
      },
      {
        title: "Brahma, Karma & Maya",
        article: ComingSoon,
      },
      {
        title: "Karma config",
        article: ComingSoon,
      },
    ],
  },
  {
    title: "Brahma (CLI)",
    topics: [
      {
        title: "Why the CLI?",
        article: ComingSoon,
      },
      {
        title: "brahma create",
        article: ComingSoon,
      },
      {
        title: "brahma install",
        article: ComingSoon,
      },
      {
        title: "brahma add",
        article: ComingSoon,
      },
      {
        title: "brahma remove",
        article: ComingSoon,
      },
      {
        title: "brahma publish",
        article: ComingSoon,
      },
    ],
  },
  {
    title: "Maya",
    topics: [
      {
        title: "Syntax",
        article: ComingSoon,
      },
      {
        title: "Overview",
        article: ComingSoon,
      },
      {
        title: "Element",
        article: ComingSoon,
      },
      {
        title: "component",
        article: ComingSoon,
      },
      {
        title: "Props",
        article: ComingSoon,
      },
      {
        title: "Page",
        article: ComingSoon,
      },
    ],
  },
  {
    title: "Signal",
    topics: [
      {
        title: "What is signal?",
        article: ComingSoon,
      },
      {
        title: "Custom implementation",
        article: ComingSoon,
      },
      {
        title: "Effect",
        article: ComingSoon,
      },
      {
        title: "Derived signals",
        article: ComingSoon,
      },
      {
        title: "Signal for mutating list",
        article: ComingSoon,
      },
    ],
  },
  {
    title: "Toolbox",
    topics: [
      {
        title: "Default HTML page",
        article: ComingSoon,
      },
      {
        title: "Router",
        article: ComingSoon,
      },
      {
        title: "UI toolkit",
        article: ComingSoon,
      },
    ],
  },
];

export default ChaptersPage({
  htmlTitle: "Docs - Maya",
  pageTitle: "Docs",
  headElements: [
    m.Link({
      rel: "stylesheet",
      href: "https://cdn.jsdelivr.net/gh/highlightjs/cdn-release@11.9.0/build/styles/night-owl.css",
    }),
    m.Script({
      src: "https://cdn.jsdelivr.net/gh/highlightjs/cdn-release@11.9.0/build/highlight.min.js",
    }),
  ],
  chapters: DOCS_CHAPTERS,
});
