import { signal } from "../signal";

type Phase = "build" | "mount" | "run";

const _currentPhase = signal<Phase>("build");

export const currentPhaseIs = (phase: Phase): boolean =>
  _currentPhase.value === phase;

export const startPhase = (phase: Phase): void => {
  _currentPhase.value = phase;
};
