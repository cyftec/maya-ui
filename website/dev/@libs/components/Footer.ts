import { m } from "@cyftec/maya/core";
import { BASE_MAYA_VERSION } from "../constants";
import { ViewFrame } from "../elements";

const FooterGroup = (
  title: string,
  links: Array<{ label: string; href: string }>,
) =>
  m.Div({
    class: "footer-group",
    children: [
      m.Strong(title),
      ...links.map((link) =>
        m.A({
          href: link.href,
          ...(link.href.startsWith("http")
            ? { target: "_blank", rel: "noreferrer" as const }
            : {}),
          children: [link.label, link.href.startsWith("http") ? " ↗" : ""],
        }),
      ),
    ],
  });

export const Footer = ViewFrame({
  classNames: "site-footer-frame",
  contentClassNames: "site-footer-shell",
  children: m.Footer({
    class: "site-footer",
    children: [
      m.Div({
        class: "footer-brand",
        children: [
          m.A({
            class: "footer-logo",
            href: "/",
            children: [
              m.Img({ src: "/assets/images/maya-logo.svg", height: "38", width: "38", alt: "" }),
              m.Span({ children: [m.Strong("MAYA"), m.Small(`UI framework ${BASE_MAYA_VERSION}`)] }),
            ],
          }),
          m.P(
            "A TypeScript-native, MPA-first UI framework by Cyfer. Built close to the browser platform.",
          ),
        ],
      }),
      m.Div({
        class: "footer-links",
        children: [
          FooterGroup("Learn", [
            { label: "Documentation", href: "/docs/" },
            { label: "Tutorial", href: "/tutorial/" },
            { label: "Benchmark", href: "https://benchmark.maya.cyfer.tech/" },
          ]),
          FooterGroup("Ecosystem", [
            { label: "Signal", href: "https://signal.cyfer.tech" },
            { label: "Maya on npm", href: "https://www.npmjs.com/package/@cyftec/maya" },
            { label: "Brahma on npm", href: "https://www.npmjs.com/package/@cyftec/brahma" },
          ]),
          FooterGroup("Connect", [
            { label: "GitHub", href: "https://github.com/cyftec/maya-ui" },
            { label: "Cyfer", href: "https://www.cyfer.tech" },
            { label: "Maya blogs", href: "https://www.cyfer.tech/blogs?tags=maya" },
          ]),
        ],
      }),
      m.Div({
        class: "footer-bottom",
        children: [
          m.Span("© 2026 Cyfer Tech. All rights reserved."),
          m.Span("This site is built with Maya."),
        ],
      }),
    ],
  }),
});
