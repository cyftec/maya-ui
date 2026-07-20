import { m } from "@cyftec/maya/core";
import { Article, Bullets, Code, Note, Paragraphs, Section } from "./article";

export const Syntax = Article(
  m.H3({ class: "black", children: "Syntax is TypeScript" }),
  Paragraphs(
    "Maya does not add a template language. You write normal TypeScript and call functions that describe the DOM. The visual mapping is close to HTML, but every node is an expression.",
    "Use a direct child for a short element, or pass an object when you need attributes, events, and children together.",
  ),
  Code(`m.Div("A short child")

m.Div({
  class: "card",
  children: [m.H2("A heading"), m.P("A paragraph")],
})`),
  Bullets(
    "HTML tags become capitalized m factories.",
    "The children property contains a string, element getter, array, or supported signal value.",
    "Events receive functions, not quoted HTML event strings.",
    "Use normal JavaScript and TypeScript wherever it makes the code clearer.",
  ),
);

export const Overview = Article(
  m.H3({ class: "black", children: "From one element to an app" }),
  Paragraphs(
    "A Maya application is assembled from small getters. Elements compose into fragments, fragments become components, and a default page getter gives Brahma an entry point to build.",
    "There is no virtual DOM tree to learn. When the page is mounted, the same getter sequence attaches behavior to the static nodes that were already generated.",
  ),
  Code(`const Card = () =>
  m.Article({
    class: "card",
    children: [m.H2("Title"), m.P("Content")],
  });

export default m.Html({
  children: [
    m.Head(m.Title("My page")),
    m.Body([m.Script({ src: "main.js", defer: true }), Card()]),
  ],
});`),
  Note(
    "The builder calls the default export during build. A page must be safe to evaluate in JSDOM.",
  ),
);

export const Element = Article(
  m.H3({ class: "black", children: "Elements are getters" }),
  Paragraphs(
    "Calling m.Div(...) returns an element getter. Calling that getter creates the element during build, or finds its matching static element during mount.",
    "This is why a getter can be passed around as a child and reused by a component without needing a special template compiler.",
  ),
  Code(`const title = m.H1("Welcome");
const content = m.Main([
  title,
  m.P({ id: "intro", children: "Read this first." }),
]);

const node = content();`),
  Section(
    "Element props",
    Bullets(
      "class, id, href, value, and data-* become attributes.",
      "onclick, oninput, and other supported lower-case event keys register listeners.",
      "onmount and onunmount are lifecycle callbacks for browser-only work and cleanup.",
    ),
  ),
);

export const Fragment = Article(
  m.H3({ class: "black", children: "Fragments group children" }),
  Paragraphs(
    "A fragment is a function that returns children rather than one wrapper element. Use it when a reusable piece of UI should contribute several siblings to its parent.",
    "The low-level fragment helper also powers component(). For simple static pieces, a plain function returning an array of children is enough.",
  ),
  Code(`const Actions = () => [
  m.Button({ children: "Save" }),
  m.Button({ children: "Cancel" }),
];

const Toolbar = () =>
  m.Div({ children: [m.Strong("Actions"), Actions()] });`),
);

export const Component = Article(
  m.H3({ class: "black", children: "Components add a typed boundary" }),
  Paragraphs(
    "Use component() when a reusable function has named props. Maya normalizes ordinary props so the implementation can read them through .value, while signals and callback functions remain usable as signals and functions.",
  ),
  Code(`import { component, m } from "@cyftec/maya/core";

type BadgeProps = { label: string; tone: string };
const Badge = component<BadgeProps>(({ label, tone }) =>
  m.Span({ class: tone.value, children: label.value }),
);

Badge({ label: "New", tone: "theme-col" });`),
  Note(
    "A component is your TypeScript function; m.Div and m.Span are the element factories it composes.",
  ),
);

export const Props = Article(
  m.H3({ class: "black", children: "Props describe data and behavior" }),
  Paragraphs(
    "Pass attributes directly to an element and named values to a component. Keep callback props as functions so the child can connect them to a DOM event.",
    "For reactive values, pass a signal. Maya's element and attribute logic will track it and update the exact target when the signal changes.",
  ),
  Code(`type CounterProps = {
  value: ReturnType<typeof signal<number>>;
  onIncrement: () => void;
};

const Counter = component<CounterProps>(({ value, onIncrement }) =>
  m.Button({ onclick: onIncrement, children: tmpl\`Count: \${value}\` }),
);`),
  Note(
    "A value prop is data. An onSomething prop is behavior. A signal prop is data that may change.",
  ),
);

export const Page = Article(
  m.H3({ class: "black", children: "A page is a default export" }),
  Paragraphs(
    "Brahma recognizes a file as a page when its filename matches karma.brahma.build.buildablePageFileName. The page module's default export must be the root Maya HTML getter.",
    "Include the generated page script in the body. It mounts the page and starts the run phase in the browser.",
  ),
  Code(`import { m } from "@cyftec/maya/core";

export default m.Html({
  lang: "en",
  children: [
    m.Head([m.Title("Home")]),
    m.Body([
      m.Script({ src: "main.js", defer: true }),
      m.Main(m.H1("Home page")),
    ]),
  ],
});`),
);

export const FolderRoutes = Article(
  m.H3({ class: "black", children: "Folders become routes" }),
  Paragraphs(
    "Brahma uses the view folder structure as the URL structure. Put page.ts inside a folder for an index page, and use a dotted page filename for a single named HTML file.",
  ),
  Code(
    `dev/view/page.ts            -> /index.html
dev/view/docs/page.ts        -> /docs/index.html
dev/view/docs/signals/page.ts -> /docs/signals/index.html
dev/view/contact.page.ts     -> /contact.html`,
  ),
  Bullets(
    "Relative imports follow the source folder structure.",
    "Relative links should point to the built route.",
    "The generated script name follows the page route.",
  ),
);
