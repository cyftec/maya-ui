import { Child, component, m } from "@cyftec/maya/core";
import { tmpl } from "@cyftec/maya/signal";

type ButtonProps = {
  classNames?: string;
  color?: string;
  label: Child;
  onTap: () => void;
};

export const Button = component<ButtonProps>(
  ({ classNames, color, label, onTap }) =>
    m.Button({
      class: tmpl`pa2 b br3 ba bw1 b--gray pointer ${() =>
        color?.value || "bg-green  white"} ${classNames}`,
      onclick: onTap,
      children: label,
    }),
);
