import { dstring } from "@cyftech/signal";
import { Children, component, m } from "@mufw/maya";

type ViewFrameProps = {
  classNames?: string;
  contentClassNames?: string;
  children: Children;
};

export const ViewFrame = component<ViewFrameProps>(
  ({ classNames, contentClassNames, children }) => {
    return m.Div({
      class: dstring`w-100 bg-pale ${classNames}`,
      children: [
        m.Div({
          class: dstring`mw8 center ${contentClassNames}`,
          children,
        }),
      ],
    });
  }
);
