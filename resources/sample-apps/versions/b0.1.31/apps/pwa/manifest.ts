import { WebAppManifest } from "web-app-manifest";

const assetsPath = "/assets";
const imagesPath = `${assetsPath}/images`;

const manifest: WebAppManifest = {
  short_name: "My PWA",
  name: "My First PWA",
  icons: [
    {
      src: `${imagesPath}/192_logo.png`,
      sizes: "192x192",
      type: "image/png",
    },
    {
      src: `${imagesPath}/512_logo.png`,
      sizes: "512x512",
      type: "image/png",
    },
  ],
  start_url: ".",
  display: "standalone",
  theme_color: "#000000",
  background_color: "#ffffff",
};

export default manifest;
