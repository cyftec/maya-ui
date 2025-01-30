import { Child, component, m } from "@mufw/maya";
import { Footer } from "./Footer";
import { Header } from "./Header";
import { ViewFrame } from "../elements";

type PageProps = {
  title: string;
  app: Child;
};

export const Page = component<PageProps>(({ title, app: appChildElement }) => {
  return m.Html({
    lang: "en",
    children: [
      m.Head([
        m.Title(title),
        m.Link({ rel: "stylesheet", href: "/assets/styles.css" }),
        m.Link({
          rel: "icon",
          type: "image/x-icon",
          href: "/assets/favicon.ico",
        }),
      ]),
      m.Body({
        children: [
          m.Script({ src: "main.js", defer: true }),
          Header(),
          ViewFrame({
            children: appChildElement,
          }),
          Footer,
        ],
      }),
    ],
  });
});
