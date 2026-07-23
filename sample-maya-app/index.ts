#!/usr/bin/env bun
import { Command } from "commander";
import * as fs from "fs-extra";
import * as path from "path";
import { fileURLToPath } from "url";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const program = new Command();

program
  .name("sample-maya")
  .description("CLI tool for copying Maya sample applications")
  .version("0.0.1");

program
  .command("app")
  .argument("<type>", "App type: web, ext, or pwa")
  .argument(
    "<targetPath>",
    "Target directory path where the app should be copied",
  )
  .action(async (type, targetPath) => {
    const validTypes = ["web", "ext", "pwa"];
    if (!validTypes.includes(type)) {
      console.error(
        `Error: Invalid app type '${type}'. Valid types are: ${validTypes.join(", ")}`,
      );
      process.exit(1);
    }

    const sourceDir = path.join(__dirname, "apps", type);
    const targetDir = targetPath;

    try {
      await fs.copy(sourceDir, targetDir);
      console.log(`Successfully copied '${type}' app to ${targetDir}.`);
    } catch (error) {
      console.error(`Error copying '${type}' app:`, error);
      process.exit(1);
    }
  });

program
  .command("karma")
  .argument("<type>", "App type: web, ext, or pwa")
  .argument(
    "<targetPath>",
    "Target directory path where the karma files should be copied",
  )
  .action(async (type, targetPath) => {
    const validTypes = ["web", "ext", "pwa"];
    if (!validTypes.includes(type)) {
      console.error(
        `Error: Invalid app type '${type}'. Valid types are: ${validTypes.join(", ")}`,
      );
      process.exit(1);
    }

    const sourceDir = path.join(__dirname, "apps", type, "_karma");
    const targetDir = path.join(targetPath, "_karma");

    try {
      await fs.copy(sourceDir, targetDir);
      console.log(
        `Successfully copied karma files from '${type}' app to ${targetDir}.`,
      );
    } catch (error) {
      console.error(`Error copying karma files from '${type}' app:`, error);
      process.exit(1);
    }
  });

program.parse();
