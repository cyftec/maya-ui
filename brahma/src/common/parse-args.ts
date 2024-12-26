import { ACCEPTED_ARGS, NO_ARG_PROVIDED } from "./constants";

type Arg = (typeof ACCEPTED_ARGS)[number];
type ArgsMap = {
  [x in Arg["long"]]: string;
};

export const parseArgs = (argsv: string[]) => {
  const args = argsv.splice(2);
  const argsMap: ArgsMap = {
    ...ACCEPTED_ARGS.reduce(
      (map, aa) => ({ ...map, [aa.long]: "" }),
      {} as ArgsMap
    ),
  };
  const addedCmds: (keyof ArgsMap)[] = [];

  for (let i = 0; i < args.length; i++) {
    const cmd = args[i];
    const arg = args[i + 1];
    const matchingCmd = ACCEPTED_ARGS.find((aa) =>
      [aa.long, aa.short].includes(cmd as keyof ArgsMap)
    );

    if (!matchingCmd || (matchingCmd && addedCmds.includes(matchingCmd.long))) {
      break;
    }
    argsMap[matchingCmd.long] =
      arg || (matchingCmd.withArg ? NO_ARG_PROVIDED : matchingCmd.long);
  }

  return argsMap;
};
