export const TITLES = {
  FIRST_THINGS: `First things first`,
  GETTING_FAMILIAR: `Getting familar with Maya's templating syntax`,
  SYNTAX_RULES: `Basic syntax rules`,
};

export const OVERVIEW_PARAS = [
  `Before jumping straight into complete tutorial, let's just ponder upon a few things first.
  Currently, there are a handful of popular web frameworks and libraries out there, with their fair shares
  of usage in the market. And each of them have a peculiar templating syntax. Many devs do feel that
  the syntax of one of the libraries is more intuitive compared to that of the others. Taking that
  into consideration, it's only fair that you delve into Maya's syntax first.`,
  `Just have a look into both HTML and Maya syntaxes. Hopefully, just by seeing and comparing them you
  would intuitively find a mapping pattern (from HTML to Maya).`,
];

export const CODE_EXAMPLES = {
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

export const SYNTAX_RULES = [
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
];

export const CONCLUSION_PARAS = [
  `You might still be confused about how to use this syntax. How to create components using this?
     How to use a component in the app? Or, how to create an app or a page in the app using this?
     Don't worry. As that will be covered in later chapters.
     For all other syntax rules, please check `,
  `. The basic rules mentioned above is enough for now for getting started.`,
];
