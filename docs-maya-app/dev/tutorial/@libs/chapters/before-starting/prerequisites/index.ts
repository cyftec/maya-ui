import { m } from "@mufw/maya";
import { Link } from "../../../../../@libs/elements";
import { PRE_REQ_OVERVIEW, PRE_REQS } from "./constants";

export const Prerequisites = m.Div({
  class: "",
  children: [
    m.P({ class: "mt0", children: PRE_REQ_OVERVIEW }),
    m.Ul({
      children: m.For({
        subject: PRE_REQS,
        map: (req) =>
          m.Li({
            class: "mb2",
            children: m.If({
              subject: req.includes("##"),
              isFalsy: req,
              isTruthy: m.Span(
                m.For({
                  subject: req.split("##"),
                  map: (section, i) =>
                    m.If({
                      subject: i % 2 === 0,
                      isTruthy: section,
                      isFalsy: Link({
                        colorCss: "purple",
                        target: "_blank",
                        label: section.split("|")[0],
                        href: section.split("|")[1],
                      }),
                    }),
                })
              ),
            }),
          }),
      }),
    }),
  ],
});
