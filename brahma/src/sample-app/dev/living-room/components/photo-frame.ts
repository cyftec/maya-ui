import { type Component, m } from "@mufw/maya";
import { dstring, val } from "@mufw/maya/signal";

type PhotoFrameProps = {
  frameSrc: string;
  photoSrc: string;
  isBulbOn: boolean;
};

export const PhotoFrame: Component<PhotoFrameProps> = ({
  frameSrc,
  photoSrc,
  isBulbOn,
}) =>
  m.Div({
    class: "flex justify-center",
    children: [
      m.Div({
        class: "absolute",
        children: [
          m.Div({
            class: dstring`absolute z-3 ${() =>
              val(isBulbOn) ? "bg-transparent" : "bg-black-90"}`,
            style: "height: 300px; width: 250px; ",
          }),
          m.Img({
            class: "absolute z-2",
            height: "300px",
            width: "300px",
            src: val(frameSrc),
          }),
          m.Div({
            class: dstring`absolute z-1 ${() =>
              val(isBulbOn) ? "bg-transparent" : "bg-black-90"}`,
            style: "height: 300px; width: 250px; ",
          }),
          m.Img({
            class: "absolute--fill z-0",
            height: "250px",
            width: "250px",
            src: val(photoSrc),
          }),
        ],
      }),
    ],
  });
