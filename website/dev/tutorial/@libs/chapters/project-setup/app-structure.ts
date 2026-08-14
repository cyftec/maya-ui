import { m } from "@cyftec/maya/core";
import { Article, Bullets, Code, Paragraphs, Section } from "../article";

export const AppStructure = Article(
  m.H3({ class: "black", children: "Find your way around the app" }),
  Paragraphs(
    "A Maya project keeps application source under dev. The configured appViewDir contains pages and public assets. Directories beginning with the configured @ delimiter are source-only and are not copied as routes.",
    "The standard web scaffold uses dev/view/pages/page.ts for the home page, an about/page.ts file for a folder route, and contacts.page.ts for a dotted page route.",
  ),
  Code(`hello-maya/
├── _karma/karma.ts
└── dev/
    ├── controllers/
    ├── models/
    └── view/
        ├── elements/
        └── pages/
            ├── assets/styles.ts
            ├── about/page.ts
            ├── contacts.page.ts
            └── page.ts`),
  Section(
    "What gets built",
    Bullets(
      "page.ts in a directory becomes index.html and main.js in the matching output directory.",
      "name.page.ts becomes name.html and name.main.js.",
      "The configured styles.ts becomes generated, minified CSS containing only collected NoCSS rules.",
      "Other non-page TypeScript files become JavaScript files; public assets are copied.",
      "Ignored @ folders stay available to imports but are not emitted as standalone output.",
    ),
  ),
  Code(
    `dev/view/pages/page.ts          -> stage/index.html      + stage/main.js
dev/view/pages/about/page.ts    -> stage/about/index.html + stage/about/main.js
dev/view/pages/contacts.page.ts -> stage/contacts.html   + stage/contacts.main.js
dev/view/pages/assets/styles.ts -> stage/assets/styles.css`,
  ),
);
