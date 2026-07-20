import { nullable, op, tmpl } from "@cyftec/maya/signal";
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
    const nonNullColorCss = op(colorCss).then(
      `${colorCss?.value}`,
      "dark-gray",
    );
    const bgColorCss = tmpl`bg-${nonNullColorCss}`;
    const color = op(isSelected).then("white", nonNullColorCss);
    const bgColor = op(isSelected).then(bgColorCss, "transparent");
    const pointer = href || onClick ? "pointer" : "";

    return m.A({
      class: tmpl`link underline ${pointer} ${color} ${bgColor} ${classNames}`,
      target: target,
      onclick: onClick,
      children: label,
      ...(href ? { href: href } : {}),
    });
  },
);
