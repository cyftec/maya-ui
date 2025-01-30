import { Children, component, m } from "@mufw/maya";

type NavbarProps = {
  children: Children;
};

export const Navbar = component<NavbarProps>(({ children }) => {
  return m.Div({
    class: `dn db-ns w5 pv3 pr3 max-h-80 overflow-y-scroll`,
    style: `
      scrollbar-color: #e8e8e8 #f2f1f0;
      scrollbar-width: thin;
    `,
    children,
  });
});
