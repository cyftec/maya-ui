import { m } from "@cyftec/maya/core";
import { Article, Code, Paragraphs, Section } from "../article";

export const Maya = Article(
  m.H3({ class: "black", children: "Maya is the UI runtime" }),
  Paragraphs(
    "Maya turns TypeScript expressions into real DOM elements. Its m object contains one capitalized factory for each supported HTML tag, such as m.Div, m.H1, and m.Button.",
    "Maya is built on UI mutation philosophy and thus the browser DOM remains the actual UI tree, eliminating the need of any Virtual DOM like ther in other frrameworks. Maya remembers the exact nodes it created with the help of Signals, and then signal effects update only the text, child position, or attribute that depends on changed signal state.",
  ),
  Code(`import { m } from "@cyftec/maya/core";

const greeting = m.H1("Hello Maya");

const page = m.Main([
  greeting,
  m.P("This is a real TypeScript expression."),
]);`),
  Section(
    "Three phases",
    m.Ol({
      children: [
        m.Li({
          class: "mb2",
          children:
            "Build: Brahma runs you app view (page.ts) in JSDOM and builds static HTML multi-page-app (MPA).",
        }),
        m.Li({
          class: "mb2",
          children:
            "Mount: the page script finds those nodes using data-elem-id markers.",
        }),
        m.Li({
          class: "mb2",
          children:
            "Run: events and signal effects are now allowed to change the DOM.",
        }),
      ],
    }),
  ),
  Code(
    `TypeScript page -> static HTML with markers -> mount existing DOM -> run reactive effects`,
  ),
);
