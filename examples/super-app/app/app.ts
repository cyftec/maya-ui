import { m } from "@maya/core";
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
                children: m.Text("open Living Room app"),
              }),
            ],
          }),
          m.Li({
            children: [
              m.A({
                href: "tic-tac-toe",
                children: m.Text("open Tic Tac Toe app"),
              }),
            ],
          }),
          m.Li({
            children: [
              m.A({
                href: "todo",
                children: m.Text("open Todo app"),
              }),
            ],
          }),
        ],
      }),
    ],
  });
};

export const app = HomePage;
