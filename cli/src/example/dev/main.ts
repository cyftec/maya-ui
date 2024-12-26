import { m } from "@maya/core";
import { effect, source } from "@maya/core/utils";
import { Header } from "./@elements/index.ts";

export default () => {
  const header = source("Home Page");
  const sub = source("a");
  effect(() => console.log(sub.value));

  return m.Html({
    lang: "en",
    children: [
      m.Head({
        children: [
          m.Title("My app"),
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
                children: header.value,
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
