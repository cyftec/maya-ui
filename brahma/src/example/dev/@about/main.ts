import { defaultHtmlPageNode, m } from "@maya/core";
import { Header } from "../@elements";

const app = () =>
  m.Div({
    children: [
      Header(),
      m.H1({
        children: m.Text("About Page"),
      }),
    ],
  });

export default () => defaultHtmlPageNode("My app | About", app);
