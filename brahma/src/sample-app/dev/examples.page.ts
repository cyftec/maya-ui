import { dstring, signal } from "@cyftech/signal";
import { m } from "@mufw/maya";
import { Header } from "./@elements/index.ts";

const topBulbIsOn = signal(false);
const bulbStates = signal(
  [1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1].map((value, index) => ({ value, index }))
);

const Bulb = () => {
  const isOn = signal(false);
  return m.Div({
    class: "mv2",
    onclick: () => (isOn.value = !isOn.value),
    children: m.If({
      condition: isOn,
      isTruthy: m.Div({ class: `bg-yellow pa4`, children: "ON" }),
      isFalsy: m.Div({ class: `bg-light-gray pa4`, children: "OFF" }),
    }),
  });
};

export default m.Html({
  lang: "en",
  children: [
    m.Head({
      children: [
        m.Title("My app | Examples"),
        m.Meta({ charset: "UTF-8" }),
        m.Meta({
          "http-equiv": "X-UA-Compatible",
          content: "IE=edge",
        }),
        m.Meta({
          name: "viewport",
          content: "width=device-width, initial-scale=1.0",
        }),
        m.Link({
          rel: "stylesheet",
          href: "https://unpkg.com/tachyons@4.12.0/css/tachyons.min.css",
        }),
      ],
    }),
    m.Body({
      children: [
        m.Script({ src: "examples.main.js", defer: "true" }),
        m.Div({
          children: [
            Header(),
            m.Button({
              onclick: () => (topBulbIsOn.value = !topBulbIsOn.value),
              children: `Turn ${topBulbIsOn.value ? "off" : "on"} bulb`,
            }),
            m.Switch({
              subject: dstring`${3}`,
              defaultCase: m.Div({
                class: `bg-silver pa4`,
                children: "DISCONNECTED",
              }),
              cases: {
                true: m.Div({ class: `bg-light-gray pa4`, children: "OFF" }),
                false: m.Div({ class: `bg-yellow pa4`, children: "ON" }),
              },
            }),
            m.If({
              condition: topBulbIsOn,
              isTruthy: m.Div({ class: `bg-yellow pa4`, children: "ON" }),
              isFalsy: m.Div({ class: `bg-light-gray pa4`, children: "OFF" }),
            }),
            m.Button({
              onclick: () =>
                (bulbStates.value = bulbStates.value.slice(
                  0,
                  bulbStates.value.length - 1
                )),
              children: "Delete Bulb",
            }),
            m.Button({
              onclick: () =>
                (bulbStates.value = [
                  ...bulbStates.value,
                  { value: 1, index: bulbStates.value.length },
                ]),
              children: "Add Bulb",
            }),
            m.Div(
              m.For({
                items: bulbStates,
                mutableMap: (isOn, index) => Bulb(),
              })
            ),
          ],
        }),
      ],
    }),
  ],
});
