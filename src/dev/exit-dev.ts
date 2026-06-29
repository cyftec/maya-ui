//cd packages/brahma && bun unlink && npm install -g @my-org/brahma
import { $ } from "bun";
import { getCurrentBrahmaVersion, setPackageMode } from "../common";

await setPackageMode("publish");
const version = await getCurrentBrahmaVersion();
await $`cd ./brahma && bun unlink && bun install -g @cyftec/brahma@${version || "latest"}`;
