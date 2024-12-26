const boolArgs = [
  { long: "help", short: "h" },
  { long: "version", short: "v" },
  { long: "install", short: "i" },
  { long: "uninstall", short: "u" },
  { long: "stage", short: "s" },
  { long: "publish", short: "p" },
] as const;

const stringArgs = [
  { long: "create", short: "c" },
  { long: "add", short: "a" },
  { long: "remove", short: "r" },
] as const;

type BoolArg = (typeof boolArgs)[number];
type BoolArgsMap = {
  [x in BoolArg["long"]]: boolean;
};

type StringArg = (typeof stringArgs)[number];
type StringArgsMap = {
  [x in StringArg["long"]]: string;
};

export const parseArgs = (argsv: string[]) => {
  const args = argsv.splice(2);
  const boolsMap: BoolArgsMap = {
    ...boolArgs.reduce(
      (map, ba) => ({ ...map, [ba.long]: false }),
      {} as BoolArgsMap
    ),
  };
  const stringsMap: StringArgsMap = {
    ...stringArgs.reduce(
      (map, sa) => ({ ...map, [sa.long]: "" }),
      {} as StringArgsMap
    ),
  };
  const addedCmds: (keyof BoolArgsMap | keyof StringArgsMap)[] = [];

  for (let i = 0; i < args.length; i++) {
    const cmd = args[i];
    const arg = args[i + 1];
    const matchingBoolCmd = boolArgs.find((ba) =>
      [ba.long, ba.short].includes(cmd as keyof BoolArgsMap)
    );
    const matchingStringCmd = matchingBoolCmd
      ? undefined
      : stringArgs.find((sa) =>
          [sa.long, sa.short].includes(cmd as keyof StringArgsMap)
        );

    if (
      (matchingBoolCmd && addedCmds.includes(matchingBoolCmd.long)) ||
      (matchingStringCmd && addedCmds.includes(matchingStringCmd.long))
    ) {
      break;
    }

    if (!arg && matchingBoolCmd) {
      boolsMap[matchingBoolCmd.long] = true;
    }

    if (arg && matchingStringCmd) {
      stringsMap[matchingStringCmd.long] = arg;
    }
  }

  return {
    ...boolsMap,
    ...stringsMap,
  };
};
