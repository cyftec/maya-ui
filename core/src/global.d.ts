declare global {
  interface Window {
    isBuildHtmlPhase?: boolean;
    isDomAccessPhase?: boolean;
  }
}

export {};
