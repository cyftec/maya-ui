import { dstring } from "@cyftech/signal";
import { component, m } from "@mufw/maya";

type ButtonProps = {
  classNames?: string;
  href?: string;
  label: string;
  onClick?: () => void;
};

export const Button = component<ButtonProps>(
  ({ classNames, href, label, onClick }) => {
    return m.Button({
      class: dstring`pv2 ph3 pointer bg-transparent hover-bg-gray b--gray ba bw1 br-pill ${classNames}`,
      onclick: onClick,
      children: m.A({
        class: "no-underline dark-gray hover-white",
        href: href,
        children: label,
      }),
    });
  }
);
