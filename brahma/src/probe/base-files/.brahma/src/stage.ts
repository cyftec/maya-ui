import { APP_SRC_DIRNAME, STAGING_DIRNAME } from "../../karma.mjs";
import { buildApp } from "./build";
import { ROOT_DIR } from "./common";

const BUILD_SRC_DIR = `${ROOT_DIR}/${APP_SRC_DIRNAME}`;
const BUILD_DEST_DIR = `${ROOT_DIR}/${STAGING_DIRNAME}`;
buildApp(BUILD_SRC_DIR, BUILD_DEST_DIR);
