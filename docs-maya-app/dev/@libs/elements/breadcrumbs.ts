import { Children, component, m } from "@mufw/maya";

type BreadcrumbsProps = {
  children: Children;
};

export const Breadcrumbs = component<BreadcrumbsProps>(({ children }) =>
  m.Div({
    class: "flex items-center",
    children: children,
  })
);
