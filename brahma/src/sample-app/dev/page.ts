import { m } from "@mufw/maya";
import { source } from "@mufw/maya/signal";
import { Header } from "./elements/index.ts";

export default () => {
  const sub = source("a");

  return m.Html({
    lang: "en",
    children: [
      m.Head({
        children: [
          m.Title("Maya App"),
          m.Meta({ charset: "UTF-8" }),
          m.Meta({
            "http-equiv": "X-UA-Compatible",
            content: "IE=edge",
          }),
          m.Meta({
            name: "viewport",
            content: "width=device-width, initial-scale=1.0",
          }),
        ],
      }),
      m.Body({
        children: [
          m.Script({ src: "main.js", defer: "true" }),
          m.Div({
            children: [
              Header(),
              m.H1({
                children: "My home page",
              }),
              m.Switch({
                subject: sub,
                cases: {
                  a: () => "A",
                  b: () => "B",
                  c: () => "C",
                },
              }),
              m.Button({
                onclick: () => (sub.value = "a"),
                children: `select 'A'`,
              }),
              m.Button({
                onclick: () => (sub.value = "b"),
                children: `select 'B'`,
              }),
              m.Button({
                onclick: () => (sub.value = "c"),
                children: `select 'C'`,
              }),
            ],
          }),
        ],
      }),
    ],
  });
};
