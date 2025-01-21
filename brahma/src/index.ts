#! /usr/bin/env bun

import {
  createApp,
  installPackageOrEverything,
  publishApp,
  resetApp,
  showHelp,
  showVersion,
  stageApp,
  uninstallPackageOrEverything,
} from "./commands/index.ts";
import { getParsedCommands } from "./utils/command-parser.ts";
import { readdir, exists } from "node:fs/promises";
import { getKarma, validateMayaAppDir } from "./utils/common.ts";
import type { Karma } from "./probes/karma/karma-types.ts";

const execCli = async () => {
  const cwd = process.cwd();
  const commands = getParsedCommands(Bun.argv);
  // console.log(commands);

  if (commands.help || commands.nocmd) showHelp();
  if (commands.version) await showVersion(commands.version.args);
  if (commands.create) await createApp(commands.create.args);
  if (commands.reset) await resetApp();

  const { karmaMissing, karmaCorrupted, srcDirMissing } =
    await validateMayaAppDir(cwd);
  if (karmaMissing || karmaCorrupted) {
    console.log(
      karmaMissing
        ? `ERROR: 'karma.ts' file is missing.`
        : karmaCorrupted
        ? `ERROR: 'karma.ts' file is corrupted.
  - Use 'brahma reset' and then 'brahma install' to reset karma.ts and reinstall app.
    WARNING: You might lose previous config changes. Make sure to use git to have access to previous state.`
        : ""
    );
    process.exit(1);
  }

  const karma = (await getKarma(cwd)) as Karma;
  const {
    config,
    projectFileNames: { generated: regeneratableFiles },
  } = karma;

  if (commands.uninstall)
    await uninstallPackageOrEverything(
      commands.uninstall.args,
      regeneratableFiles
    );

  if (srcDirMissing) {
    const files = await readdir(cwd);
    console.log(
      `ERROR: App source directory '${config?.brahma.build.sourceDirName}' is either missing or have a different name.`
    );
    console.log(`\nList of files in current directory:`);
    console.log(files);
    process.exit(1);
  }

  if (commands.install)
    await installPackageOrEverything(
      commands.install.args,
      config,
      regeneratableFiles
    );

  const packageJsonFileExists = await exists(`${cwd}/package.json`);
  if (!packageJsonFileExists) {
    console.log(
      `ERROR: App not installed. 'package.json' file is missing.
  Run 'brahma install' command to install app first.`
    );
    process.exit(1);
  }

  if (commands.stage) await stageApp();
  if (commands.publish) await publishApp();

  if (commands.error) {
    console.log(`ERROR: bad input.\nCheck usage guide below.`);
    showHelp();
  }
};

execCli();
