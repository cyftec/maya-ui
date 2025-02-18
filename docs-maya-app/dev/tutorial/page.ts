import { Child, m } from "@mufw/maya";
import { Page } from "../@libs/components/Page";
import { Button, Link, Navbar, TitledList } from "../@libs/elements";
import { derived, signal } from "@cyftech/signal";

const chapters = [
  {
    title: "Before Starting",
    topics: [
      {
        title: "Prerequisite",
        href: undefined,
      },
      {
        title: "Getting familiar with templating syntax",
        href: undefined,
      },
      {
        title: "Disclaimer",
        href: undefined,
      },
    ],
  },
  {
    title: "Project Setup",
    topics: [
      {
        title: "Installations & setup",
        href: undefined,
      },
      {
        title: "Create your first app",
        href: undefined,
      },
      {
        title: "Understanding app structure",
        href: undefined,
      },
      {
        title: "Brahma, Karma & Maya",
        href: undefined,
      },
    ],
  },
  {
    title: "Tic Tac Toe",
    topics: [
      {
        title: "Syntax",
        href: undefined,
      },
      {
        title: "Overview",
        href: undefined,
      },
      {
        title: "Element",
        href: undefined,
      },
      {
        title: "component",
        href: undefined,
      },
      {
        title: "Props",
        href: undefined,
      },
      {
        title: "Page",
        href: undefined,
      },
      {
        title: "App structure",
        href: undefined,
      },
    ],
  },
  {
    title: "Todos List",
    topics: [
      {
        title: "What is signal?",
        href: undefined,
      },
      {
        title: "Custom implementation",
        href: undefined,
      },
      {
        title: "Effect",
        href: undefined,
      },
      {
        title: "Derived signals",
        href: undefined,
      },
      {
        title: "Signal for mutating list",
        href: undefined,
      },
    ],
  },
  {
    title: "Living Room",
    topics: [
      {
        title: "Default HTML page",
        href: undefined,
      },
      {
        title: "Router",
        href: undefined,
      },
      {
        title: "UI toolkit",
        href: undefined,
      },
    ],
  },
];

const CODE_EXAMPLES = {
  HTML: {
    title: "HTML",
    code: `<div
  id="container"
  class="parent-class card"
>
  <h3>My Blog Title</h3>
  <p
    style="background-color: yellow;"
  >
    Highlighted Paragraph.
  </p>
  <p>Normal Paragraph.</p>
  <ul>
    Some list items
    <li>Item 1</li>
    <li>Item 2</li>
    <li>Item 3</li>
  <ul>
</div>
`,
  },
  MAYA: {
    title: "Maya",
    code: `m.Div({
  id: "container",
  class: "parent-class card",
  children: [
    m.H3("My Blog Title"),
    m.P({
      style: "background-color: yellow;",
      children: "Highlighted Paragraph.",
    }),
    m.P("Normal Paragraph."),
    m.Ul([
      "Some list items",
      m.Li("Item 1"),
      m.Li("Item 2"),
      m.Li("Item 3"),
    ]),
  ],
})
`,
  },
};

const selectedTopicIndex = signal([0, 0]);

export default Page({
  title: "Tutorial - Maya",
  headElements: [
    m.Link({
      rel: "stylesheet",
      href: "https://cdn.jsdelivr.net/gh/highlightjs/cdn-release@11.9.0/build/styles/night-owl.css",
    }),
    m.Script({
      src: "https://cdn.jsdelivr.net/gh/highlightjs/cdn-release@11.9.0/build/highlight.min.js",
    }),
    m.Script({
      defer: true,
      children: `hljs.highlightAll();`,
    }),
  ],
  app: m.Div({
    children: [
      m.Div({
        class: "mb3 flex-ns flex-wrap items-center",
        children: [
          m.H1({
            class: "mh3 mv2 mv3-ns ml0-ns",
            children: "Tutorial",
          }),
          m.Div({
            class:
              "flex flex-wrap items-center ml3 ml0-ns f7 b silver light-silver-ns",
            children: m.For({
              subject: selectedTopicIndex,
              map: (_, i) => {
                const [chapterIndex, topicIndex] = selectedTopicIndex.value;
                console.log();
                return m.Div({
                  class: `mb2 mb0-ns pointer`,
                  children: [
                    "/",
                    m.Span({
                      class: "pa1 ph2-ns mh1 br3",
                      children:
                        i === 0
                          ? chapters[chapterIndex].title
                          : chapters[chapterIndex].topics[topicIndex]?.title,
                    }),
                  ],
                });
              },
            }),
          }),
        ],
      }),
      m.Div({
        class: "flex w-100 w-auto-ns",
        children: [
          Navbar({
            children: m.For({
              subject: chapters,
              n: Infinity,
              nthChild: m.P({
                class: "gray f6",
                children: "** end of list **",
              }),
              map: ({ title, topics }, chapterIndex) =>
                TitledList({
                  classNames: "mb4 pb3",
                  titleClassNames: "f4",
                  itemClassNames: "mb2 pb1 f6",
                  linkColorCss: "purple",
                  title: `${chapterIndex + 1}. ${title}`,
                  onLinkClick: (linkIndex) =>
                    (selectedTopicIndex.value = [chapterIndex, linkIndex]),
                  links: derived(() =>
                    topics.map((topic, topicIndex) => {
                      const [selectedChapter, selectedTopic] =
                        selectedTopicIndex.value;
                      return {
                        ...topic,
                        isSelected:
                          selectedChapter === chapterIndex &&
                          selectedTopic === topicIndex,
                      };
                    })
                  ),
                }),
            }),
          }),
          m.Div({
            class:
              "fg7 pl3 pr3 pl2-ns pr0-ns pb5 w-70-ns mw-100 w-auto-ns dark-gray gray-ns lh-copy-ns lh-title",
            children: [
              m.Div({
                class: "max-h-80 overflow-y-scroll",
                children: [
                  m.H2({
                    class: "mt0 lh-solid black mid-gray-ns",
                    children: derived(() => {
                      const [selectedChapter, selectedTopic] =
                        selectedTopicIndex.value;
                      return chapters[selectedChapter].topics[selectedTopic]
                        .title;
                    }),
                  }),
                  m.Div({
                    children: [
                      m.Div({
                        children: [
                          m.P(`
                           One of the pusposes of any web library or framework is to enable devs, to create web apps faster.
                           For that purpose, the most common approach is to use HTML-mimicing templates written in JavaScipt 
                           which finally create resulting DOM elements.
                           More mimicing the template is to the HTML, more easier it is for a dev to use it intuitively.
                           What template is more mimicing (to the HTML) than the raw HTML syntax itself? Here comes the JSX.
                           JSX is the most adapted solution where it puts (almost same) HTML syntax directly inside JavaScript as templates.
                           `),
                          m.P(`
                           Conclusively, we can say that the fastest way to create web apps is by putting both html and JS in the same
                           source file. But creating a new transpiler altogether for that puspose adds more
                           complexities besides solving few. Maya has a different approach. It prioritises using one
                           standard language (TS here) over a mixed language like JSX. For the template, it simply maps the structure
                           of an HTML tag to a JavaScript object. More on Maya's templating syntax rules later in this page
                           but before, just have a look into both HTML and Maya syntaxes. Hopefully, you would find a mapping
                           pattern (from HTML to Maya) just by seeing both the syntaxes, intuitively.
                           `),
                        ],
                      }),
                      m.Div({
                        class: "flex-ns w-100 w-auto-ns mv4 gray",
                        children: m.For({
                          subject: Object.values(CODE_EXAMPLES),
                          map: (example, index) =>
                            m.Div({
                              class: `b--gray br4 overflow-hidden mb3 lh-copy f6 w-100 w-auto-ns  ${
                                index === 0
                                  ? "br--left-ns br-ns"
                                  : "br--right-ns"
                              }`,
                              children: [
                                m.Div({
                                  class: "pv2 ph3 bg-black white f4",
                                  children: example.title,
                                }),
                                m.Pre({
                                  class: "ma0",
                                  children: m.Code(example.code),
                                }),
                              ],
                            }),
                        }),
                      }),
                      m.Br({}),
                      m.H3({
                        class: "mv0 lh-solid black mid-gray-ns",
                        children: `Basic syntax rules`,
                      }),
                      m.Ul({
                        class: "mb4",
                        children: m.For({
                          subject: [
                            `A Maya element is either a string or a (HTML equivalent template) function, for example,
                           "some string" or m.Span().`,
                            `The equivalent of HTML element in Maya is depicted as m.<Capitalised-HTML-tag>(). I.e.
                           HTML 'div' element in Maya will be represented as 'm.Div()'.`,
                            `The 'm' in 'm.Div' is an object which contains all the Maya elements like 'Div', 'P', 'Input', etc.`,
                            `The functional Maya element takes one of these as arguments - a Maya element, anrray of Maya elements or
                           an object, which consists of HTML attributes key-value pairs and/or 'children' as its properties.`,
                            `The 'children' property in the object passed in functional Maya Element as argument should have one of these
                           values - a Maya Element or an array of Maya Elements.`,
                            `Besides 'children', the other properties in the object passed in functional Maya Element as argument, are
                           nothing but HTML attributes. The key-value pairs of these properties should be the normal HTML
                           attribute key-value pairs.`,
                            `One difference here is that the value of an event attribute should
                           not be a string, unlike that in HTML but an actual (event listener) function. For example,
                           the equivalent of this HTML code - <button onclick="someFn()">click me</button> in Maya will be - 
                           m.Button({ onclick: function someFn(){}, children: "click me" }).`,
                          ],
                          map: (para) =>
                            m.Li({
                              class: "mb2",
                              children: para,
                            }),
                        }),
                      }),
                      m.P([
                        `You might still be confused about how to use this syntax. How to create components using this?
                       How to use a component in the app? Or, how to create an app or a page in the app using this?
                       Don't worry. As that will be covered in later chapters.
                       For all other syntax rules, please check `,
                        Link({
                          colorCss: "purple",
                          href: "/docs",
                          label: "documentation here",
                        }),
                        `. The basic rules mentioned above is enough for now for getting started.`,
                      ]),
                    ],
                  }),
                  m.Div({
                    class: "flex-ns justify-stretch mv4 w-100",
                    children: m.For({
                      subject: selectedTopicIndex,
                      n: 1,
                      nthChild: m.Div({
                        class: "mh3",
                      }),
                      map: (_, i) => {
                        let [chapterIndex, topicIndex] =
                          selectedTopicIndex.value;
                        let chapter = "",
                          topic = "";
                        const isPrevChapterCase = i === 0;
                        const isNextChapterCase = i === 1;

                        if (isPrevChapterCase) {
                          if (topicIndex > 0) {
                            topicIndex += -1;
                          } else {
                            chapterIndex += -1;
                            topicIndex =
                              (chapters[chapterIndex]?.topics.length || 0) - 1;
                          }
                        }

                        if (isNextChapterCase) {
                          if (
                            topicIndex <
                            chapters[chapterIndex]?.topics.length - 1
                          ) {
                            topicIndex += 1;
                          } else {
                            chapterIndex += 1;
                            topicIndex = 0;
                          }
                        }

                        chapter = chapters[chapterIndex]?.title || "";
                        topic =
                          chapters[chapterIndex]?.topics[topicIndex]?.title ||
                          "";

                        return m.If({
                          subject: chapter && topic,
                          isTruthy: Button({
                            classNames: "w-100 mt3",
                            onClick: () =>
                              (selectedTopicIndex.value = [
                                chapterIndex,
                                topicIndex,
                              ]),
                            label: m.Div({
                              class: "tc",
                              children: [
                                i === 0
                                  ? "&larr; Previous Topic"
                                  : "Next Topic &rarr;",
                                m.Div({
                                  class: "f7 mt1",
                                  children: [
                                    m.Span({
                                      class: "silver",
                                      children: chapter + ": ",
                                    }),
                                    m.Span({
                                      class: "black",
                                      children: topic,
                                    }),
                                  ],
                                }),
                              ],
                            }),
                          }),
                        });
                      },
                    }),
                  }),
                ],
              }),
            ],
          }),
        ],
      }),
    ],
  }),
});
