import { Component, dString, m, signal } from "@maya/core";

type HeaderProps = {
  classNames?: string;
  title: string;
  variant?: "large" | "small";
};

export const Header = Component<HeaderProps>(
  ({ classNames, title, variant }) => {
    const hTag = variant?.value === "large" ? m.H1 : m.H2;
    const toggle = signal(false);

    const onTap = () => {
      toggle.value = !toggle.value;
    };

    return hTag({
      class: dString`${() => (toggle.value ? "pl3 red" : "pl3 black")} ${() =>
        classNames?.value || ""}`,
      onclick: onTap,
      children: m.Text(title.value),
    });
  }
);
