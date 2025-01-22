import {
  APP_DESCRIPTION,
  APP_NAME,
  HOST_URL_IDENTIFIER,
} from "./@libs/constants";

const manifest: chrome.runtime.ManifestV3 = {
  name: APP_NAME,
  version: "0.0.1",
  description: APP_DESCRIPTION,
  permissions: ["tabs"],
  host_permissions: [HOST_URL_IDENTIFIER],
  background: {
    service_worker: "sw.js",
  },
  content_scripts: [
    {
      matches: [HOST_URL_IDENTIFIER],
      js: ["content-script.js"],
    },
  ],
  web_accessible_resources: [
    {
      resources: ["assets/images/logo.png"],
      matches: [HOST_URL_IDENTIFIER],
    },
  ],
  action: {
    default_icon: {
      "16": "assets/images/logo.png",
      "24": "assets/images/logo.png",
      "32": "assets/images/logo.png",
    },
    default_title: APP_NAME,
    default_popup: "popup.html",
  },
  manifest_version: 3,
};

export default manifest;
