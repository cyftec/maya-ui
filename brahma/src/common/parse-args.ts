import { ACCEPTED_COMMANDS } from "./constants";

type AcceptedCommand = (typeof ACCEPTED_COMMANDS)[number];
type Command = AcceptedCommand["long"] | AcceptedCommand["short"];
type CommandsMap = {
  [x in AcceptedCommand["long"]]: { args: string[] } | undefined;
} & {
  nocmd: boolean;
  error: boolean;
};

export const getParsedCommands = (argsv: string[]) => {
  const parsed = argsv.slice(2);
  const cmd = parsed[0];
  const args = parsed.slice(1);
  const commandsMap: CommandsMap = {
    ...ACCEPTED_COMMANDS.reduce(
      (map, aa) => ({ ...map, [aa.long]: undefined }),
      {} as CommandsMap
    ),
    nocmd: false,
    error: false,
  };
  const matchingCmd = ACCEPTED_COMMANDS.find((aa) =>
    [aa.long, aa.short].includes(cmd as Command)
  );

  if (!cmd) commandsMap.nocmd = true;
  if (matchingCmd) commandsMap[matchingCmd.long] = { args };
  if (cmd && !matchingCmd) commandsMap.error = true;

  return commandsMap;
};
