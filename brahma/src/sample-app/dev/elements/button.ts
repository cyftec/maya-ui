import { m, type Component } from "@mufw/maya";
import { dstring, val } from "@cyftech/signal";

type ButtonProps = {
  label: string;
  onTap: () => void;
  classNames?: string;
  color?: string;
};

export const Button: Component<ButtonProps> = ({
  classNames,
  onTap,
  label,
  color,
}) =>
  m.Button({
    class: dstring`pa2 b br3 ba bw1 b--gray pointer ${() =>
      val(color) || "bg-green  white"} ${classNames}`,
    onclick: onTap,
    children: label,
  });
