import { derived, dprops } from "@cyftech/signal";
import { m } from "@mufw/maya";
import { BASE_MAYA_VERSION } from "../constants";
import { BrandLogo, GithubLink, Icon, Link, ViewFrame } from "../elements";
import { path } from "../router";

const links = derived(() => {
  return [
    {
      isSelected: path.value.startsWith("/docs"),
      colorCss: "purple",
      href: "/docs/",
      label: "Docs",
    },
    {
      isSelected: path.value.startsWith("/tutorial"),
      colorCss: "purple",
      href: "/tutorial/",
      label: "Tutorial",
    },
    {
      isSelected: false,
      colorCss: "purple",
      target: "_blank",
      href: "https://www.cyfer.tech/blogs/?tags=maya",
      label: "Blogs",
    },
  ];
});

export const Header = () => {
  return ViewFrame({
    children: m.Div({
      class: "pv3 bg-pale flex items-center justify-between",
      children: [
        BrandLogo({
          logoSize: 36,
          logoSrc: `/assets/images/maya-logo.png`,
          logoHref: `/`,
          labelComponent: m.A({
            class: "ml3 link black no-underline",
            href: "/",
            children: [
              m.Div({
                class: `f4`,
                children: "MAYA",
              }),
              Link({
                classNames: `f7`,
                colorCss: "black",
                target: "_blank",
                href: "https://github.com/cyftec/maya-ui",
                label: BASE_MAYA_VERSION,
              }),
            ],
          }),
        }),
        m.Div({
          class: "flex items-center justify-end",
          children: m.For({
            subject: links,
            itemKey: "label",
            n: Infinity,
            nthChild: m.Div({
              class: "flex items-center",
              children: [
                m.Span({
                  class: "db dn-ns",
                  children: Icon({
                    size: 32,
                    name: "menu",
                    onClick: () => {},
                  }),
                }),
                GithubLink({
                  size: 42,
                  classNames: "ml3",
                  url: "https://github.com/cyftec/maya-ui",
                }),
              ],
            }),
            map: (link) => {
              const dlink = dprops(link);
              return Link({
                classNames: "db-ns dn ml3 pv1 ph2",
                isSelected: dlink.isSelected,
                colorCss: dlink.colorCss,
                target: dlink.target,
                href: dlink.href,
                label: dlink.label,
              });
            },
          }),
        }),
      ],
    }),
  });
};
