import { m } from "@cyftec/maya";
import { ChaptersPage } from "../@libs/components/ChaptersPage";
import {
  GettingFamiliar,
  Prerequisites,
} from "../tutorial/@libs/chapters/before-starting";
import { InstallationAndSetup } from "../tutorial/@libs/chapters/project-setup";
import {
  AppStructure,
  Karma,
  Maya as MayaRuntime,
} from "../tutorial/@libs/chapters/project-setup";
import {
  Component,
  Element,
  Overview as MayaOverview,
  Page,
  Props,
  Syntax,
} from "../tutorial/@libs/chapters/learning";
import {
  DerivedSignals,
  Effect,
  SignalForReactivity,
  WhatIsSignal,
} from "../tutorial/@libs/chapters/reactivity";
import {
  BrahmaKarmaMaya,
  Create,
  DefaultHtmlPage,
  Install,
  Publish,
  Reset,
  Router,
  SignalImplementation,
  UiToolkit,
  Uninstall,
  WhyCli,
} from "./@libs/articles";

const DOCS_CHAPTERS = [
  {
    title: "Overview",
    topics: [
      {
        title: "Getting familiar",
        article: GettingFamiliar,
      },
      {
        title: "Prerequisites",
        article: Prerequisites,
      },
      {
        title: "Installation",
        article: InstallationAndSetup,
      },
      {
        title: "App structure",
        article: AppStructure,
      },
      {
        title: "Brahma, Karma & Maya",
        article: BrahmaKarmaMaya,
      },
      {
        title: "Karma config",
        article: Karma,
      },
    ],
  },
  {
    title: "Brahma (CLI)",
    topics: [
      {
        title: "Why the CLI?",
        article: WhyCli,
      },
      {
        title: "brahma create",
        article: Create,
      },
      {
        title: "brahma install",
        article: Install,
      },
      {
        title: "brahma uninstall",
        article: Uninstall,
      },
      {
        title: "brahma reset",
        article: Reset,
      },
      {
        title: "brahma publish",
        article: Publish,
      },
    ],
  },
  {
    title: "Maya",
    topics: [
      {
        title: "Syntax",
        article: Syntax,
      },
      {
        title: "Overview",
        article: MayaOverview,
      },
      {
        title: "Element",
        article: Element,
      },
      {
        title: "component",
        article: Component,
      },
      {
        title: "Props",
        article: Props,
      },
      {
        title: "Page",
        article: Page,
      },
    ],
  },
  {
    title: "Signal",
    topics: [
      {
        title: "What is signal?",
        article: WhatIsSignal,
      },
      {
        title: "Custom implementation",
        article: SignalImplementation,
      },
      {
        title: "Effect",
        article: Effect,
      },
      {
        title: "Derived signals",
        article: DerivedSignals,
      },
      {
        title: "Signal for mutating list",
        article: SignalForReactivity,
      },
    ],
  },
  {
    title: "Toolbox",
    topics: [
      {
        title: "Default HTML page",
        article: DefaultHtmlPage,
      },
      {
        title: "Router",
        article: Router,
      },
      {
        title: "UI toolkit",
        article: UiToolkit,
      },
    ],
  },
];

export default ChaptersPage({
  htmlTitle: "Docs - Maya",
  pageTitle: "Docs",
  headElements: [
    m.Script({
      src: "https://cdn.jsdelivr.net/gh/highlightjs/cdn-release@11.9.0/build/highlight.min.js",
    }),
  ],
  chapters: DOCS_CHAPTERS,
});
