import type { MayaAppPhase } from "./index.types";

declare global {
  interface Window {
    _currentAppPhase: MayaAppPhase;
  }
}

export {};
