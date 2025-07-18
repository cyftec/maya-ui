import { m } from "@mufw/maya";
import { derive, tmpl, signal } from "@cyftech/signal";
import { Button } from "../@elements";
import { Bulb, PhotoFrame } from "./@components";

const isBulbOn = signal(false);
const buttonColor = derive(() =>
  isBulbOn.value ? "bg-light-gray black" : "bg-mid-gray light-gray"
);

export default m.Html({
  lang: "en",
  children: [
    m.Head({
      children: [
        m.Title("My app"),
        m.Meta({ charset: "UTF-8" }),
        m.Meta({
          "http-equiv": "X-UA-Compatible",
          content: "IE=edge",
        }),
        m.Meta({
          name: "viewport",
          content: "width=device-width, initial-scale=1.0",
        }),
        m.Link({
          rel: "stylesheet",
          href: "https://unpkg.com/tachyons@4.12.0/css/tachyons.min.css",
        }),
        m.Link({ rel: "stylesheet", href: "sample-assets/styles.css" }),
      ],
    }),
    m.Body({
      children: [
        m.Script({ src: "main.js", defer: true }),
        m.Div({
          class: tmpl`absolute--fill vh-100 ${() =>
            isBulbOn.value ? "bg-light-yellow" : "bg-dark-gray"}`,
          children: [
            Bulb({
              isOn: isBulbOn,
              classNames: "mb6",
            }),
            PhotoFrame({
              isBulbOn,
              frameSrc: "sample-assets/photo-frame.webp",
              photoSrc: "sample-assets/pp.png",
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
        }),
      ],
    }),
  ],
});
