import { tmpl } from "@cyftec/maya/signal";
import { component, m } from "@cyftec/maya";

type IconProps = {
  classNames?: string;
  name: string;
  size?: number;
  onClick?: () => void;
};

export const Icon = component<IconProps>(
  ({ classNames, name, size, onClick }) => {
    return m.Span({
      class: tmpl`material-symbols-rounded ${
        onClick ? "pointer" : ""
      } ${classNames}`,
      style: tmpl`font-size: ${size?.value ?? 24}px; line-height: ${
        size?.value ?? 24
      }px;`,
      onclick: onClick,
      children: name,
    });
  },
);
