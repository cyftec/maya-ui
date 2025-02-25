import { Child, component, m } from "@mufw/maya";
import { Footer } from "./Footer";
import { Header } from "./Header";
import { ViewFrame } from "../elements";

type PageProps = {
  title: string;
  app: Child;
  headElements?: Child[];
};

export const Page = component<PageProps>(
  ({ title, app: appChildElement, headElements }) => {
    return m.Html({
      lang: "en",
      children: [
        m.Head([
          m.Meta({
            name: "viewport",
            content: "width=device-width, initial-scale=1",
          }),
          m.Title(title),
          m.Link({ rel: "stylesheet", href: "/assets/styles.css" }),
          m.Link({
            rel: "icon",
            type: "image/x-icon",
            href: "/assets/favicon.ico",
          }),
          ...(headElements || []),
        ]),
        m.Body({
          class: "ph3",
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
  }
);
