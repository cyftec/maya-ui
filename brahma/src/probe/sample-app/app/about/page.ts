import { defaultHtmlPageNode, m } from "@ckzero/maya/web";
import { Header } from "../@elements";

const app = () =>
  m.Div({
    children: [
      Header(),
      m.H1({
        innerText: "About Page",
      }),
    ],
  });

export const page = () => defaultHtmlPageNode("My app | About", app);
