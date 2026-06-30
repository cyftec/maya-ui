import { isDevMode, ProjectMode } from "../common";

const mode: ProjectMode = (await isDevMode()) ? "dev" : "publish";
console.log(mode);
