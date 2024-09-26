import { Component, m } from "@maya/core";

type LoaderProps = {
  classNames?: string;
};

export const Loader = Component<LoaderProps>(({ classNames } = {}) => {
  return m.Div({
    class: `flex justify-center items-center ${classNames?.value || ""}`,
    children: [
      m.Div({
        class: "loader",
      }),
    ],
  });
});
