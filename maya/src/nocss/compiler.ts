import { factoryClasses, mediaConstraints } from "./factory";
import { NoCssRegistry } from "./registry";
import type {
  AtomicClassGroup,
  AtomicClassOverrides,
  MediaConstraints,
  MediaConstraintsOverrides,
} from "./utils";

export type NoCssStylesheetConfig = {
  overriddenBaseClasses?: AtomicClassOverrides;
  overriddenMediaConstraints?: MediaConstraintsOverrides;
  compoundClasses?: Record<string, string>;
};

type AtomicClassGroups = Record<AtomicClassGroup, Record<string, string>>;

const classNameFromSelector = (selector: string) =>
  selector.split(":", 1)[0] ?? selector;

const selectorForClassName = (selector: string, className: string) =>
  `.${className}${selector.slice(classNameFromSelector(selector).length)}`;

const mergeClassGroups = (
  overrides: AtomicClassOverrides = {},
): AtomicClassGroups => ({
  default: { ...factoryClasses.default, ...overrides.default },
  ns: { ...factoryClasses.ns, ...overrides.ns },
  m: { ...factoryClasses.m, ...overrides.m },
  l: { ...factoryClasses.l, ...overrides.l },
});

const mergeMediaConstraints = (
  overrides: MediaConstraintsOverrides = {},
): MediaConstraints => ({
  ns: { ...mediaConstraints.ns, ...overrides.ns },
  m: { ...mediaConstraints.m, ...overrides.m },
  l: { ...mediaConstraints.l, ...overrides.l },
});

const mediaQuery = (constraints: Record<string, string>) =>
  Object.entries(constraints)
    .map(([property, value]) =>
      `(${property.replace(/[A-Z]/g, (letter) => `-${letter.toLowerCase()}`)}:${value})`,
    )
    .join(" and ");

const splitClassNames = (phrase: string) => phrase.split(" ").filter(Boolean);

const expandCompoundClass = (
  className: string,
  compoundClasses: Record<string, string>,
  seen: ReadonlySet<string> = new Set(),
): string[] => {
  const phrase = compoundClasses[className];
  if (!phrase) return [className];
  if (seen.has(className)) {
    throw new Error(`Circular nocss compound class: '${className}'.`);
  }

  const nextSeen = new Set(seen).add(className);
  return splitClassNames(phrase).flatMap((name) =>
    expandCompoundClass(name, compoundClasses, nextSeen),
  );
};

const rulesForClassName = (
  groups: AtomicClassGroups,
  className: string,
  outputClassName: string,
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
          `${selectorForClassName(selector, outputClassName)}${declaration}`,
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
  const groups = mergeClassGroups(config.overriddenBaseClasses);
  const constraints = mergeMediaConstraints(config.overriddenMediaConstraints);
  const compoundClasses = config.compoundClasses || {};
  const output = {
    default: [] as string[],
    ns: [] as string[],
    m: [] as string[],
    l: [] as string[],
  };

  for (const usedClassName of new Set(usedClassNames)) {
    const atomicClassNames = expandCompoundClass(usedClassName, compoundClasses);
    for (const atomicClassName of atomicClassNames) {
      const rules = rulesForClassName(
        groups,
        atomicClassName,
        usedClassName in compoundClasses ? usedClassName : atomicClassName,
      );
      output.default.push(...rules.default);
      output.ns.push(...rules.ns);
      output.m.push(...rules.m);
      output.l.push(...rules.l);
    }
  }

  const responsive = ([groupName, rules]: [keyof MediaConstraints, string[]]) =>
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
