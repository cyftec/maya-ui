import { m } from "@cyftec/maya";
import { Article, Bullets, Code, Note, Paragraphs, Section } from "./article";

export const StaticVsReactive = Article(
  m.H3({ class: "black", children: "Static and reactive pages" }),
  Paragraphs(
    "A static Maya page uses ordinary strings and elements. Brahma can build it completely, and the browser only needs the generated page script if it has interactions.",
    "A reactive page adds signals. The initial value still becomes static HTML, but the mounted page also registers effects that update individual nodes or attributes as state changes.",
  ),
  Code(`const message = "Always the same";
const count = signal(0); // source number signal
const countLabel = tmpl\`Clicks: \${count}\`; // derived string signal

m.Div([
  m.P(message),
  m.P(countLabel),
  m.Button({ onclick: () => count.value++, children: "Click" }),
]);`),
  Note(
    "Both kinds of page are built ahead of time. Reactive does not mean the whole page is re-rendered. It only mean that when prebuilt reactive page is loaded and mounted in the browser, the DOM gets mutated when the signalled attributes or nodes changes",
  ),
);

export const WhatIsSignal = Article(
  m.H3({ class: "black", children: "A signal is changing state" }),
  Paragraphs(
    "A signal is a small state container with a .value. Read its value to use the current state, and assign a new value to notify the computations that read it.",
    "Maya re-exports signal helpers from @cyftec/maya/signal, including signal, derive, effect, and tmpl.",
  ),
  Code(`const name = signal("Ada");
const greeting = m.P({ children: tmpl\`Hello, \${name}!\` });

name.value = "Grace";`),
  Bullets(
    "signal(value) creates mutable source state.",
    "Reading .value inside a reactive computation records a dependency.",
    "Assigning .value causes dependent effects and derived signals to run.",
  ),
);

export const Effect = Article(
  m.H3({ class: "black", children: "Effects run when dependencies change" }),
  Paragraphs(
    "effect() runs its callback immediately and again whenever a signal read by that callback changes. Maya uses this mechanism internally for reactive children and attributes.",
    "Usually, let an element consume the signal directly. Use an explicit effect when you need an imperative side effect such as logging or synchronizing a browser API.",
  ),
  Code(`const count = signal(0);

effect(() => {
  console.log("The count is", count.value);
});

count.value = 1; // the effect runs again`),
  Note(
    "Keep signal reads inside the effect callback so the dependency is tracked.",
  ),
);

export const DerivedSignals = Article(
  m.H3({ class: "black", children: "Derived signals calculate values" }),
  Paragraphs(
    "derive() creates read-only state from other signals. It recalculates when the signals read in its callback change, which keeps display logic out of event handlers.",
  ),
  Code(`const first = signal("Ada");
const last = signal("Lovelace");
const fullName = derive(() =>
  \`\${first.value} \${last.value}\`,
);

m.P({ children: fullName });`),
  Section(
    "Choose the right primitive",
    Bullets(
      "Use signal for state an event handler changes.",
      "Use derive for a value calculated from state.",
      "Use effect for an imperative action after a dependency changes.",
      "Use tmpl for a convenient derived string in text or attributes.",
    ),
  ),
);

export const SignalForReactivity = Article(
  m.H3({ class: "black", children: "Signals connect UI to state" }),
  Paragraphs(
    "Pass a signal as a child or attribute when the target should update. Use m.If, m.Switch, and m.For when the shape of the child list itself depends on state.",
    "For a mutable list of objects, give m.For an itemKey. Maya can preserve each mapped DOM node while updating the derived item and index signals.",
  ),
  Code(`const tasks = signal([
  { id: 1, text: "Learn signals", done: false },
]);

m.Ul({
  children: m.For({
    subject: tasks,
    itemKey: "id",
    map: (task) => m.Li({
      children: tmpl\`\${() => task.value.text}\`,
    }),
  }),
});`),
  Note(
    "Use an itemKey only when the list (passed to 'subject') is a list of object items. And the key exists in each object item and the property value of that key is unique for each object item.",
  ),
);

export const TodoList = Article(
  m.H3({ class: "black", children: "Build a small Todo List" }),
  Paragraphs(
    "Combine elements, a component, signals, a keyed list, and native events. Keep the source signal at page level, use a reusable row component, and let m.For render the list.",
    "Start with the basic loop, then add filtering, derived counts, and persistence as separate experiments.",
  ),
  Code(`type Todo = { id: number; text: string; done: boolean };
const todos = signal<Todo[]>([]);
const draft = signal("");

const addTodo = () => {
  if (!draft.value.trim()) return;
  todos.push({ id: Date.now(), text: draft.value, done: false });
  draft.value = "";
};

m.Form({
  onsubmit: (event) => { event.preventDefault(); addTodo(); },
  children: [
    m.Input({
      value: draft,
      oninput: (event) =>
        (draft.value = (event.target as HTMLInputElement).value),
    }),
    m.Button({ type: "submit", children: "Add" }),
  ],
});`),
  Section(
    "Next experiments",
    Bullets(
      "Add a derived count of unfinished tasks.",
      "Use m.If to show an empty state when the list is empty.",
      "Use m.Switch to show All, Open, and Done filters.",
      "Add onunmount cleanup for any external browser resource.",
    ),
  ),
);
