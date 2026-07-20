import { tmpl } from "@cyftec/maya/signal";
import { Children, component, m } from "@cyftec/maya/core";

type NavbarProps = {
  classNames?: string;
  children: Children;
};

export const Navbar = component<NavbarProps>(({ classNames, children }) => {
  return m.Div({
    class: tmpl`dn db-ns fg3 pb3 pr2 max-h-80 overflow-y-scroll ${classNames}`,
    style: `
      scrollbar-color: #e8e8e8 #f2f1f0;
      scrollbar-width: thin;
    `,
    children,
  });
});
