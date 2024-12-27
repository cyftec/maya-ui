export const DEST_HTML_DEFAULT_FILE_NAME = "index";
export const DEST_JS_DEFAULT_FILE_NAME = "main";
export const DEST_HTML_FILE_EXT = ".html";
export const DEST_JS_FILE_EXT = ".js";

export const NO_HTML_ERROR = "no html";
export const NO_JS_ERROR = "no js";

export const NO_ARG_PROVIDED = "_____no_arg_provided";

export const ACCEPTED_ARGS = [
  { long: "help", short: "h", withArg: false },
  { long: "version", short: "v", withArg: false },
  { long: "create", short: "c", withArg: true },
  { long: "install", short: "i", withArg: true },
  { long: "uninstall", short: "u", withArg: true },
  { long: "reset", short: "r", withArg: false },
  { long: "stage", short: "s", withArg: false },
  { long: "publish", short: "p", withArg: false },
] as const;
