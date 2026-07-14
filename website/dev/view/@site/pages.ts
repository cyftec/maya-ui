import { m, signal, tmpl } from "./maya.ts";
import {
  docsNav,
  landingPillars,
  pages,
  rootNav,
  tutorialNav,
  type ContentBlock,
  type NavGroup,
  type NavItem,
  type PageContent,
  type SiteSection,
} from "./data.ts";

const prefixFor = (depth: number) => "../".repeat(depth);

const hrefFor = (prefix: string, route: string) =>
  route ? `${prefix}${route}` : prefix || "./";

const sectionLabel: Record<SiteSection, string> = {
  home: "Maya",
  docs: "Documentation",
  tutorial: "Tutorial",
  blogs: "Blogs",
};

const TopNav = (
  currentSection: SiteSection,
  currentPageId: string,
  prefix: string,
) =>
  m.Header({
    class: "topbar",
    children: [
      m.A({
        class: "brand",
        href: hrefFor(prefix, ""),
        children: [
          m.Span({ class: "brand-mark", children: "M" }),
          m.Span({ class: "brand-text", children: "Maya UI" }),
        ],
      }),
      m.Nav({
        class: "topnav",
        children: rootNav.map((item) =>
          m.A({
            class:
              item.pageId === currentPageId ||
              (item.pageId !== "home" && item.pageId.startsWith(currentSection))
                ? "topnav-link is-active"
                : "topnav-link",
            href: hrefFor(prefix, item.route),
            children: item.label,
          }),
        ),
      }),
    ],
  });

const SidebarLink = (item: NavItem, currentPageId: string, prefix: string) =>
  m.A({
    class:
      item.pageId === currentPageId ? "sidebar-link is-active" : "sidebar-link",
    href: hrefFor(prefix, item.route),
    children: item.label,
  });

const Sidebar = (groups: NavGroup[], currentPageId: string, prefix: string) =>
  m.Aside({
    class: "sidebar",
    children: [
      m.Div({ class: "sidebar-kicker", children: "Navigate" }),
      ...groups.map((group) =>
        m.Section({
          class: "sidebar-group",
          children: [
            m.H3({ class: "sidebar-title", children: group.title }),
            m.Nav({
              class: "sidebar-nav",
              children: group.items.map((item) =>
                SidebarLink(item, currentPageId, prefix),
              ),
            }),
          ],
        }),
      ),
    ],
  });

const Toc = (page: PageContent) =>
  m.Aside({
    class: "toc",
    children: [
      m.Div({ class: "toc-title", children: "On this page" }),
      m.Nav({
        class: "toc-nav",
        children: page.toc.map((item) =>
          m.A({
            class: item.level === 3 ? "toc-link nested" : "toc-link",
            href: `#${item.id}`,
            children: item.text,
          }),
        ),
      }),
    ],
  });

const UnverifiedBadge = () =>
  m.Div({
    class: "spec-badge",
    children: "[⚠️ UNVERIFIED SPECS - DUMMY CONTENT]",
  });

const CodeBlock = (code: string) =>
  m.Pre({
    class: "code-block",
    children: m.Code({ children: code }),
  });

const renderBlock = (block: ContentBlock) => {
  if (block.kind === "p") {
    return m.P({ class: "doc-p", children: block.text });
  }
  if (block.kind === "h2") {
    return m.H2({ id: block.id, class: "doc-h2", children: block.text });
  }
  if (block.kind === "h3") {
    return m.H3({ id: block.id, class: "doc-h3", children: block.text });
  }
  if (block.kind === "ul") {
    return m.Ul({
      class: "doc-list",
      children: block.items.map((item) => m.Li(item)),
    });
  }
  if (block.kind === "ol") {
    return m.Ol({
      class: "doc-list ordered",
      children: block.items.map((item) => m.Li(item)),
    });
  }
  if (block.kind === "code") {
    return CodeBlock(block.code);
  }
  return m.Div({
    class: "callout",
    children: [
      m.Strong({ children: block.title }),
      m.P({ children: block.body }),
    ],
  });
};

const ContentArticle = (page: PageContent) =>
  m.Article({
    class: "content",
    children: [
      page.badge ? UnverifiedBadge() : undefined,
      m.Div({ class: "eyebrow", children: page.eyebrow }),
      m.H1({ class: "page-title", children: page.title }),
      m.P({ class: "page-description", children: page.description }),
      m.Div({
        class: "doc-body",
        children: page.blocks.map(renderBlock),
      }),
    ],
  });

const DocsLayout = (page: PageContent, depth: number) => {
  const prefix = prefixFor(depth);
  const groups = page.section === "tutorial" ? tutorialNav : docsNav;

  return m.Div({
    class: "docs-layout",
    children: [
      Sidebar(groups, page.id, prefix),
      ContentArticle(page),
      Toc(page),
    ],
  });
};

const StandardLayout = (page: PageContent) =>
  m.Div({
    class: "single-layout",
    children: [ContentArticle(page), Toc(page)],
  });

const InstallTerminal = () =>
  m.Div({
    class: "terminal",
    children: [
      m.Div({
        class: "terminal-bar",
        children: [m.Span(), m.Span(), m.Span()],
      }),
      m.Pre({
        children: m.Code({
          children: [
            "$ bun install -g @cyftec/brahma",
            "\n$ brahma create my-app",
          ].join(""),
        }),
      }),
    ],
  });

const SignalDemo = () => {
  const count = signal(0);
  const label = tmpl`${count}`;
  const codeLine = tmpl`children: tmpl\`Signal value: \$\{countSignal\}\``;

  return m.Div({
    class: "signal-demo",
    children: [
      m.Div({
        class: "demo-readout",
        children: [
          m.Span("Fine-grained update"),
          m.Span({
            class: "demo-readout-count",
            children: [m.Span(`Signal value: `), m.Strong(label)],
          }),
        ],
      }),
      m.Button({
        class: "demo-button",
        onclick: () => (count.value = count.value + 1),
        children: "Mutate count signal",
      }),
      m.Pre({
        class: "demo-code",
        children: m.Code({ children: codeLine }),
      }),
    ],
  });
};

const Landing = (depth: number) => {
  const prefix = prefixFor(depth);

  return m.Main({
    class: "landing",
    children: [
      m.Section({
        class: "hero",
        children: [
          m.Div({
            class: "hero-copy",
            children: [
              m.Div({
                class: "eyebrow",
                children: "Compiler-free TypeScript UI",
              }),
              m.H1({
                children:
                  "Build static multi-page applications with signal-level DOM updates.",
              }),
              m.P({
                children:
                  "Maya keeps the platform visible: folder routes, real DOM nodes, TypeScript templates, and a Brahma build pipeline for web, PWA, and extension targets.",
              }),
              m.Div({
                class: "hero-actions",
                children: [
                  m.A({
                    class: "button primary",
                    href: hrefFor(prefix, "docs/"),
                    children: "Read the docs",
                  }),
                  m.A({
                    class: "button secondary",
                    href: hrefFor(prefix, "tutorial/"),
                    children: "Start tutorial",
                  }),
                ],
              }),
            ],
          }),
          m.Div({
            class: "hero-visual",
            children: [InstallTerminal(), SignalDemo()],
          }),
        ],
      }),
      m.Section({
        class: "pillars",
        children: landingPillars.map((pillar) =>
          m.Article({
            class: "pillar",
            children: [
              m.H2({ children: pillar.title }),
              m.P({ children: pillar.text }),
            ],
          }),
        ),
      }),
      m.Section({
        class: "code-compare",
        children: [
          m.Div({
            children: [
              m.H2("A page is just TypeScript"),
              m.P(
                "Brahma builds this expression to HTML first, then the browser mounts the same structure for runtime events and signal effects.",
              ),
            ],
          }),
          CodeBlock(
            [
              'import { m } from "@cyftec/maya";',
              'import { signal, tmpl } from "@cyftec/maya/signal";',
              "",
              "const count = signal(0);",
              "",
              "export default m.Html({",
              '  lang: "en",',
              "  children: [",
              '    m.Head({ children: [m.Title("Counter")] }),',
              "    m.Body({",
              "      children: [",
              '        m.Script({ src: "main.js", defer: true }),',
              "        m.Button({",
              "          onclick: () => (count.value += 1),",
              "          children: tmpl`Clicked ${count} times`,",
              "        }),",
              "      ],",
              "    }),",
              "  ],",
              "});",
            ].join("\n"),
          ),
        ],
      }),
    ],
  });
};

export const SitePage = (pageId: string, depth: number = 0) => {
  const page = pages[pageId];
  const section = page?.section || "home";
  const prefix = prefixFor(depth);
  const title =
    pageId === "home" ? "Maya UI Documentation" : `${page.title} - Maya UI`;
  const description =
    page?.description ||
    "Documentation for the Maya UI Framework and Brahma CLI.";

  return m.Html({
    lang: "en",
    children: [
      m.Head({
        children: [
          m.Title(title),
          m.Meta({ charset: "UTF-8" }),
          m.Meta({
            name: "viewport",
            content: "width=device-width, initial-scale=1.0",
          }),
          m.Meta({ name: "description", content: description }),
          m.Link({ rel: "stylesheet", href: `${prefix}assets/styles.css` }),
        ],
      }),
      m.Body({
        children: [
          m.Script({ src: "main.js", defer: true }),
          m.Div({
            class: "site",
            children: [
              TopNav(section, pageId, prefix),
              pageId === "home"
                ? Landing(depth)
                : m.Main({
                    class: "page-shell",
                    children:
                      section === "docs" || section === "tutorial"
                        ? DocsLayout(page, depth)
                        : StandardLayout(page),
                  }),
              m.Footer({
                class: "footer",
                children: [
                  m.Span({ children: sectionLabel[section] }),
                  m.Span({ children: "Built with Maya and Brahma." }),
                ],
              }),
            ],
          }),
        ],
      }),
    ],
  });
};
