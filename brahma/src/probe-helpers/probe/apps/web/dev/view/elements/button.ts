import { Child, component, m } from "@cyftec/maya/core";
import { css, type ClassName, type CssPhraseValue } from "../styles";

type ButtonProps = {
  classNames?: CssPhraseValue;
  colors?: CssPhraseValue;
  label: Child;
  onTap: () => void;
};

export const Button = component<ButtonProps>(
  ({ classNames, colors, label, onTap }) =>
    m.Button({
      class: css(
        `pa2 b br3 ba bw1 b--gray pointer`,
        css.ifNullable(colors, "bg-green white"),
        classNames,
      ),
      onclick: onTap,
      children: label,
    }),
);
