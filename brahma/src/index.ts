#! /usr/bin/env bun

import {
  createApp,
  installApp,
  publishApp,
  resetApp,
  showHelp,
  showVersion,
  stageApp,
  uninstallApp,
} from "./commands/index.ts";
import { parseArgs } from "./common/parse-args.ts";
import { readdir, exists } from "node:fs/promises";
import { getKarma, validateMayaAppDir } from "./common/utils.ts";
import type { Karma } from "./example/karma-types.ts";

const execCli = async () => {
  const cwd = process.cwd();
  const args = parseArgs(Bun.argv);
  // console.log(args);

  args.help && showHelp();
  args.version && (await showVersion());
  args.create && (await createApp(args.create));
  args.reset && (await resetApp());

  const { karmaMissing, karmaCorrupted, srcDirMissing } =
    await validateMayaAppDir(cwd);
  if (karmaMissing || karmaCorrupted) {
    console.log(
      karmaMissing
        ? `ERROR: 'karma.ts' file is missing.`
        : karmaCorrupted
        ? `ERROR: 'karma.ts' file is corrupted.
  - Use 'brhm reset' and then 'brhm install' to reset karma.ts and reinstall app.
    WARNING: You might lose previous config changes. Make sure to use git to have access to previous state.`
        : ""
    );
    process.exit(1);
  }

  const karma = (await getKarma(cwd)) as Karma;
  const { config, regeneratables } = karma;

  args.uninstall && (await uninstallApp(args.uninstall, regeneratables));

  if (srcDirMissing) {
    const files = await readdir(cwd);
    console.log(
      `ERROR: App source directory '${config?.app.sourceDirName}' is either missing or have a different name.`
    );
    console.log(`\nList of files in current directory:`);
    console.log(files);
    process.exit(1);
  }

  args.install && (await installApp(args.install, config, regeneratables));

  const packageJsonFileExists = await exists(`${cwd}/package.json`);
  if (!packageJsonFileExists) {
    console.log(
      `ERROR: App not installed. 'package.json' file is missing.
  Run 'brhm install' command to install app first.`
    );
    process.exit(1);
  }

  args.stage && (await stageApp());
  args.publish && (await publishApp());
};

execCli();
