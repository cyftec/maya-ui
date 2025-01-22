import { m } from "@mufw/maya";

export default m.Html({
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
        m.Script({ src: "popup.main.js", defer: "true" }),
        m.Div([m.H1("Home Page"), m.P("My extention home page")]),
      ],
    }),
  ],
});
