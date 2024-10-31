import { defaultHtmlPageNode, m } from "@maya/core";
import { Header } from "./@elements";

const app = () =>
  m.Div({
    children: [
      Header(),
      m.H1({
        children: m.Text("Home Page"),
      }),
    ],
  });

export default () => defaultHtmlPageNode("My app", app);
