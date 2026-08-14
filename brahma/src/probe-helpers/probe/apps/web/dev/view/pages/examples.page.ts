import { component, type DomEventValue, m } from "@cyftec/maya/core";
import { signal, tmpl } from "@cyftec/maya/signals";
import { Header } from "../elements";
import { ClassName, css } from "../styles";

const topBulbIsOn = signal(false);
const bulbStates = signal(
  [1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1].map((value, i) => ({ value, i })),
);
const filaColor = signal<ClassName>("green");
const greenColor = css("green");
const redColor = css("red");
const changeFilaColor = (e: Event) => {
  e.stopPropagation();
  if (filaColor.value === "red") filaColor.value = greenColor;
  else filaColor.value = redColor;
};

type BulbProps = {
  fontColor: ClassName;
  changeFontColor: DomEventValue<"onclick">;
};

const Bulb = component<BulbProps>(({ fontColor, changeFontColor }) => {
  const isOn = signal(false);

  return m.Div({
    class: css(`mv2 pa4`, css.when(isOn, "bg-yellow", "bg-light-gray")),
    onclick: () => (isOn.value = !isOn.value),
    children: m.Div({
      class: css(`pointer hover-bg-washed-yellow`, fontColor),
      children: tmpl`${() => (isOn.value ? "ON" : "OFF")}`,
      onclick: changeFontColor,
    }),
  });
});

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
          href: "/assets/styles.css",
        }),
      ],
    }),
    m.Body({
      children: [
        m.Script({ src: "examples.main.js", defer: true }),
        m.Div({
          children: [
            Header(),
            m.Button({
              onclick: () => (topBulbIsOn.value = !topBulbIsOn.value),
              children: `Turn ${topBulbIsOn.value ? "off" : "on"} bulb`,
            }),
            m.Switch({
              subject: tmpl`${3}`,
              defaultCase: () =>
                m.Div({
                  class: css(`bg-silver pa4`),
                  children: "DISCONNECTED",
                }),
              cases: {
                true: () =>
                  m.Div({ class: css(`bg-light-gray pa4`), children: "OFF" }),
                false: () =>
                  m.Div({ class: css(`bg-yellow pa4`), children: "ON" }),
              },
            }),
            m.If({
              subject: topBulbIsOn,
              isTruthy: () =>
                m.Div({ class: css(`bg-yellow pa4`), children: "ON" }),
              isFalsy: () =>
                m.Div({ class: css(`bg-light-gray pa4`), children: "OFF" }),
            }),
            m.Button({
              onclick: () =>
                (bulbStates.value = bulbStates.value.slice(
                  0,
                  bulbStates.value.length - 1,
                )),
              children: "Delete Bulb",
            }),
            m.Button({
              onclick: () =>
                (bulbStates.value = [
                  ...bulbStates.value,
                  { value: 1, i: bulbStates.value.length },
                ]),
              children: "Add Bulb",
            }),
            m.Div(
              m.For({
                subject: bulbStates,
                itemKey: "i",
                n: 3,
                nthChild: "Some injectable title",
                map: () =>
                  Bulb({
                    fontColor: filaColor,
                    changeFontColor: changeFilaColor,
                  }),
              }),
            ),
          ],
        }),
      ],
    }),
  ],
});
