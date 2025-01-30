import { dstring } from "@cyftech/signal";
import { component, m } from "@mufw/maya";

type LinkProps = {
  classNames?: string;
  colorCss?: string;
  target?: string;
  isSelected?: boolean;
  href: string;
  label: string;
};

export const Link = component<LinkProps>(
  ({ classNames, colorCss, target, isSelected, href, label }) => {
    console.log(JSON.stringify(isSelected));
    return m.A({
      class: dstring`link underline ${() => colorCss?.value || "red"} ${() =>
        isSelected?.value
          ? `bg-${colorCss?.value || "red"}`
          : ""} ${classNames}`,
      target: target,
      href: href,
      children: label,
    });
  }
);
