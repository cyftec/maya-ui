import { m } from "./html-nodes";
import type { HtmlNode } from "../types";

export const defaultMetaTags: () => HtmlNode[] = () => [
  m.Meta({ charset: "UTF-8" }),
  m.Meta({
    "http-equiv": "X-UA-Compatible",
    content: "IE=edge",
  }),
  m.Meta({
    name: "viewport",
    content: "width=device-width, initial-scale=1.0",
  }),
];

export const defaultHtmlPageNode = (
  pageTitle: string,
  appNode: () => HtmlNode,
  pageNamePrefix = ""
): HtmlNode => {
  return m.Html({
    lang: "en",
    children: [
      m.Head({
        children: [
          m.Title({ children: m.Text(pageTitle) }),
          ...defaultMetaTags(),
        ],
      }),
      m.Body({
        children: [
          m.Script({
            src: (pageNamePrefix ? `./${pageNamePrefix}.` : "./") + "main.js",
            defer: "true",
          }),
          appNode(),
        ],
      }),
    ],
  });
};
