import { tmpl } from "@cyftec/maya/signal";
import { Children, component, m } from "@cyftec/maya/core";

type ViewFrameProps = {
  classNames?: string;
  contentClassNames?: string;
  children: Children;
};

export const ViewFrame = component<ViewFrameProps>(
  ({ classNames, contentClassNames, children }) => {
    return m.Div({
      class: tmpl`w-100 bg-pale ${classNames}`,
      children: [
        m.Div({
          class: tmpl`mw8 center ${contentClassNames}`,
          children,
        }),
      ],
    });
  },
);
