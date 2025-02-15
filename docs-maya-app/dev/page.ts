import { m } from "@mufw/maya";
import { Page } from "./@libs/components/Page";
import { MAYA_FEATURES } from "./@libs/constants";
import { ViewFrame } from "./@libs/elements";

export default Page({
  title: "Maya UI Framework",
  app: ViewFrame({
    contentClassNames: "pv5",
    children: [
      m.H1({
        class: "tc ma0",
        children: "With your web framework, now",
      }),
      m.Div({
        class: "flex flex-wrap justify-center",
        children: m.For({
          subject: MAYA_FEATURES,
          map: ([title, subtitle]) =>
            m.Div({
              class: "w-60 mt5 ph5 pv4 bg-near-white br3 lh-copy",
              children: [
                m.H3(title),
                m.Div({
                  class: "gray mb3",
                  children: subtitle || "",
                }),
              ],
            }),
        }),
      }),
    ],
  }),
});
