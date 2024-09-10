import { m } from "./components.ts";
import { MayaElement } from "./types.ts";

export const defaultMetaTags: () => MayaElement[] = () => [
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
  appNode: () => MayaElement
): MayaElement => {
  return m.Html({
    lang: "en",
    children: [
      m.Head({
        children: [m.Title({ innerText: pageTitle }), ...defaultMetaTags()],
      }),
      m.Body({
        children: [
          m.Script({
            src: "main.js",
            defer: "true",
          }),
          appNode(),
        ],
      }),
    ],
  });
};
