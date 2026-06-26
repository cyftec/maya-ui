import { m } from "@mufw/maya";

export const Header = () =>
  m.Div({
    children: [
      m.A({
        href: "/",
        children: "Home",
      }),
      m.Span(" | "),
      m.A({
        href: "/about",
        children: "About",
      }),
      m.Span(" | "),
      m.A({
        href: "/contacts.html",
        children: "Contacts",
      }),
      m.Span(" | "),
      m.A({
        href: "/examples.html",
        children: "Examples",
      }),
      m.Span(" | "),
      m.A({
        href: "/living-room",
        children: "Living Room app",
      }),
    ],
  });
