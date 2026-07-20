import { tmpl } from "@cyftec/maya/signal";
import { component, m } from "@cyftec/maya/core";

type IconProps = {
  classNames?: string;
  hoverTitle?: string;
  name: string;
  size?: number;
  onClick?: () => void;
};

export const Icon = component<IconProps>(
  ({ classNames, hoverTitle, name, size, onClick }) => {
    return m.Span({
      class: tmpl`material-symbols-rounded ${
        onClick ? "pointer" : ""
      } ${classNames}`,
      style: tmpl`font-size: ${size?.value ?? 24}px; line-height: ${
        size?.value ?? 24
      }px;`,
      title: hoverTitle,
      onclick: onClick,
      children: name,
    });
  },
);
