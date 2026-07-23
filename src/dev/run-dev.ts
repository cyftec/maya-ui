import { $ } from "bun";
import { setProjectMode } from "../common";

// TODO: Implement an indicator in terminal to show dev mode when any command runs
await setProjectMode("dev");
await $`cd ./sample-maya-app && bun link`;
await $`cd ./brahma && bun link`;
