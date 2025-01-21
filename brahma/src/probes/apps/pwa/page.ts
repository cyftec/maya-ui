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
        /**
         * manifest.json should be added as link
         * for every single page like below.
         */
        m.Link({
          rel: "manifest",
          href: "/manifest.json",
        }),
      ],
    }),
    m.Body({
      children: [
        /**
         * app.js registers the service-worker sw.js
         * and it should be loaded for every single page
         * like below.
         */
        m.Script({ src: "app.js", defer: "true" }),
        m.Script({ src: "main.js", defer: "true" }),
        m.Div([m.H1("My first PWA")]),
      ],
    }),
  ],
});
