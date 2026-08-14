import { m } from "@cyftec/maya/core";
import { Header } from "../../elements";
import { css } from "../../styles";

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
        m.Link({ rel: "stylesheet", href: "/assets/styles.css" }),
      ],
    }),
    m.Body({
      children: [
        m.Script({ src: "main.js", defer: true }),
        m.Div({
          class: css("card"),
          children: [Header(), m.H1("About Page")],
        }),
      ],
    }),
  ],
});
