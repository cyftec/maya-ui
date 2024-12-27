import { type Component, m } from "maya";
import { dstr, val } from "maya/signal";

type BulbProps = {
  isOn: boolean;
  classNames?: string;
};

export const Bulb: Component<BulbProps> = ({ isOn, classNames }) =>
  m.Div({
    class: dstr`flex flex-column items-center ${classNames}`,
    children: [
      m.Div({
        class: dstr`ba--red h4 w3 bw2 ba br3 br--bottom ${() =>
          val(isOn) ? "bg-light-gray b--moon-gray" : "bg-mid-gray b--gray"}`,
      }),
      m.Div({
        class: dstr`flex items-center yellow justify-center w4 h5 pv5 br-100 ${() =>
          val(isOn) ? "bg-washed-yellow" : "bg-black"}`,
        children: "फिलामेंट",
      }),
    ],
  });
