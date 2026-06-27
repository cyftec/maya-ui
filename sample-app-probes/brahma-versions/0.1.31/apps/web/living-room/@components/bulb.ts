import { component, m } from "@mufw/maya";
import { tmpl } from "@cyftech/signal";

type BulbProps = {
  isOn: boolean;
  classNames?: string;
};

export const Bulb = component<BulbProps>(({ isOn, classNames }) =>
  m.Div({
    class: tmpl`flex flex-column items-center ${() => classNames?.value}`,
    children: [
      m.Div({
        class: tmpl`ba--red h4 w3 bw2 ba br3 br--bottom ${() =>
          isOn.value ? "bg-light-gray b--moon-gray" : "bg-mid-gray b--gray"}`,
      }),
      m.Div({
        class: tmpl`flex items-center yellow justify-center w4 h5 pv5 br-100 ${() =>
          isOn.value ? "bg-washed-yellow" : "bg-black"}`,
        children: "फिलामेंट",
      }),
    ],
  })
);
