export const BASE_MAYA_VERSION = "0.1.14";
export const MAYA_TITLE = "Maya UI Framework";
export const LINKS = {
  DOCS: {
    HREF: "/docs",
    LABEL_S: "docs",
    LABEL_M: "go to docs &rarr;",
    LABEL_L: "go to documentation &rarr;",
  },
  TUTORIAL: {
    HREF: "/tutorial",
    LABEL_S: "create your first app",
    LABEL_NS: "create your first app &rarr;",
  },
};
export const MAYA_FEATURES_TITLE = "With your favourite web framework, now";
export const MAYA_FEATURES = [
  [
    `You can write your app completely in one language - TypeScript.`,
    `You don't need mutiple (transpilers or pre/post processor) languages like JSX or SCSS to develop a simple app.`,
  ],
  [
    `You get dynamic behaviour in your app with a static site structure.`,
    `Your app is now an MPA (Multi Page Application) and resembles plain old HTML-CSS-JS app which had multiple pages.`,
  ],
  [
    `You get Component Driven Architecture on top of full DOM access.`,
    `You don't need a hacky syntax to directly access and modify DOM just because your library or framework is designed in a certain way.`,
  ],
  [
    `You don't need an odd-looking syntax for conditional components.`,
    `For example, using ternary operators for conditionally rendering one of the two components in an if-else case scenario. You get inbuilt components like 'If', 'For' or 'Switch'. However, you're free to use any TS/JS syntax for your purpose.`,
  ],
  [
    `You get a fine-grained and dev-freindly reacivity using Signals.`,
    `Signals are basic data units that can automatically alert functions or computations when the data it holds changes. It helps in surgically modifying the DOM elements or their attributes. Your state change should not result in entire component to be re-rendered.`,
  ],
  [
    `You get a dedicated cli for developing your favourite app.`,
    `Using 'brahma' cli, you can spawn, continuously-develop and build your favourite (Maya) app in any mode.`,
  ],
  [
    `You can develop a PWA or a chrome extension in a much easier way.`,
    `The cli can create the boilerplate app in any given mode such as web, pwa or a chrome extension. Defining your manifest.json for PWAs or chrome extensions has got easier, because you can write them in TypeScript now, with the benefits of intellisense.`,
  ],
  [
    `Your project has all the configurations in a single uber-level file.`,
    `You project should not necessarily show all scattered config files all the time, which gets modified rarely and looks more like a bloat.`,
  ],
  [
    `Your app is built completely before deployment.`,
    `So you don't need an app server or a cloud compute machine for hosting your app. You just need a static file server like CDNs. Your fully reactive app can be hosted even on GitHub Pages. You don't need a full blown cloud server to showcase your simple, yet awesome calculator app.`,
  ],
];
