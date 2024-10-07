import { Component, dString, m } from "@maya/core";

type BulbProps = {
  isOn: boolean;
  classNames?: string;
};

export const Bulb = Component<BulbProps>(({ isOn, classNames }) =>
  m.Div({
    class: dString`flex flex-column items-center ${() =>
      classNames?.value || ""}`,
    children: [
      m.Div({
        class: dString`${() =>
          isOn.value
            ? "bg-light-gray b--moon-gray"
            : "bg-mid-gray b--gray"} ba--red h4 w3 bw2 ba br3 br--bottom`,
      }),
      m.Div({
        class: dString`flex items-center yellow justify-center w4 h5 pv5 br-100 ${() =>
          isOn.value ? "bg-washed-yellow" : "bg-black"}`,
        children: m.Text("फिलामेंट"),
      }),
    ],
  })
);
