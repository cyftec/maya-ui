import { component, m } from "@mufw/maya";
import { Link } from "./link";
import { dstring } from "@cyftech/signal";

type TextWithLinksProps = {
  classNames?: string;
  linkColorCss?: string;
  text: string;
};

export const TextWithLinks = component<TextWithLinksProps>(
  ({ classNames, linkColorCss, text }) => {
    console.log(text.value);
    return m.Span({
      class: dstring`${classNames}`,
      children: m.If({
        subject: text.value.includes("##"),
        isFalsy: text.value,
        isTruthy: m.Span(
          m.For({
            subject: text.value.split("##"),
            map: (section, i) =>
              m.If({
                subject: i % 2 === 0,
                isTruthy: section,
                isFalsy: Link({
                  colorCss: linkColorCss || "purple",
                  target: "_blank",
                  label: section.split("|")[0],
                  href: section.split("|")[1],
                }),
              }),
          })
        ),
      }),
    });
  }
);
