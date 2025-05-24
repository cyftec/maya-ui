import { component, m } from "@mufw/maya";
import { tmpl } from "@cyftech/signal";

type PhotoFrameProps = {
  frameSrc: string;
  photoSrc: string;
  isBulbOn: boolean;
};

export const PhotoFrame = component<PhotoFrameProps>(
  ({ frameSrc, photoSrc, isBulbOn }) =>
    m.Div({
      class: "flex justify-center",
      children: [
        m.Div({
          class: "absolute",
          children: [
            m.Div({
              class: tmpl`absolute z-3 ${() =>
                isBulbOn.value ? "bg-transparent" : "bg-black-90"}`,
              style: "height: 300px; width: 250px; ",
            }),
            m.Img({
              class: "absolute z-2",
              height: "300px",
              width: "300px",
              src: frameSrc,
            }),
            m.Div({
              class: tmpl`absolute z-1 ${() =>
                isBulbOn.value ? "bg-transparent" : "bg-black-90"}`,
              style: "height: 300px; width: 250px; ",
            }),
            m.Img({
              class: "absolute--fill z-0",
              height: "250px",
              width: "250px",
              src: photoSrc,
            }),
          ],
        }),
      ],
    })
);
