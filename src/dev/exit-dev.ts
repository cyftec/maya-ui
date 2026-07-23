import { $ } from "bun";
import { getCurrentGlobalBrahmaVersion, setProjectMode } from "../common";

await setProjectMode("publish");
const version = await getCurrentGlobalBrahmaVersion();
await $`cd ./sample-maya-app && bun unlink && bun r -g @cyftec/sample-maya-app`;
await $`cd ./brahma && bun unlink && bun r -g @cyftec/brahma && bun install -g @cyftec/brahma@${version || "latest"}`;
