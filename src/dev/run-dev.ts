import { $ } from "bun";
import { setPackageMode } from "../common";

// TODO: Implement an indicator in terminal to show dev mode when any command runs
await setPackageMode("dev");
await $`cd ./brahma && bun link`;
