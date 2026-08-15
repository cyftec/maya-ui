import { factoryAtomicClasses, factoryMediaConstraints } from "./factory";
import { NoCssRegistry } from "./registry";
import type {
  AtomicClassGroup,
  AtomicClassOverrides,
  MediaConstraints,
  MediaConstraintsOverrides,
} from "./utils";

export type NoCssStylesheetConfig = {
  atomicClassOverrides?: AtomicClassOverrides;
  mediaConstraintsOverrides?: MediaConstraintsOverrides;
  compoundClasses?: Record<string, string>;
};

type AtomicClassGroups = Record<AtomicClassGroup, Record<string, string>>;

const classNameFromSelector = (selector: string) =>
  selector.split(":", 1)[0] ?? selector;

const mergeClassGroups = (
  overrides: AtomicClassOverrides = {},
): AtomicClassGroups => ({
  default: { ...factoryAtomicClasses.default, ...overrides.default },
  ns: { ...factoryAtomicClasses.ns, ...overrides.ns },
  m: { ...factoryAtomicClasses.m, ...overrides.m },
  l: { ...factoryAtomicClasses.l, ...overrides.l },
});

const mergeMediaConstraints = (
  overrides: MediaConstraintsOverrides = {},
): MediaConstraints => ({
  ns: { ...factoryMediaConstraints.ns, ...overrides.ns },
  m: { ...factoryMediaConstraints.m, ...overrides.m },
  l: { ...factoryMediaConstraints.l, ...overrides.l },
});

const mediaQuery = (constraints: Record<string, string>) =>
  Object.entries(constraints)
    .map(
      ([property, value]) =>
        `(${property.replace(/[A-Z]/g, (letter) => `-${letter.toLowerCase()}`)}:${value})`,
    )
    .join(" and ");

const splitClassNames = (phrase: string) => phrase.split(" ").filter(Boolean);

const atomicClassNamesFrom = (groups: AtomicClassGroups) =>
  new Set(
    Object.values(groups).flatMap((rules) =>
      Object.keys(rules).map(classNameFromSelector),
    ),
  );

const validateCompoundClasses = (
  compoundClasses: Record<string, string>,
  atomicClassNames: ReadonlySet<string>,
) => {
  for (const [compoundClassName, phrase] of Object.entries(compoundClasses)) {
    if (atomicClassNames.has(compoundClassName)) {
      throw new Error(
        `NoCSS compound class '${compoundClassName}' conflicts with an atomic class.`,
      );
    }

    const classNames = splitClassNames(phrase);
    if (classNames.length < 2) {
      throw new Error(
        `NoCSS compound class '${compoundClassName}' must contain at least two atomic classes.`,
      );
    }

    for (const className of classNames) {
      if (Object.hasOwn(compoundClasses, className)) {
        throw new Error(
          `NoCSS compound class '${compoundClassName}' must not contain compound class '${className}'.`,
        );
      }
      if (!atomicClassNames.has(className)) {
        throw new Error(
          `Unknown NoCSS atomic class '${className}' in compound class '${compoundClassName}'.`,
        );
      }
    }
  }
};

const rulesForClassName = (
  groups: AtomicClassGroups,
  className: string,
) => {
  const rulesByGroup: Record<AtomicClassGroup, string[]> = {
    default: [],
    ns: [],
    m: [],
    l: [],
  };

  for (const groupName of Object.keys(groups) as AtomicClassGroup[]) {
    const rules = groups[groupName];
    for (const [selector, declaration] of Object.entries(rules)) {
      if (classNameFromSelector(selector) === className) {
        rulesByGroup[groupName].push(
          `.${selector}${declaration}`,
        );
      }
    }
  }

  return rulesByGroup;
};

/**
 * Produces CSS for the class names collected while Brahma renders an app.
 * Factory and override maps are intentionally read only by the compiler.
 */
export const buildNoCssStylesheet = (
  usedClassNames: Iterable<string>,
  config: NoCssStylesheetConfig = {},
) => {
  const groups = mergeClassGroups(config.atomicClassOverrides);
  const constraints = mergeMediaConstraints(config.mediaConstraintsOverrides);
  const compoundClasses = config.compoundClasses || {};
  const atomicClassNames = atomicClassNamesFrom(groups);
  validateCompoundClasses(compoundClasses, atomicClassNames);
  const output = {
    default: [] as string[],
    ns: [] as string[],
    m: [] as string[],
    l: [] as string[],
  };

  for (const usedClassName of new Set(usedClassNames)) {
    if (Object.hasOwn(compoundClasses, usedClassName)) {
      throw new Error(
        `NoCSS compound class '${usedClassName}' reached the stylesheet compiler. Pass compoundClasses to getCss() so it expands to atomic classes first.`,
      );
    }
    if (!atomicClassNames.has(usedClassName)) {
      throw new Error(`Unknown NoCSS atomic class '${usedClassName}'.`);
    }

    const rules = rulesForClassName(groups, usedClassName);
    output.default.push(...rules.default);
    output.ns.push(...rules.ns);
    output.m.push(...rules.m);
    output.l.push(...rules.l);
  }

  const responsive = ([groupName, rules]: [
    keyof MediaConstraints,
    string[],
  ]) =>
    rules.length
      ? `@media ${mediaQuery(constraints[groupName])}{${rules.join("")}}`
      : "";

  return [
    output.default.join(""),
    responsive(["ns", output.ns]),
    responsive(["m", output.m]),
    responsive(["l", output.l]),
  ].join("");
};

/** Build-only access to the registry shared by statically rendered pages. */
export const resetNoCssBuildRegistry = () => NoCssRegistry.reset();

/** Build-only access to the class names collected by `css` helpers. */
export const getUsedNoCssClassNames = () => NoCssRegistry.getClassNamesList();
