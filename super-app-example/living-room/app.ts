import { derived, signal } from "@ckzero/maya/signal";
import { m } from "@ckzero/maya/web";
import { Button } from "../_elements";
import { Bulb, PhotoFrame } from "./_components";
import frameSrc from "./_sample-assets/photo-frame.webp";
import photoSrc from "./_sample-assets/pp.png";

export const LivingRoomApp = () => {
  const isBulbOn = signal(false);
  const buttonColor = derived(() =>
    isBulbOn.value ? "bg-light-gray black" : "bg-mid-gray light-gray"
  );

  return m.Div({
    class: () =>
      `absolute--fill vh-100 ${
        isBulbOn.value ? "bg-light-yellow" : "bg-dark-gray"
      }`,
    children: [
      Bulb({
        isOn: isBulbOn,
        classNames: "mb6",
      }),
      PhotoFrame({
        isBulbOn,
        frameSrc: frameSrc,
        photoSrc: photoSrc,
      }),
      m.Div({
        class: "mt7 pt6 flex justify-center items-center",
        children: [
          Button({
            color: buttonColor,
            onTap: () => (isBulbOn.value = !isBulbOn.value),
            label: `switch`,
          }),
        ],
      }),
    ],
  });
};

export const app = LivingRoomApp;
