export const DEST_HTML_DEFAULT_FILE_NAME = "index";
export const DEST_JS_DEFAULT_FILE_NAME = "main";
export const DEST_HTML_FILE_EXT = ".html";
export const DEST_JS_FILE_EXT = ".js";

export const NO_HTML_ERROR = "no html";
export const NO_JS_ERROR = "no js";

export const DS_STORE_REGEX = /\.DS_Store$/;

// canHaveArgs usage not implemnted, args should be present only when canHaveArgs is true
export const ACCEPTED_COMMANDS = [
  { long: "create", short: "c", canHaveArgs: true },
  { long: "help", short: "h", canHaveArgs: false },
  { long: "install", short: "i", canHaveArgs: true },
  { long: "publish", short: "p", canHaveArgs: false },
  { long: "reset", short: "r", canHaveArgs: true },
  { long: "stage", short: "s", canHaveArgs: false },
  { long: "uninstall", short: "u", canHaveArgs: true },
  { long: "version", short: "v", canHaveArgs: true },
] as const;
