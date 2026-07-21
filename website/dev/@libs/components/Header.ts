import { m } from "@cyftec/maya/core";
import { BASE_MAYA_VERSION } from "../constants";
import { ViewFrame } from "../elements";

const navLinks = [
  { href: "/#architecture", label: "Architecture" },
  { href: "/#signals", label: "Signals" },
  { href: "/#toolchain", label: "Brahma" },
  { href: "/#benchmark", label: "Benchmark" },
  { href: "/docs/", label: "Docs" },
  { href: "/tutorial/", label: "Tutorial" },
];

export const Header = () =>
  ViewFrame({
    classNames: "site-header-frame",
    contentClassNames: "site-header-shell",
    children: m.Header({
      class: "site-header",
      children: [
        m.A({
          class: "site-brand",
          href: "/",
          "aria-label": "Maya home",
          children: [
            m.Img({
              src: "/assets/images/maya-logo.svg",
              height: "34",
              width: "34",
              alt: "",
            }),
            m.Span({ children: [m.Strong("MAYA"), m.Small(BASE_MAYA_VERSION)] }),
          ],
        }),
        m.Nav({
          class: "site-nav",
          "aria-label": "Primary navigation",
          children: navLinks.map((link) =>
            m.A({ href: link.href, children: link.label }),
          ),
        }),
        m.A({
          class: "header-github",
          href: "https://github.com/cyftec/maya-ui",
          target: "_blank",
          rel: "noreferrer",
          children: [m.Span("GitHub"), m.Span({ "aria-hidden": "true", children: "↗" })],
        }),
      ],
    }),
  });
