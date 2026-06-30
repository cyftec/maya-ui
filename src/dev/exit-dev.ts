import { $ } from "bun";
import { getCurrentGlobalBrahmaVersion, setProjectMode } from "../common";

await setProjectMode("publish");
const version = await getCurrentGlobalBrahmaVersion();
await $`cd ./brahma && bun unlink && bun install -g @cyftec/brahma@${version || "latest"}`;
