import { Component, dString, m } from "@maya/core";

let buttonRenderCount = 0;

type ButtonProps = {
  label: string;
  onTap: () => void;
  classNames?: string;
  color?: string;
};

export const Button = Component<ButtonProps>(
  ({ classNames, onTap, label, color }) => {
    console.log(`Button rendered ${++buttonRenderCount} times`);
    return m.Button({
      class: dString`pa3 b br3 ba bw1 b--gray pointer ${() =>
        color?.value || "bg-green  white"} ${() => classNames?.value || ""}`,
      onclick: onTap,
      children: m.Text(label.value),
    });
  }
);
