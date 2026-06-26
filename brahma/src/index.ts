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
import { getKarma } from "./utils/common.ts";
import { ValidateAppFileAndExitIf } from "./utils/file-validations.ts";

const execCli = async () => {
  const cwd = process.cwd();
  const commands = getParsedCommands(Bun.argv);

  if (commands.help || commands.nocmd) showHelp();
  if (commands.create) await createApp(commands.create.args);
  if (commands.version) await showVersion(commands.version.args);
  if (commands.reset) await resetApp(commands.reset.args);

  // 4 commands can run without (or corrupted) karma file - help, create, version and reset
  // karma is required for below commands
  // karma file validation is done within the 'getKarma' method itself
  // process exits if karma file is missing or corrupted
  const karma = await getKarma(cwd);

  if (commands.uninstall)
    await uninstallPackageOrEverything(commands.uninstall.args, karma);
  if (commands.install)
    await installPackageOrEverything(commands.install.args, karma);

  ValidateAppFileAndExitIf.appSrcDirMissing(cwd, karma);
  ValidateAppFileAndExitIf.appViewDirMissing(cwd, karma);
  ValidateAppFileAndExitIf.packageJsonMissing(cwd);

  if (commands.stage) await stageApp();
  if (commands.publish) await publishApp();

  if (commands.error) {
    console.log(`ERROR: bad input.\nCheck usage guide below.`);
    showHelp();
  }
};

execCli();
