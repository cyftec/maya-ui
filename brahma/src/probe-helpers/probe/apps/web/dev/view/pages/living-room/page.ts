import { m } from "@cyftec/maya/core";
import { signal } from "@cyftec/maya/signals";
import { Button } from "../../elements";
import { Bulb, PhotoFrame } from "./@components";
import { css } from "../../styles";

const isBulbOn = signal(false);
const buttonColors = css.when(
  isBulbOn,
  "bg-light-gray black",
  "bg-mid-gray light-gray",
);

export default m.Html({
  lang: "en",
  children: [
    m.Head({
      children: [
        m.Title("My app"),
        m.Meta({ charset: "UTF-8" }),
        m.Meta({ "http-equiv": "X-UA-Compatible", content: "IE=edge" }),
        m.Meta({
          name: "viewport",
          content: "width=device-width, initial-scale=1.0",
        }),
        m.Link({ rel: "stylesheet", href: "/assets/styles.css" }),
      ],
    }),
    m.Body({
      class: css("ma0"),
      children: [
        m.Script({ src: "main.js", defer: true }),
        m.Div({
          class: css(
            `absolute--fill vh-100`,
            css.when(isBulbOn, "bg-light-yellow", "bg-dark-gray"),
          ),
          children: [
            Bulb({
              isOn: isBulbOn,
              classNames: css("mb6"),
            }),
            PhotoFrame({
              isBulbOn,
              frameSrc: "sample-assets/photo-frame.webp",
              photoSrc: "sample-assets/pp.png",
            }),
            m.Div({
              class: css("mt7 pt6 flex justify-center items-center"),
              children: [
                Button({
                  colors: buttonColors,
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
