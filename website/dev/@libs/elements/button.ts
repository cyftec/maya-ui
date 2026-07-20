import { tmpl } from "@cyftec/maya/signal";
import { Child, component, m } from "@cyftec/maya/core";

type ButtonProps = {
  classNames?: string;
  labelClassNames?: string;
  href?: string;
  label: Child;
  onClick?: () => void;
};

export const Button = component<ButtonProps>(
  ({ classNames, labelClassNames, href, label, onClick }) => {
    const buttonCss = tmpl`flex justify-stretch pointer bg-white hover-bg-light-gray b--gray ba bw1 br-pill ${classNames}`;
    const anchorCss = tmpl`w-100 no-underline bg-transparent dark-gray pv2 ph3 ${labelClassNames}`;

    return m.Button({
      class: buttonCss,
      onclick: onClick,
      children: m.A({
        class: anchorCss,
        ...(href ? { href: href } : {}),
        children: label,
      }),
    });
  },
);
