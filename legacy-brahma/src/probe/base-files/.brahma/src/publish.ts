import { APP_SRC_DIRNAME, PUBLISH_DIRNAME } from "../../karma.mjs";
import { buildApp } from "./build";
import { ROOT_DIR } from "./common";

const BUILD_SRC_DIR = `${ROOT_DIR}/${APP_SRC_DIRNAME}`;
const BUILD_DEST_DIR = `${ROOT_DIR}/${PUBLISH_DIRNAME}`;
buildApp(BUILD_SRC_DIR, BUILD_DEST_DIR);
