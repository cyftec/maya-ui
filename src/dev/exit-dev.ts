import { $ } from "bun";
import { getCurrentBrahmaVersion, setPackageMode } from "./utils";

await setPackageMode("publish");
const version = await getCurrentBrahmaVersion();
await $`cd ./brahma && bun unlink && bun install -g @cyftec/brahma@${version || "latest"}`;
