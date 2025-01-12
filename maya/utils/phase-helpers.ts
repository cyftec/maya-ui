import type { MayaAppPhase } from "../index.types";

export const phase = {
  currentIs: (p: MayaAppPhase): boolean => window._currentAppPhase === p,
  start: (p: MayaAppPhase): void => {
    window._currentAppPhase = p;
    console.log(`Current phase is ${p}`);
  },
};
