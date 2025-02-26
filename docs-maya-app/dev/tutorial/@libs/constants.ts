import { ComingSoon } from "../../@libs/components/ComingSoon";
import {
  Disclaimer,
  GettingFamiliar,
  Prerequisites,
} from "./chapters/before-starting";
import { InstallationAndSetup } from "./chapters/project-setup";

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
        title: "Create your first app",
        article: ComingSoon,
      },
      {
        title: "Understanding app structure",
        article: ComingSoon,
      },
      {
        title: "Brahma, Karma & Maya",
        article: ComingSoon,
      },
    ],
  },
  {
    title: "Tic Tac Toe",
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
      {
        title: "App structure",
        article: ComingSoon,
      },
    ],
  },
  {
    title: "Todos List",
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
    title: "Living Room",
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
