import { m } from "@ckzero/maya/web";

export const Header = () =>
  m.Div({
    children: [
      m.A({
        href: "/",
        innerText: "Home",
      }),
      m.Span({ innerText: " | " }),
      m.A({
        href: "/about",
        innerText: "About",
      }),
      m.Span({ innerText: " | " }),
      m.A({
        href: "/contact",
        innerText: "Contact",
      }),
      m.Span({ innerText: " | " }),
      m.A({
        href: "/living-room",
        innerText: "Living Room app",
      }),
    ],
  });
