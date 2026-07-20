import { m } from "@cyftec/maya/core";
import { TextWithLinks } from "../../../../../@libs/elements";
import { Code, Note } from "../../article";
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
                      isTruthy: () =>
                        Note(TextWithLinks({ text: ALERT || "" })),
                    }),
                    m.If({
                      subject: CODE,
                      isTruthy: () => Code(CODE || ""),
                    }),
                  ],
                }),
            }),
          }),
        ],
      }),
  }),
});
