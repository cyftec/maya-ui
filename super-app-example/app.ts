import { m } from "@ckzero/maya/web";
import { camel } from "case";
import { Header } from "./_elements";

const HomePage = () => {
  return m.Div({
    children: [
      Header({
        title: "Sample Maya App",
      }),
      m.Ul({
        children: [
          m.Li({
            children: [
              m.A({
                href: "living-room",
                innerText: camel("open Living Room app"),
              }),
            ],
          }),
          m.Li({
            children: [
              m.A({
                href: "tic-tac-toe",
                innerText: "open Tic Tac Toe app",
              }),
            ],
          }),
          m.Li({
            children: [
              m.A({
                href: "todo",
                innerText: "open Todo app",
              }),
            ],
          }),
        ],
      }),
    ],
  });
};

export const app = HomePage;
