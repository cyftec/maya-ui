import { component, m } from "@cyftec/maya/core";
import { Link } from "./link";

type TextWithLinksProps = {
  classNames?: string;
  linkColorCss?: string;
  text: string;
};

export const TextWithLinks = component<TextWithLinksProps>(
  ({ classNames, linkColorCss, text }) => {
    return m.Span({
      class: classNames,
      children: m.If({
        subject: text.includes("##"),
        isFalsy: () => text,
        isTruthy: () =>
          m.For({
            subject: text.split("##"),
            map: (section, i) => {
              const [label = "", href = ""] = section.split("|");
              return m.If({
                subject: i % 2 === 0,
                isTruthy: () => section,
                isFalsy: () =>
                  Link({
                    colorCss: linkColorCss || "theme-col",
                    target: "_blank",
                    label,
                    href,
                  }),
              });
            },
          }),
      }),
    });
  },
);
