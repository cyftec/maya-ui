import { m } from "@maya/core";

export const Header = () =>
  m.Div({
    children: [
      m.A({
        href: "/",
        children: m.Text("Home"),
      }),
      m.Span({ children: m.Text(" | ") }),
      m.A({
        href: "/about",
        children: m.Text("About"),
      }),
      m.Span({ children: m.Text(" | ") }),
      m.A({
        href: "/contact",
        children: m.Text("Contact"),
      }),
      m.Span({ children: m.Text(" | ") }),
      m.A({
        href: "/living-room",
        children: m.Text("Living Room app"),
      }),
    ],
  });
