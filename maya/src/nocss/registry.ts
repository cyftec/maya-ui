type CssGlobalRegistry = { usedClassNames: Set<string> };

export const NoCssRegistry = (function () {
  const NO_CSS_GLOBAL_REGISTRY_WINDOW_KEY = "__noCssGlobalRegistry";
  const globalContext = globalThis as Record<string, any>;

  let cssGlobalRegistry = globalContext[NO_CSS_GLOBAL_REGISTRY_WINDOW_KEY] as
    | CssGlobalRegistry
    | undefined;

  if (!cssGlobalRegistry) {
    globalContext[NO_CSS_GLOBAL_REGISTRY_WINDOW_KEY] = {};
    cssGlobalRegistry = globalContext[
      NO_CSS_GLOBAL_REGISTRY_WINDOW_KEY
    ] as CssGlobalRegistry;
  }

  if (!cssGlobalRegistry.usedClassNames) {
    cssGlobalRegistry.usedClassNames = new Set();
  }

  const registry = {
    registerClassName: (phrase: string): string => {
      const classNames = phrase.split(" ").filter((str) => !!str);
      classNames.forEach((name) => {
        cssGlobalRegistry.usedClassNames.add(name);
      });
      return phrase;
    },
    getClassNamesList: () => {
      return new Set(cssGlobalRegistry.usedClassNames);
    },
    reset: () => cssGlobalRegistry.usedClassNames.clear(),
  } as const;

  return registry;
})();
