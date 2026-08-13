type NoCssGlobalRegistry = {
  baseClassNamesOverrides: Record<string, string>;
  compundClassNames: Record<string, string>;
  usedClassNames: Set<string>;
};

export const NoCssRegistry = (function () {
  const NO_CSS_GLOBAL_REGISTRY_WINDOW_KEY = "__noCssGlobalRegistry";
  const globalContext = globalThis as Record<string, any>;

  let noCssGlobalRegistry = globalContext[NO_CSS_GLOBAL_REGISTRY_WINDOW_KEY] as
    | NoCssGlobalRegistry
    | undefined;

  if (!noCssGlobalRegistry) {
    globalContext[NO_CSS_GLOBAL_REGISTRY_WINDOW_KEY] = {};
    noCssGlobalRegistry = globalContext[
      NO_CSS_GLOBAL_REGISTRY_WINDOW_KEY
    ] as NoCssGlobalRegistry;
    noCssGlobalRegistry.usedClassNames = new Set();
  }

  const registry = {
    overrideBaseClassNames: (obj: Record<string, string>) => {
      noCssGlobalRegistry.baseClassNamesOverrides = obj;
    },
    registerCompoundClassNames: (
      coumpoundClassNamesObject: Record<string, string>,
    ) => {
      noCssGlobalRegistry.compundClassNames = coumpoundClassNamesObject;
    },
    registerAndReturn: (phrase: string): string => {
      const classNames = phrase
        .split(" ")
        .filter((str) => !!str);
      classNames.forEach((name) => {
        noCssGlobalRegistry.usedClassNames.add(name);
      });
      return phrase;
    },
  };

  return registry;
})();
