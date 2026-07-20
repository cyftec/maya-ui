import { tmpl } from "@cyftec/maya/signal";
import { Child, Children, component, m } from "@cyftec/maya";
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
  }) => {
    return m.Div({
      class: tmpl`${() => (justifyRight?.value ? "tr" : "")} ${classNames}`,
      children: [
        m.P({
          class: tmpl`space-mono mt0 f3 lh-solid ${titleClassNames}`,
          children: title,
        }),
        m.Div(
          m.For({
            subject: links,
            itemKey: "title",
            map: (link, linkIndex) => {
              const { title, href, isSelected } = link.props();
              return m.Div({
                class: itemClassNames,
                children: [
                  Link({
                    classNames: "ph2",
                    colorCss: linkColorCss,
                    label: title,
                    onClick: () => onLinkClick && onLinkClick(linkIndex.value),
                    href,
                    isSelected,
                  }),
                ],
              });
            },
          }),
        ),
        m.If({
          subject: bottomComponent,
          isTruthy: () => bottomComponent as Child,
        }),
      ],
    });
  },
);
