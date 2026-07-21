import { m } from "@cyftec/maya/core";
import { derive, signal } from "@cyftec/maya/signal";
import { Page } from "./@libs/components/Page";

const signalValue = signal(12);
const sourceValue = derive(() => String(signalValue.value));
const computedValue = derive(() => String(signalValue.value * 2));
const exactCellClass = derive(
  () =>
    `signal-cell exact signal-flash-${signalValue.value % 2 === 0 ? "even" : "odd"}`,
);
const outputMarkup = derive(
  () => `  <output>${String(signalValue.value * 2)}</output>`,
);

const ExternalArrow = () =>
  m.Span({ class: "link-arrow", "aria-hidden": "true", children: "↗" });

const ArrowLink = (label: string, href: string, className = "text-link") =>
  m.A({
    class: className,
    href,
    ...(href.startsWith("http")
      ? { target: "_blank", rel: "noreferrer" as const }
      : {}),
    children: [label, href.startsWith("http") ? ExternalArrow() : " →"],
  });

const SectionLabel = (index: string, label: string) =>
  m.Div({
    class: "section-label",
    children: [m.Span(index), m.Span(label)],
  });

const CodeWindow = (label: string, code: string, className = "") =>
  m.Div({
    class: `code-window ${className}`,
    children: [
      m.Div({
        class: "window-bar",
        children: [
          m.Span({
            class: "window-dots",
            "aria-hidden": "true",
            children: "● ● ●",
          }),
          m.Span(label),
        ],
      }),
      m.Pre({ children: m.Code(code) }),
    ],
  });

const FeatureHeading = (
  eyebrow: string,
  title: string,
  description: string,
  link?: ReturnType<typeof ArrowLink>,
) =>
  m.Div({
    class: "feature-copy",
    children: [
      m.P({ class: "eyebrow", children: eyebrow }),
      m.H3(title),
      m.P({ class: "feature-description", children: description }),
      link,
    ],
  });

const ArchitectureGraphic = () =>
  m.Div({
    class: "architecture-graphic hero-graphic",
    "aria-label": "Maya build and runtime architecture",
    children: [
      m.Div({
        class: "architecture-topline",
        children: [
          m.Span("TypeScript in"),
          m.Span({ class: "live-chip", children: "DOM alive" }),
        ],
      }),
      m.Div({
        class: "architecture-flow",
        children: [
          m.Div({
            class: "architecture-node source-node",
            children: [m.Span("01"), m.Strong("page.ts"), m.Small("m.Html(…)")],
          }),
          m.Div({ class: "flow-line", children: m.Span("build") }),
          m.Div({
            class: "architecture-node build-node",
            children: [
              m.Span("02"),
              m.Strong("Brahma"),
              m.Small("static output"),
            ],
          }),
          m.Div({ class: "flow-line", children: m.Span("mount") }),
          m.Div({
            class: "architecture-node dom-node",
            children: [
              m.Span("03"),
              m.Strong("Real DOM"),
              m.Small("exact updates"),
            ],
          }),
        ],
      }),
      m.Div({
        class: "dom-preview",
        children: [
          m.Div({ class: "dom-preview-nav", children: [m.I(), m.I(), m.I()] }),
          m.Div({
            class: "dom-preview-body",
            children: [
              m.Span({ class: "preview-kicker", children: "STATIC SHELL" }),
              m.Div({ class: "preview-title", children: [m.I(), m.I()] }),
              m.Div({ class: "preview-grid", children: [m.I(), m.I(), m.I()] }),
            ],
          }),
        ],
      }),
      m.P({
        class: "graphic-caption",
        children: "No virtual tree between your code and the interface.",
      }),
    ],
  });

const RoutingGraphic = () =>
  m.Div({
    class: "claim-graphic routing-graphic",
    "aria-label": "File routes become independent static pages",
    children: [
      m.Div({
        class: "graphic-title",
        children: [m.Span("MPA map"), m.Em("3 routes · 0 routers")],
      }),
      m.Div({
        class: "route-row",
        children: [
          m.Code("dev/page.ts"),
          m.Span({ class: "route-arrow", children: "→" }),
          m.Strong("/index.html"),
        ],
      }),
      m.Div({
        class: "route-row",
        children: [
          m.Code("dev/docs/page.ts"),
          m.Span({ class: "route-arrow", children: "→" }),
          m.Strong("/docs/index.html"),
        ],
      }),
      m.Div({
        class: "route-row",
        children: [
          m.Code("dev/about.page.ts"),
          m.Span({ class: "route-arrow", children: "→" }),
          m.Strong("/about.html"),
        ],
      }),
      m.Div({
        class: "static-reactive-line",
        children: [m.Span("static pages"), m.I(), m.Span("reactive islands")],
      }),
    ],
  });

const ControlFlowGraphic = () =>
  m.Div({
    class: "claim-graphic control-graphic",
    "aria-label": "Maya If, For, and Switch control components",
    children: [
      m.Div({ class: "control-root", children: "state" }),
      m.Div({ class: "control-trunk" }),
      m.Div({
        class: "control-cards",
        children: [
          m.Div({ children: [m.Strong("If"), m.Small("truthy / falsy")] }),
          m.Div({
            class: "is-accent",
            children: [m.Strong("For"), m.Small("keyed lists")],
          }),
          m.Div({ children: [m.Strong("Switch"), m.Small("named cases")] }),
        ],
      }),
      m.P({ children: "Readable control flow is part of the element tree." }),
    ],
  });

const SignalGraphic = () =>
  m.Div({
    class: "claim-graphic signal-graphic",
    "aria-label": "Interactive signal updating exact DOM nodes",
    children: [
      m.Div({
        class: "signal-toolbar",
        children: [
          m.Span({ children: [m.I(), "interactive playground"] }),
          m.Span({ class: "signal-toolbar-note", children: "no virtual DOM" }),
        ],
      }),
      m.Div({
        class: "signal-action-card",
        children: [
          m.Div({
            children: [
              m.P({ class: "signal-try-kicker", children: "TRY IT NOW" }),
              m.Strong("Make the DOM move."),
              m.Small({
                id: "signal-demo-instructions",
                children:
                  "Tap the bright button and watch the highlighted values update instantly.",
              }),
            ],
          }),
          m.Div({
            class: "signal-button-group",
            children: [
              m.Button({
                type: "button",
                class: "signal-button",
                "aria-label": "Increment the signal value by one",
                "aria-describedby": "signal-demo-instructions",
                onclick: () => {
                  signalValue.value = signalValue.value + 1;
                },
                children: [m.Span("Tap to update"), m.Strong("+1")],
              }),
              m.Button({
                type: "button",
                class: "signal-reset-button",
                onclick: () => {
                  signalValue.value = 12;
                },
                children: "Reset",
              }),
            ],
          }),
        ],
      }),
      m.Div({
        class: "signal-flow",
        children: [
          m.Div({
            class: "signal-cell source",
            children: [m.Small("source"), m.Strong(sourceValue)],
          }),
          m.Div({ class: "signal-pulse", children: [m.I(), m.I(), m.I()] }),
          m.Div({
            class: exactCellClass,
            role: "status",
            "aria-live": "polite",
            children: [m.Small("exact text node ×2"), m.Strong(computedValue)],
          }),
        ],
      }),
      m.Div({
        class: "signal-dom-tree",
        children: [
          m.Code("<main>"),
          m.Code("  <aside>untouched</aside>"),
          m.Code({
            class: "signal-updated-node",
            children: outputMarkup,
          }),
          m.Code("</main>"),
        ],
      }),
    ],
  });

const TargetsGraphic = () =>
  m.Div({
    class: "claim-graphic targets-graphic",
    "aria-label": "Web, progressive web app, and Chrome extension targets",
    children: [
      m.Div({
        class: "target-card target-web",
        children: [
          m.Span({ class: "target-icon", children: "⌁" }),
          m.Strong("Web"),
          m.Small("static MPA"),
        ],
      }),
      m.Div({
        class: "target-card target-pwa",
        children: [
          m.Span({ class: "target-icon", children: "▣" }),
          m.Strong("PWA"),
          m.Small("typed manifest"),
        ],
      }),
      m.Div({
        class: "target-card target-ext",
        children: [
          m.Span({ class: "target-icon", children: "⬡" }),
          m.Strong("Extension"),
          m.Small("Manifest V3"),
        ],
      }),
      m.Div({ class: "target-base", children: "one TypeScript toolchain" }),
    ],
  });

const KeyedListGraphic = () =>
  m.Div({
    class: "claim-graphic keyed-graphic",
    "aria-label":
      "Keyed list items keep their DOM identity while being reordered",
    children: [
      m.Div({
        class: "keyed-column",
        children: [
          m.Small("before"),
          m.Div({ children: [m.I({ class: "key-a" }), m.Code("#a · Alpha")] }),
          m.Div({ children: [m.I({ class: "key-b" }), m.Code("#b · Beta")] }),
          m.Div({ children: [m.I({ class: "key-c" }), m.Code("#c · Gamma")] }),
        ],
      }),
      m.Div({
        class: "keyed-shuffle",
        children: [m.Span("shuffle"), m.Strong("⇢")],
      }),
      m.Div({
        class: "keyed-column",
        children: [
          m.Small("after"),
          m.Div({ children: [m.I({ class: "key-c" }), m.Code("#c · Gamma")] }),
          m.Div({ children: [m.I({ class: "key-a" }), m.Code("#a · Alpha")] }),
          m.Div({ children: [m.I({ class: "key-b" }), m.Code("#b · Beta")] }),
        ],
      }),
      m.P({ children: [m.I(), "same nodes · new positions"] }),
    ],
  });

const LifecycleGraphic = () =>
  m.Div({
    class: "claim-graphic lifecycle-graphic",
    "aria-label": "Unmounted subtrees trigger lifecycle cleanup",
    children: [
      m.Div({
        class: "lifecycle-tree",
        children: [
          m.Code("<section>"),
          m.Code("  <card>"),
          m.Code({ class: "removed-node", children: "    <button />" }),
          m.Code("  </card>"),
          m.Code("</section>"),
        ],
      }),
      m.Div({ class: "lifecycle-arrow", children: "→" }),
      m.Div({
        class: "lifecycle-cleanup",
        children: [
          m.Span("onunmount"),
          m.Strong("cleanup complete"),
          m.Small("listener called"),
          m.Small("effects disposed"),
        ],
      }),
      m.P("MutationObserver walks removed subtrees deepest-first."),
    ],
  });

const DeploymentGraphic = () =>
  m.Div({
    class: "claim-graphic deployment-graphic",
    "aria-label": "Build once and deploy static files to edge hosting",
    children: [
      m.Div({
        class: "deploy-stage",
        children: [
          m.Span("BUILD"),
          m.Strong("Brahma publish"),
          m.Small("HTML · CSS · JS"),
        ],
      }),
      m.Div({ class: "deploy-rail", children: [m.I(), m.I(), m.I(), m.I()] }),
      m.Div({
        class: "deploy-destinations",
        children: [
          m.Div({ children: [m.Span("CDN"), m.Small("edge-ready")] }),
          m.Div({ children: [m.Span("GH"), m.Small("Pages-ready")] }),
          m.Div({ children: [m.Span("S3"), m.Small("static-ready")] }),
        ],
      }),
      m.P({ children: [m.Strong("$0"), " app server required"] }),
    ],
  });

const BenchmarkGraphic = () => {
  const rows = [
    ["Maya", "188k", "benchmark-100", "is-maya"],
    ["Svelte", "151k", "benchmark-80", ""],
    ["Vue", "119k", "benchmark-63", ""],
    ["React", "92k", "benchmark-49", ""],
    ["Angular", "74k", "benchmark-39", ""],
  ];

  return m.Div({
    class: "benchmark-graphic",
    "aria-label":
      "Benchmark comparison in thousands of DOM operations per second",
    children: [
      m.Div({
        class: "benchmark-axis-label",
        children: [
          m.Span("DOM operations / second"),
          m.Span("higher is better"),
        ],
      }),
      ...rows.map(([name, score, size, accent]) =>
        m.Div({
          class: `benchmark-row ${accent}`,
          children: [
            m.Strong(name),
            m.Div({
              class: "benchmark-track",
              children: m.I({ class: `benchmark-bar ${size}` }),
            }),
            m.Span(score),
          ],
        }),
      ),
      m.Div({
        class: "benchmark-scale",
        children: [
          m.Span("0"),
          m.Span("50k"),
          m.Span("100k"),
          m.Span("150k"),
          m.Span("200k"),
        ],
      }),
    ],
  });
};

export default Page({
  title: "Maya — TypeScript to the real DOM",
  headElements: [
    m.Meta({
      name: "description",
      content:
        "Maya is an MPA-first TypeScript UI framework with fine-grained signals, direct DOM access, and a static-first Brahma toolchain.",
    }),
    m.Meta({ name: "theme-color", content: "#ff5c35" }),
  ],
  app: [
    m.Main({
      id: "top",
      children: [
        m.Section({
          class: "hero-section",
          children: [
            m.Div({
              class: "hero-copy",
              children: [
                m.P({
                  class: "hero-kicker",
                  children: "MPA-first · TypeScript-native · DOM-direct",
                }),
                m.H1({
                  children: [
                    "Build for the web.",
                    m.Br(),
                    m.Span("Stay close to it."),
                  ],
                }),
                m.P({
                  class: "hero-lede",
                  children:
                    "Maya turns TypeScript pages into static HTML, then brings them alive with signals that update the exact DOM nodes you intended—no virtual DOM, hydration, or app server in the way.",
                }),
                m.Div({
                  class: "hero-actions",
                  children: [
                    m.A({
                      class: "button button-primary",
                      href: "/tutorial/",
                      children: "Build your first app →",
                    }),
                    m.A({
                      class: "button button-secondary",
                      href: "/docs/",
                      children: "Read the docs",
                    }),
                  ],
                }),
                m.A({
                  class: "hero-live-link",
                  href: "#signals",
                  children: [
                    m.I({ "aria-hidden": "true" }),
                    m.Span("Try the live Signal demo"),
                    m.Strong({ "aria-hidden": "true", children: "↓" }),
                  ],
                }),
                m.Div({
                  class: "hero-proof",
                  children: [
                    m.Span({ children: [m.Strong("100%"), " TypeScript UI"] }),
                    m.Span({ children: [m.Strong("0"), " virtual DOM"] }),
                    m.Span({ children: [m.Strong("3"), " app targets"] }),
                  ],
                }),
              ],
            }),
            ArchitectureGraphic(),
          ],
        }),

        m.Section({
          class: "logo-strip",
          "aria-label": "Maya principles",
          children: [
            m.P("A smaller conceptual stack for"),
            m.Div({
              children: [
                m.Span("STATIC-FIRST"),
                m.Span("SIGNAL-POWERED"),
                m.Span("COMPONENT-DRIVEN"),
                m.Span("EDGE-READY"),
              ],
            }),
          ],
        }),

        m.Section({
          id: "language",
          class: "story-section",
          children: [
            SectionLabel("01", "ONE LANGUAGE, END TO END"),
            m.Div({
              class: "section-heading",
              children: [
                m.H2({
                  children: [
                    "The browser platform,",
                    m.Br(),
                    m.Span("written in TypeScript."),
                  ],
                }),
                m.P(
                  "Maya’s templating syntax is TypeScript that reads like HTML. There is no JSX dialect or SCSS layer to learn before you can make a useful interface.",
                ),
              ],
            }),
            m.Div({
              class: "feature-split",
              children: [
                FeatureHeading(
                  "ONE LANGUAGE",
                  "A page is just a typed expression.",
                  "Markup, behavior, and composition stay together in TypeScript. Native element factories keep the shape familiar while the compiler keeps it honest.",
                  ArrowLink("Explore Maya syntax", "/docs/"),
                ),
                CodeWindow(
                  "page.ts",
                  `import { m } from "@cyftec/maya";
import { signal, tmpl } from "@cyftec/maya/signal";

const count = signal(0);

export default m.Button({
  onclick: () => count.value++,
  children: tmpl\`Count: \${count}\`,
});`,
                  "typescript-window",
                ),
              ],
            }),
          ],
        }),

        m.Section({
          id: "architecture",
          class: "story-section architecture-section",
          children: [
            SectionLabel("02", "STATIC STRUCTURE, DYNAMIC BEHAVIOR"),
            m.Div({
              class: "section-heading",
              children: [
                m.H2({
                  children: ["Real pages.", m.Br(), m.Span("Real DOM.")],
                }),
                m.P(
                  "Maya is MPA-first. Brahma writes static pages, Maya mounts the real DOM, and signals keep the parts that need to move precisely reactive.",
                ),
              ],
            }),
            m.Div({
              class: "feature-grid feature-grid-three",
              children: [
                m.Article({
                  class: "feature-card",
                  children: [
                    FeatureHeading(
                      "MULTI-PAGE BY DEFAULT",
                      "Files become pages—not routes in disguise.",
                      "A Maya app resembles the durable HTML–CSS–JS web: independent static documents with page-local JavaScript and no client router required.",
                    ),
                    RoutingGraphic(),
                  ],
                }),
                m.Article({
                  class: "feature-card",
                  children: [
                    FeatureHeading(
                      "COMPONENTS + DOM",
                      "Compose freely. Reach the node directly.",
                      "Component-driven architecture does not put the browser behind a framework escape hatch. Element getters resolve to actual DOM nodes.",
                    ),
                    CodeWindow(
                      "direct-dom.ts",
                      `const panel = m.Article({
  children: "Native DOM node",
});

m.Button({
  onclick: () =>
    panel().toggleAttribute("data-open"),
  children: "Toggle panel",
});`,
                      "compact-code-window",
                    ),
                  ],
                }),
                m.Article({
                  class: "feature-card",
                  children: [
                    FeatureHeading(
                      "CONTROL COMPONENTS",
                      "Say If, For, and Switch when that is what you mean.",
                      "Built-in control components replace noisy conditional markup. Use them for clarity—or use ordinary TypeScript whenever it fits better.",
                    ),
                    ControlFlowGraphic(),
                  ],
                }),
              ],
            }),
          ],
        }),

        m.Section({
          id: "signals",
          class: "signal-section",
          children: [
            m.Div({
              class: "signal-section-copy",
              children: [
                SectionLabel("03", "FINE-GRAINED REACTIVITY"),
                m.H2({
                  children: [
                    "Change the data.",
                    m.Br(),
                    m.Span("Only the right node moves."),
                  ],
                }),
                m.P(
                  "Signals are small reactive data units that notify the computations that read them. Maya uses those effects to surgically update a text node, child position, or attribute—not re-render an entire component tree.",
                ),
                m.Div({
                  class: "signal-links",
                  children: [
                    ArrowLink("Explore Signal", "https://signal.cyfer.tech"),
                    ArrowLink("Read Maya reactivity docs", "/docs/"),
                  ],
                }),
              ],
            }),
            SignalGraphic(),
          ],
        }),

        m.Section({
          id: "runtime",
          class: "story-section runtime-section",
          children: [
            SectionLabel("04", "RUNTIME DISCIPLINE"),
            m.Div({
              class: "section-heading",
              children: [
                m.H2({
                  children: [
                    "Convenient at author-time.",
                    m.Br(),
                    m.Span("Careful at run-time."),
                  ],
                }),
                m.P(
                  "Maya keeps its low-level promises visible: browser attributes remain typed, keyed nodes keep their identity, and removed subtrees release their reactive work.",
                ),
              ],
            }),
            m.Div({
              class: "feature-grid runtime-grid",
              children: [
                m.Article({
                  class: "feature-card runtime-card typed-card",
                  children: [
                    FeatureHeading(
                      "TYPED BROWSER CONTRACTS",
                      "Autocomplete for the platform—not an invented prop API.",
                      "Tag-specific attribute grammars guide valid values in TypeScript. Runtime sanitizers also reject dangerous href schemes and unsafe inline style expressions.",
                    ),
                    CodeWindow(
                      "typed-elements.ts",
                      `m.Input({
  type: "email",
  required: true,
});

m.Button({ type: "submit" });
m.Link({ rel: "stylesheet" });

// runtime URL/style sanitizers
m.A({ href: trustedUrl });`,
                      "compact-code-window typed-code-window",
                    ),
                  ],
                }),
                m.Article({
                  class: "feature-card runtime-card keyed-card",
                  children: [
                    FeatureHeading(
                      "KEYED BY IDENTITY",
                      "Move the list without throwing its nodes away.",
                      "Give m.For an itemKey and Maya preserves matching element getters through shuffles and updates, while per-item signals carry the changed data.",
                    ),
                    KeyedListGraphic(),
                  ],
                }),
                m.Article({
                  class: "feature-card runtime-card lifecycle-card",
                  children: [
                    FeatureHeading(
                      "LIFECYCLE-AWARE",
                      "Reactive work ends when its DOM leaves.",
                      "When onunmount is used, Maya observes removed subtrees, calls lifecycle listeners from the deepest child upward, and disposes the signal effects attached to those elements.",
                    ),
                    LifecycleGraphic(),
                  ],
                }),
              ],
            }),
          ],
        }),

        m.Section({
          id: "toolchain",
          class: "story-section toolchain-section",
          children: [
            SectionLabel("05", "ONE TOOLCHAIN, THREE TARGETS"),
            m.Div({
              class: "section-heading",
              children: [
                m.H2({
                  children: [
                    "Brahma handles the journey.",
                    m.Br(),
                    m.Span("Karma keeps the map."),
                  ],
                }),
                m.P(
                  "Create, continuously develop, build, and publish Maya apps from one dedicated CLI—with project behavior gathered into one typed configuration file.",
                ),
              ],
            }),
            m.Div({
              class: "feature-grid toolchain-grid",
              children: [
                m.Article({
                  class: "feature-card tool-card terminal-card",
                  children: [
                    FeatureHeading(
                      "BRAHMA CLI",
                      "From empty folder to publishable app.",
                      "Spawn a project, install its declared dependencies, run a watched staging server, and emit minified production files.",
                      ArrowLink("Open Brahma docs", "/docs/"),
                    ),
                    CodeWindow(
                      "terminal",
                      `$ brahma create hello-maya
✓ web scaffold created

$ cd hello-maya && brahma install
✓ dependencies synchronized from karma.ts

$ brahma stage
→ watching dev/ at localhost:3000

$ brahma publish
✓ static production build ready`,
                      "terminal-window",
                    ),
                  ],
                }),
                m.Article({
                  class: "feature-card tool-card targets-card",
                  children: [
                    FeatureHeading(
                      "WEB · PWA · EXT",
                      "Choose the shell. Keep the same mental model.",
                      "Brahma creates web, PWA, or Chrome extension scaffolds. Manifests stay in TypeScript, so platform fields come with autocomplete and type checking.",
                    ),
                    TargetsGraphic(),
                  ],
                }),
                m.Article({
                  class: "feature-card tool-card karma-card",
                  children: [
                    FeatureHeading(
                      "KARMA.TS",
                      "The configuration center, not another config pile.",
                      "Build paths, serve behavior, dependencies, Git ignores, and editor settings live together in one project-level TypeScript file.",
                    ),
                    CodeWindow(
                      "karma.ts",
                      `export const karma = {
  brahma: {
    build: { publishDir: "docs" },
    serve: { port: 3000 },
  },
  maya: {
    appType: "web",
    dependencies: { "@cyftec/maya": "latest" },
  },
};`,
                      "karma-window",
                    ),
                  ],
                }),
              ],
            }),
          ],
        }),

        m.Section({
          id: "deploy",
          class: "deploy-section",
          children: [
            m.Div({
              class: "deploy-copy",
              children: [
                SectionLabel("06", "BUILD COMPLETELY BEFORE DEPLOYMENT"),
                m.H2({
                  children: [
                    "Ship the app.",
                    m.Br(),
                    m.Span("Skip the app server."),
                  ],
                }),
                m.P(
                  "Brahma emits static HTML, CSS, and page-local JavaScript before deployment. Your fully reactive interface can live on a CDN, object storage, or GitHub Pages—without a cloud compute machine running it.",
                ),
                ArrowLink("See the production workflow", "/docs/"),
              ],
            }),
            DeploymentGraphic(),
          ],
        }),

        m.Section({
          id: "benchmark",
          class: "benchmark-section",
          children: [
            m.Div({
              class: "benchmark-copy",
              children: [
                SectionLabel("07", "THE MAYA BENCHMARK"),
                m.P({
                  class: "benchmark-stat",
                  children: [m.Strong("2.04×"), " React throughput"],
                }),
                m.H2("A direct path pays off."),
                m.P(
                  "In the Maya Benchmark’s 10,000-row keyed mutation test, Maya’s exact-node updates deliver 188,000 DOM operations per second.",
                ),
                ArrowLink(
                  "Open the full benchmark",
                  "https://benchmark.maya.cyfer.tech/",
                  "button button-light",
                ),
                m.Small(
                  "Maya Benchmark v1 · Chromium 140 · Apple M3 Pro · median of 50 runs. Exact result set used by the linked benchmark site.",
                ),
              ],
            }),
            BenchmarkGraphic(),
          ],
        }),

        m.Section({
          class: "closing-section",
          children: [
            m.P({ class: "eyebrow", children: "START CLOSE TO THE PLATFORM" }),
            m.H2({
              children: [
                "Build something that feels",
                m.Br(),
                "like the web—because it is.",
              ],
            }),
            m.Div({
              class: "closing-actions",
              children: [
                m.A({
                  class: "button button-primary",
                  href: "/tutorial/",
                  children: "Start the tutorial →",
                }),
                m.A({
                  class: "button button-secondary",
                  href: "https://github.com/cyftec/maya-ui",
                  target: "_blank",
                  rel: "noreferrer",
                  children: "View source ↗",
                }),
                m.A({
                  class: "button button-secondary",
                  href: "https://www.npmjs.com/package/@cyftec/maya",
                  target: "_blank",
                  rel: "noreferrer",
                  children: "Maya on npm ↗",
                }),
              ],
            }),
          ],
        }),
      ],
    }),
  ],
});
