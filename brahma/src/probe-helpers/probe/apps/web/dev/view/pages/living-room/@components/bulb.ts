import { component, m } from "@cyftec/maya/core";
import { tmpl } from "@cyftec/maya/signals";
import { css, type CssPhraseValue } from "../../../styles";

type BulbProps = {
  isOn: boolean;
  classNames?: CssPhraseValue;
};

export const Bulb = component<BulbProps>(({ isOn, classNames }) =>
  m.Div({
    class: css(`flex flex-column items-center`, classNames),
    children: [
      m.Div({
        class: css(
          `h2 w3 bw2 ba br3 br--bottom`,
          css.when(isOn, "bg-light-gray b--moon-gray", "bg-mid-gray b--gray"),
        ),
      }),
      m.Div({
        class: css(
          `flex items-center yellow justify-center w4 h4 br-100`,
          css.when(isOn, "bg-washed-yellow", "bg-black"),
        ),
        children: "फिलामेंट",
      }),
    ],
  }),
);
