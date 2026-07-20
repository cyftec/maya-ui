import { tmpl } from "@cyftec/maya/signal";
import { component, m } from "@cyftec/maya/core";

type DividerProps = {
  className?: string;
};

export const Divider = component<DividerProps>(({ className }) =>
  m.Div({
    class: tmpl`bl b--moon-gray min-vh-20 ${className}`,
  }),
);
