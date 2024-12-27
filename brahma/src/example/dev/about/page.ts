import { m } from "maya";
import { Header } from "../elements";

export default () => {
  return m.Html({
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
          m.Script({ src: "main.js", defer: "true" }),
          m.Div({
            children: [Header(), m.H1("About Page")],
          }),
        ],
      }),
    ],
  });
};
