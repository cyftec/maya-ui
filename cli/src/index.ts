#! /usr/bin/env bun

// import { parseArgs, type ParseOptions } from "@std/cli";
import {
  createApp,
  installApp,
  showHelp,
  showVersion,
  stageApp,
  uninstallApp,
} from "./commands/index.ts";
import { parseArgs } from "./common/parse-args.ts";
import { readdir, exists } from "node:fs/promises";
import { getKarma, isMayaAppDir } from "./common/utils.ts";

// console.log(`launching BRM`);

const runStage = async () => {
  const args = parseArgs(Bun.argv);

  if (Object.values(args).every((v) => !v)) showHelp();
  args.help && showHelp();
  args.version && showVersion();
  args.create && (await createApp(args.create));

  const projectRootDirPath = process.cwd();
  const karma = await getKarma(projectRootDirPath);
  if (!karma) return false;
  const { config, regeneratables } = karma;

  args.uninstall && (await uninstallApp(projectRootDirPath, regeneratables));

  const mayaAppDir = await isMayaAppDir(projectRootDirPath);
  if (!mayaAppDir || !config) {
    const files = await readdir(projectRootDirPath);
    console.log(
      `ERROR: Command will not work as this is not a valid maya project directory.
  
  Possible reasons, either one or both:
  - Config file ('karma.ts') is either missing or corrupted.
  - App src directory name is '${config?.app.appRootDirName}' and it is missing`
    );
    console.log(`\nList of files in current directory:`);
    console.log(files);
    process.exit(1);
  }

  args.install &&
    (await installApp(projectRootDirPath, config, regeneratables));

  const packageJsonFileExists = await exists(
    `${projectRootDirPath}/package.json`
  );
  if (!packageJsonFileExists) {
    console.log(
      `ERROR: App not installed. 'package.json' file is missing.
  Run 'brm install' command to install app first.`
    );
    process.exit(1);
  }

  args.stage && (await stageApp());
  // args.publish && publishApp();
  // args.add && addPackage(args.add);
  // args.remove && removePackage(args.remove);

  showHelp();
};

runStage();
