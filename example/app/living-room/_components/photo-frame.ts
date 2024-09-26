import { Component, m } from "@maya/core";

let photFrameRenderCount = 0;

type PhotoFrameProps = {
  frameSrc: string;
  photoSrc: string;
  isBulbOn: boolean;
};

export const PhotoFrame = Component<PhotoFrameProps>(
  ({ frameSrc, photoSrc, isBulbOn }) => {
    console.log(`photo frame rendered ${++photFrameRenderCount} times`);

    return m.Div({
      class: "flex justify-center",
      children: [
        m.Div({
          class: "absolute",
          children: [
            m.Div({
              class: () =>
                `absolute z-3 ${
                  isBulbOn.value ? "bg-transparent" : "bg-black-90"
                }`,
              style: "height: 300px; width: 250px; ",
            }),
            m.Img({
              class: "absolute z-2",
              height: "300px",
              width: "300px",
              src: frameSrc.value,
            }),
            m.Div({
              class: () =>
                `absolute z-1 ${
                  isBulbOn.value ? "bg-transparent" : "bg-black-90"
                }`,
              style: "height: 300px; width: 250px; ",
            }),
            m.Img({
              class: "absolute--fill z-0",
              height: "250px",
              width: "250px",
              src: photoSrc.value,
            }),
          ],
        }),
      ],
    });
  }
);
