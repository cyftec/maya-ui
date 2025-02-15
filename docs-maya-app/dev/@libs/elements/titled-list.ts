import { dstring } from "@cyftech/signal";
import { Child, Children, component, m } from "@mufw/maya";
import { Link } from "./link";

type TitledListProps = {
  classNames?: string;
  titleClassNames?: string;
  itemClassNames?: string;
  header: string;
  justifyRight?: boolean;
  links: { label: string; href: string }[];
  linkColorCss?: string;
  bottomComponent?: Children;
};

export const TitledList = component<TitledListProps>(
  ({
    classNames,
    titleClassNames,
    itemClassNames,
    header,
    justifyRight,
    links,
    linkColorCss,
    bottomComponent,
  }) =>
    m.Div({
      class: dstring`${() => (justifyRight?.value ? "tr" : "")} ${classNames}`,
      children: [
        m.P({
          class: dstring`space-mono mt0 f3 lh-solid ${titleClassNames}`,
          children: header,
        }),
        m.Div(
          m.For({
            subject: links,
            map: (link) =>
              m.Div({
                class: itemClassNames,
                children: [
                  Link({
                    colorCss: linkColorCss,
                    href: link.href,
                    label: link.label,
                  }),
                ],
              }),
          })
        ),
        m.If({
          subject: bottomComponent,
          isTruthy: bottomComponent as Child,
        }),
      ],
    })
);
