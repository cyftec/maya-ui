import { dstring } from "@cyftech/signal";
import { component, m } from "@mufw/maya";

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
      class: dstring`link underline ${href || onClick ? "pointer" : ""} ${() =>
        isSelected?.value
          ? `bg-${colorCss?.value || "red"} white`
          : `${colorCss?.value || "red"}`} ${classNames}`,
      target: target,
      href: href,
      onclick: onClick,
      children: label,
    });
  }
);
