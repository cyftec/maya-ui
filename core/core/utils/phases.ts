import { source } from "../../signal/index.ts";

type Phases = {
  htmlBuildPhase: boolean;
  domAccessPhase: boolean;
  appRunningPhase: boolean;
};

export const phases = source<Phases>({
  htmlBuildPhase: true,
  domAccessPhase: false,
  appRunningPhase: false,
});

export const startPhase = (key: keyof Phases) => {
  phases.value = {
    htmlBuildPhase: false,
    domAccessPhase: false,
    appRunningPhase: false,
    [key]: true,
  };
};
