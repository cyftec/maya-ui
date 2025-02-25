import { m } from "@mufw/maya";
import { Icon, TextWithLinks } from "../../../../../@libs/elements";
import { TASKS } from "./constants";

export const InstallationAndSetup = m.Div({
  children: m.For({
    subject: TASKS,
    map: (task) =>
      m.Div({
        class: "mb5",
        children: [
          m.H3({
            class: "black",
            children: task.TITLE,
          }),
          m.P({ class: "mt0", children: task.PARA }),
          m.Ol({
            children: m.For({
              subject: task.STEPS,
              map: ({ DESCRIPTION, ALERT, CODE }) =>
                m.Li({
                  class: "mb2",
                  children: [
                    TextWithLinks({ text: DESCRIPTION }),
                    m.If({
                      subject: ALERT,
                      isTruthy: m.Div({
                        class:
                          "list bg-near-white pa3 mv3 bl bw4 br4 b--yellow",
                        children: TextWithLinks({ text: ALERT || "" }),
                      }),
                    }),
                    m.If({
                      subject: CODE,
                      isTruthy: m.Div({
                        class:
                          "flex items-center justify-between mv3 ph4 pv3 bg-dark-gray br4 white",
                        children: [
                          CODE || "",
                          Icon({
                            name: "content_copy",
                            onClick: () =>
                              navigator.clipboard.writeText(CODE || ""),
                          }),
                        ],
                      }),
                    }),
                  ],
                }),
            }),
          }),
        ],
      }),
  }),
});
