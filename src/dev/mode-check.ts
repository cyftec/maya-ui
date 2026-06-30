import { isDevMode } from "../common";
import { ProjectMode } from "./utils";

const mode: ProjectMode = (await isDevMode()) ? "dev" : "publish";
console.log(mode);
