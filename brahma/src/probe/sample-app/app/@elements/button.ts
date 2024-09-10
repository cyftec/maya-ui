import { Component, m } from "@ckzero/maya/web";

type ButtonProps = {
  label: string;
  onTap: () => void;
  classNames?: string;
  color?: string;
};

export const Button = Component<ButtonProps>(
  ({ classNames, onTap, label, color }) =>
    m.Button({
      class: () =>
        `pa2 b br3 ba bw1 b--gray pointer ${
          color?.value || "bg-green  white"
        } ${classNames?.value || ""}`,
      onclick: onTap,
      innerText: label,
    })
);
