import { $ } from "bun";

export type CommandRunner = (command: string, cwd?: string) => Promise<void>;

export const runShellCommand: CommandRunner = async (command, cwd) => {
  const shellCommand = $`${{ raw: command }}`;
  if (cwd) shellCommand.cwd(cwd);
  await shellCommand;
};
