import { defaultHtmlPageNode, derived, m, signal } from "@maya/core";
import { Header } from "./@elements";

const app = () => {
  const toggled = signal(false);
  return m.Div({
    children: [
      Header(),
      m.H1({
        style: derived(
          () => `color: ${toggled.value ? "red" : "green"}; user-select: none;`
        ),
        onclick: () => (toggled.value = !toggled.value),
        children: m.Text("Contact Page"),
      }),
    ],
  });
};

export default () => defaultHtmlPageNode("My app | Contact", app, "contacts");
