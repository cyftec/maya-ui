import { defaultMetaTags, m, derived, signal, dString } from "@maya/core";
import { Button } from "../@elements";
import { Bulb, PhotoFrame } from "./@components";

export const LivingRoomApp = () => {
  const isBulbOn = signal(false);
  const buttonColor = derived(() =>
    isBulbOn.value ? "bg-light-gray black" : "bg-mid-gray light-gray"
  );

  return m.Div({
    class: dString`absolute--fill vh-100 ${() =>
      isBulbOn.value ? "bg-light-yellow" : "bg-dark-gray"}`,
    children: [
      Bulb({
        isOn: isBulbOn,
        classNames: "mb6",
      }),
      PhotoFrame({
        isBulbOn,
        frameSrc: "./sample-assets/photo-frame.webp",
        photoSrc: "./sample-assets/pp.png",
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

export const page = () =>
  m.Html({
    lang: "en",
    children: [
      m.Head({
        children: [
          ...defaultMetaTags(),
          m.Title({
            children: m.Text("Living Room"),
          }),
          m.Link({
            rel: "stylesheet",
            href: "https://unpkg.com/tachyons@4.12.0/css/tachyons.min.css",
          }),
          m.Link({
            rel: "stylesheet",
            href: "./sample-assets/styles.css",
          }),
        ],
      }),
      m.Body({
        children: [
          m.Script({
            src: "main.js",
            defer: "true",
          }),
          LivingRoomApp(),
        ],
      }),
    ],
  });
