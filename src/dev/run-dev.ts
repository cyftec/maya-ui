import { $ } from "bun";
import { setPackageMode } from "../common";

await setPackageMode("dev");
await $`cd ./brahma && bun link`;
