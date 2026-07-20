import { m } from "@cyftec/maya/core";
import { ChaptersPage } from "../@libs/components/ChaptersPage";
import { TUTORIAL_CHAPTERS } from "./@libs/constants";

export default ChaptersPage({
  htmlTitle: "Tutorial - Maya",
  pageTitle: "Tutorial",
  headElements: [
    m.Script({
      src: "https://cdn.jsdelivr.net/gh/highlightjs/cdn-release@11.9.0/build/highlight.min.js",
    }),
  ],
  chapters: TUTORIAL_CHAPTERS,
});
