import { m } from "@cyftec/maya/core";
import { ChaptersPage } from "@root-libs/components";
import { TUTORIAL_CHAPTERS } from "@tutorial-libs/constants";

export default ChaptersPage({
  htmlTitle: "Tutorial - Maya",
  pageTitle: "Tutorial",
  headElements: [
    m.Link({
      rel: "stylesheet",
      href: "https://cdnjs.cloudflare.com/ajax/libs/highlight.js/11.11.1/styles/agate.min.css",
    }),
    m.Script({
      src: "https://cdn.jsdelivr.net/gh/highlightjs/cdn-release@11.9.0/build/highlight.min.js",
    }),
  ],
  chapters: TUTORIAL_CHAPTERS,
});
