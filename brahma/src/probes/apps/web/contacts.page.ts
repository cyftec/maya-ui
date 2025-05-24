import { m } from "@mufw/maya";
import { tmpl, signal } from "@cyftech/signal";
import { Header } from "./@elements/index.ts";

const toggled = signal(false);

export default m.Html({
  lang: "en",
  children: [
    m.Head({
      children: [
        m.Title("My app | Contacts"),
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
        m.Script({ src: "contacts.main.js", defer: "true" }),
        m.Div({
          children: [
            Header(),
            m.H1({
              style: tmpl`color: ${() =>
                toggled.value ? "red" : "green"}; user-select: none;`,
              onclick: () => (toggled.value = !toggled.value),
              children: "Contact Page",
            }),
          ],
        }),
      ],
    }),
  ],
});
