import { dprops, dstring } from "@cyftech/signal";
import { Child, Children, component, m } from "@mufw/maya";
import { Link } from "./link";

type TitledListProps = {
  classNames?: string;
  titleClassNames?: string;
  itemClassNames?: string;
  title: string;
  justifyRight?: boolean;
  links: { title: string; href?: string; isSelected?: boolean }[];
  onLinkClick?: (linkIndex: number) => void;
  linkColorCss?: string;
  bottomComponent?: Children;
};

export const TitledList = component<TitledListProps>(
  ({
    classNames,
    titleClassNames,
    itemClassNames,
    title,
    justifyRight,
    links,
    onLinkClick,
    linkColorCss,
    bottomComponent,
  }) =>
    m.Div({
      class: dstring`${() => (justifyRight?.value ? "tr" : "")} ${classNames}`,
      children: [
        m.P({
          class: dstring`space-mono mt0 f3 lh-solid ${titleClassNames}`,
          children: title,
        }),
        m.Div(
          m.For({
            subject: links,
            itemKey: "title",
            map: (link, linkIndex) => {
              const { title, href, isSelected } = dprops(link);
              return m.Div({
                class: itemClassNames,
                children: [
                  Link({
                    colorCss: linkColorCss,
                    label: title,
                    onClick: () => onLinkClick && onLinkClick(linkIndex.value),
                    href,
                    isSelected,
                  }),
                ],
              });
            },
          })
        ),
        m.If({
          subject: bottomComponent,
          isTruthy: bottomComponent as Child,
        }),
      ],
    })
);
