import { dstring } from "@cyftech/signal";
import { Child, component, m } from "@mufw/maya";

type ButtonProps = {
  classNames?: string;
  labelClassNames?: string;
  href?: string;
  label: Child;
  onClick?: () => void;
};

export const Button = component<ButtonProps>(
  ({ classNames, labelClassNames, href, label, onClick }) => {
    return m.Button({
      class: dstring`flex justify-stretch pointer hover-bg-gray b--gray ba bw1 br-pill ${classNames}`,
      onclick: onClick,
      children: m.A({
        class: dstring`no-underline bg-transparent dark-gray hover-white pv2 ph3 ${labelClassNames}`,
        href: href,
        children: label,
      }),
    });
  }
);
