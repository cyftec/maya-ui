import { m } from "@cyftec/maya/core";
import { Article, Bullets, Code, Paragraphs, Section } from "../article";

export const AppStructure = Article(
  m.H3({ class: "black", children: "Find your way around the app" }),
  Paragraphs(
    "A Maya project keeps application source under dev. The view directory contains pages and the files those pages import. Directories beginning with @ are source-only and are not copied as routes.",
    "The sample web app uses view/page.ts for the home page and view/about/page.ts for a folder route. A file such as view/contacts.page.ts is a prefixed page route.",
  ),
  Code(`hello-maya/
├── karma.ts
└── dev/
    ├── controllers.ts
    ├── models.ts
    └── view/
        ├── @elements/
        ├── assets/
        ├── about/page.ts
        ├── contacts.page.ts
        └── page.ts`),
  Section(
    "What gets built",
    Bullets(
      "page.ts in a directory becomes index.html and main.js in the matching output directory.",
      "name.page.ts becomes name.html and name.main.js.",
      "Non-page TypeScript files become JavaScript files; other assets are copied.",
      "Ignored @ folders stay available to imports but are not emitted as standalone output.",
    ),
  ),
  Code(
    `view/page.ts        -> stage/index.html      + stage/main.js
view/about/page.ts   -> stage/about/index.html + stage/about/main.js
view/contacts.page.ts -> stage/contacts.html   + stage/contacts.main.js`,
  ),
);
