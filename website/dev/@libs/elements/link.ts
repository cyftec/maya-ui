import { tmpl } from "@cyftec/maya/signal";
import { component, m } from "@cyftec/maya";

type LinkProps = {
  classNames?: string;
  colorCss?: string;
  target?: string;
  isSelected?: boolean;
  href?: string;
  onClick?: () => void;
  label: string;
};

export const Link = component<LinkProps>(
  ({ classNames, colorCss, target, isSelected, href, onClick, label }) => {
    return m.A({
      class: tmpl`link underline ${href || onClick ? "pointer" : ""} ${() =>
        isSelected?.value
          ? `bg-${colorCss?.value || "red"} white`
          : `${colorCss?.value || "red"}`} ${classNames}`,
      target: target,
      onclick: onClick,
      children: label,
      ...(href ? { href: href } : {}),
    });
  },
);
