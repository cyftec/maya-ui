import { dstring } from "@cyftech/signal";
import { component, m } from "@mufw/maya";

type IconProps = {
  classNames?: string;
  name: string;
  size?: number;
  onClick?: () => void;
};

export const Icon = component<IconProps>(
  ({ classNames, name, size, onClick }) => {
    return m.Span({
      class: dstring`material-symbols-rounded ${
        onClick ? "pointer" : ""
      } ${classNames}`,
      style: dstring`font-size: ${size?.value ?? 24}px; line-height: ${
        size?.value ?? 24
      }px;`,
      onclick: onClick,
      children: name,
    });
  }
);
