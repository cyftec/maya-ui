import { Child, Children, component, m } from "@cyftec/maya";
import { value } from "@cyftec/maya/signal";
import { Footer } from "./Footer";
import { Header } from "./Header";
import { ViewFrame } from "../elements";

type PageProps = {
  title: string;
  headElements?: Child[];
  app: Children;
};

export const Page = component<PageProps>(
  ({ title, headElements, app: appChildElement }) => {
    const restHeadElems = value(headElements || []);
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
            href: "/assets/images/maya-favicon.ico",
          }),
          ...restHeadElems,
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
  },
);
