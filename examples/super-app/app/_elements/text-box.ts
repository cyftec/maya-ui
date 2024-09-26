import { Component, DomEventValue, m } from "@maya/core";

type TextBoxProps = {
  classNames?: string;
  value: string;
  onkeypress: (e: KeyboardEvent) => void;
};

export const TextBox = Component<TextBoxProps>(
  ({ classNames, value, onkeypress }) => {
    return m.Input({
      class: `pa3 br3 bw1 ba b--green ${classNames?.value}`,
      type: "text",
      value: value,
      onkeypress: onkeypress as DomEventValue,
    });
  }
);
