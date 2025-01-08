import { effect, signal } from "@cyftech/signal";

/**
 * Given that the source code for the app is ready, for generating
 * and getting the MPA to work (either in local or production envireonment)
 * Maya library works in 3 phases, particularly in below mentioned order,
 * 1.BUILD ----> 2.MOUNT ----> 3.RUN
 *
 * 1. BUILD phase
 * In this phase a builder script should generate the MPA with all its
 * html, js, css and asset files in appropriate routing directory structure.
 * Each html elements must have a unique id so that during 'mount' phase,
 * each js component should latch to its equivalent html node.
 *
 * 2. MOUNT phase
 * In this phase, when all the static files and script is loaded, there must be a
 * mount-and-run method in the page script which should run immediately after
 * script load. This method should hook each js component to its equivalent
 * DOM node and retain the nodes access (in memory).
 *
 * 3. RUN phase
 * During this phase, the script simply updates deletes attributes
 * of in-memory DOM nodes or add new attributes or nodes to the DOM.
 */
type Phase = "none" | "build" | "mount" | "run";

const _currentPhase = signal<Phase>("none");

effect(() => console.log(`Current phase is ${_currentPhase.value}`));

export const currentPhaseIs = (phase: Phase): boolean =>
  _currentPhase.value === phase;

export const startPhase = (phase: Phase): void => {
  _currentPhase.value = phase;
};
