import { component, m } from "@cyftec/maya/core";
import { css } from "../../../styles";

type PhotoFrameProps = {
  frameSrc: string;
  photoSrc: string;
  isBulbOn: boolean;
};

export const PhotoFrame = component<PhotoFrameProps>(
  ({ frameSrc, photoSrc, isBulbOn }) =>
    m.Div({
      class: css("flex justify-center"),
      children: [
        m.Div({
          class: css("absolute"),
          children: [
            m.Div({
              class: css(
                "absolute z-3",
                css.when(isBulbOn, "bg-transparent", "bg-black-90"),
              ),
              style: "height: 300px; width: 250px; ",
            }),
            m.Img({
              class: css("absolute z-2 mw-100"),
              height: "300px",
              width: "300px",
              src: frameSrc,
            }),
            m.Div({
              class: css(
                `absolute z-1`,
                css.when(isBulbOn, "bg-transparent", "bg-black-90"),
              ),
              style: "height: 300px; width: 250px; ",
            }),
            m.Img({
              class: css("absolute--fill z-0"),
              height: "250px",
              width: "250px",
              src: photoSrc,
            }),
          ],
        }),
      ],
    }),
);
