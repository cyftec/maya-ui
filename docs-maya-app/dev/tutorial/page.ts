import { m } from "@mufw/maya";
import { ChaptersPage } from "../@libs/components";
import { TUTORIAL_CHAPTERS } from "./@libs/constants";

export default ChaptersPage({
  htmlTitle: "Tutorial - Maya",
  pageTitle: "Tutorial",
  headElements: [
    m.Link({
      rel: "stylesheet",
      href: "https://cdn.jsdelivr.net/gh/highlightjs/cdn-release@11.9.0/build/styles/night-owl.css",
    }),
    m.Script({
      src: "https://cdn.jsdelivr.net/gh/highlightjs/cdn-release@11.9.0/build/highlight.min.js",
    }),
  ],
  chapters: TUTORIAL_CHAPTERS,
});
