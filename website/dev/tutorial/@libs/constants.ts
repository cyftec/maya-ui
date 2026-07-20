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
        // show how to bootstrap an app using brahma
        // also tell different modes in which app
        // can be bootstrapped like 'web', 'pwa' and 'ext'
        // then as an example create a sample web app
        title: "Your first app using 'brahma create'",
        article: FirstApp,
      },
      {
        // show the app structure alonside karma.ts files
        // and the app directory structure of the sample
        // app bootstrapped by 'brahma create'
        // detailed karma.ts structure is discussed in
        // subsequent chapters
        // folder-based routes
        // assets folder gets generated exactly during build
        title: "App structure",
        article: AppStructure,
      },
      {
        // basic overview of Maya as a rendering engine
        // rest of the specifics are covered below in
        // subsequent chapters ('Sample App' section)
        title: "Maya",
        article: Maya,
      },
      {
        // how all the configs stored here in karma.ts
        // and broadly what all config values mean
        // also show that how it's in TS and not in JSON
        // so that same variable can be reused
        title: "Karma",
        article: Karma,
      },
      {
        // how brahma takes help of karma to spawn
        // and stages the app for continuous development
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
        // Maya can totally be used to generate
        // static html pages
        // but also built with @cyftec/signal under
        // the hood. SO reactivity in Maya
        // apps can be acheived by using signals
        title: "Static vs Reactive Maya app",
        article: StaticVsReactive,
      },
      {
        // Introduction only
        // custom implementation specifically for
        // Maya. Comprehensive intuitive api.
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
