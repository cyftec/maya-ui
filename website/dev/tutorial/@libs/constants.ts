import {
  Disclaimer,
  GettingFamiliar,
  Prerequisites,
} from "./chapters/before-starting";
import {
  AppStructure,
  Brahma,
  FirstApp,
  InstallationAndSetup,
  Karma,
  Maya,
} from "./chapters/project-setup";
import {
  Component,
  Element,
  FolderRoutes,
  Fragment,
  Overview,
  Page,
  Props,
  Syntax,
} from "./chapters/learning";
import {
  DerivedSignals,
  Effect,
  SignalForReactivity,
  StaticVsReactive,
  TodoList,
  WhatIsSignal,
} from "./chapters/reactivity";

export const TUTORIAL_CHAPTERS = [
  {
    title: "Before Starting",
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
        title: "Disclaimer",
        article: Disclaimer,
      },
    ],
  },
  {
    title: "Project Setup",
    topics: [
      {
        title: "Setup & Installations",
        article: InstallationAndSetup,
      },
      {
        title: "Your first app using 'brahma create'",
        article: FirstApp,
      },
      {
        title: "App structure",
        article: AppStructure,
      },
      {
        title: "Maya",
        article: Maya,
      },
      {
        title: "Karma",
        article: Karma,
      },
      {
        title: "Brahma",
        article: Brahma,
      },
    ],
  },
  {
    title: "Learning Maya from sample app",
    topics: [
      {
        title: "Syntax",
        article: Syntax,
      },
      {
        title: "Overview",
        article: Overview,
      },
      {
        title: "Element",
        article: Element,
      },
      {
        title: "Fragment",
        article: Fragment,
      },
      {
        title: "Component",
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
      {
        title: "Folder based routes",
        article: FolderRoutes,
      },
    ],
  },
  {
    title: "Reactivity",
    topics: [
      {
        title: "Static vs Reactive Maya app",
        article: StaticVsReactive,
      },
      {
        title: "What is signal?",
        article: WhatIsSignal,
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
        title: "Signal for reactivity",
        article: SignalForReactivity,
      },
    ],
  },
  {
    title: "Todo List app example",
    topics: [
      {
        title: "Build a Todo List",
        article: TodoList,
      },
    ],
  },
];
