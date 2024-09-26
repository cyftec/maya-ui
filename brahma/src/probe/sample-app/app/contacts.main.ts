import { defaultHtmlPageNode, derived, m, signal } from "@maya/core";
import { Header } from "./@elements";

const app = () => {
  const toggled = signal(false);
  return m.Div({
    children: [
      Header(),
      m.H1({
        style: derived(() => `color: ${toggled.value ? "red" : "green"}`),
        onclick: () => (toggled.value = !toggled.value),
        children: m.Text("Contact Page"),
      }),
    ],
  });
};

export const page = () =>
  defaultHtmlPageNode("My app | Contact", app, "contacts");
