export const NPM_DEPS = {
  MAYA: { "@mufw/maya": "0.1.8" },
  CHROME: { "@types/chrome": "0.0.297" },
  PWA: { "@types/web-app-manifest": "1.0.8" },
};

export const DEST_HTML_DEFAULT_FILE_NAME = "index";
export const DEST_JS_DEFAULT_FILE_NAME = "main";
export const DEST_HTML_FILE_EXT = ".html";
export const DEST_JS_FILE_EXT = ".js";

export const NO_HTML_ERROR = "no html";
export const NO_JS_ERROR = "no js";

export const DS_STORE_REGEX = /.DS_Store/;

export const ACCEPTED_COMMANDS = [
  { long: "create", short: "c", withArg: true },
  { long: "help", short: "h", withArg: false },
  { long: "install", short: "i", withArg: true },
  { long: "publish", short: "p", withArg: false },
  { long: "reset", short: "r", withArg: false },
  { long: "stage", short: "s", withArg: false },
  { long: "uninstall", short: "u", withArg: true },
  { long: "version", short: "v", withArg: false },
] as const;
