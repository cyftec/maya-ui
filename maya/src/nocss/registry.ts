import type { PhraseConstrain } from "./utils";

export type ClassNamesPhrase<
  T extends string,
  ClassNamesUnion extends string,
> = T & PhraseConstrain<T, ClassNamesUnion>;

type NoCssGlobalRegistry<ClassNamesUnion extends string> = {
  baseClassNamesOverrides: Record<ClassNamesUnion, string>;
  compundClassNames: Record<string, ClassNamesPhrase<string, ClassNamesUnion>>;
  usedClassNames: Set<ClassNamesUnion>;
};

export const NoCssRegistry = (function () {
  const NO_CSS_GLOBAL_REGISTRY_WINDOW_KEY = "__noCssGlobalRegistry";
  const globalContext = globalThis as Record<string, any>;

  let noCssGlobalRegistry = globalContext[NO_CSS_GLOBAL_REGISTRY_WINDOW_KEY] as
    | NoCssGlobalRegistry<string>
    | undefined;

  if (!noCssGlobalRegistry) {
    globalContext[NO_CSS_GLOBAL_REGISTRY_WINDOW_KEY] = {};
    noCssGlobalRegistry = globalContext[
      NO_CSS_GLOBAL_REGISTRY_WINDOW_KEY
    ] as NoCssGlobalRegistry<string>;
    noCssGlobalRegistry.usedClassNames = new Set();
  }

  const registry = {
    overrideBaseClassNames: <ClassNamesUnion extends string>(
      obj: Record<ClassNamesUnion, string>,
    ) => {
      noCssGlobalRegistry.baseClassNamesOverrides = obj;
    },
    registerCompoundClassNames: <ClassNamesUnion extends string>(
      coumpoundClassNamesObject: Record<
        string,
        ClassNamesPhrase<string, ClassNamesUnion>
      >,
    ) => {
      noCssGlobalRegistry.compundClassNames = coumpoundClassNamesObject;
    },
    registerAndReturn: <T extends string, ClassNamesUnion extends string>(
      phrase: ClassNamesPhrase<T, ClassNamesUnion>,
    ): string => {
      const classNames = phrase
        .split(" ")
        .filter((str) => !!str) as ClassNamesUnion[];
      classNames.forEach((name) => {
        noCssGlobalRegistry.usedClassNames.add(name);
      });
      return phrase;
    },
  };

  return registry;
})();
