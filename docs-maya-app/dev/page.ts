import { m } from "@mufw/maya";
import { Page } from "./@libs/components/Page";
import {
  LINKS,
  MAYA_FEATURES,
  MAYA_FEATURES_TITLE,
  MAYA_TITLE,
} from "./@libs/constants";
import { Button, ViewFrame } from "./@libs/elements";

export default Page({
  title: MAYA_TITLE,
  app: ViewFrame({
    contentClassNames: "pb5",
    children: [
      m.Div({
        class: "flex flex-wrap justify-center sticky top-0 bg-pale",
        children: [
          m.Div({
            class: "w-100 flex items-center justify-between pa4 bg-maya",
            children: [
              m.Div({
                class: "space-mono f1-l f2-m f3 b white",
                children: MAYA_TITLE,
              }),
              Button({
                classNames: "bg-white",
                labelClassNames: "ph4-ns pv3-ns ph3 pv2",
                label: m.Span([
                  m.Span({
                    class: "db dn-ns",
                    children: LINKS.DOCS.LABEL_S,
                  }),
                  m.Span({
                    class: "db-m dn",
                    children: LINKS.DOCS.LABEL_M,
                  }),
                  m.Span({
                    class: "db-l dn",
                    children: LINKS.DOCS.LABEL_L,
                  }),
                ]),
                href: "/docs",
              }),
            ],
          }),
          m.Div({
            class: "db mv4-ns mv3 pt2 ph0-l ph4 tc b f3",
            children: MAYA_FEATURES_TITLE,
          }),
        ],
      }),
      m.Div({
        class: "flex flex-wrap justify-center ph0-l ph4",
        children: m.For({
          subject: MAYA_FEATURES,
          n: Infinity,
          nthChild: Button({
            classNames: "w-60-ns bg-white",
            labelClassNames: "w-100 ph4 pv3",
            label: m.Span([
              m.Span({
                class: "di-ns dn",
                children: LINKS.TUTORIAL.LABEL_NS,
              }),
              m.Span({ class: "di dn-ns", children: LINKS.TUTORIAL.LABEL_S }),
            ]),
            href: "/tutorial",
          }),
          map: ([title, subtitle]) =>
            m.Div({
              class:
                "w-60-ns mt2 mb4 ph5-l pv4-l ph4 pv3 bg-near-white br3 lh-copy",
              children: [
                m.H3({ children: title }),
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
