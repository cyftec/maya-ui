# Maya repository instructions for coding agents

Read [`MAYA_APP_CODING_SPEC.md`](./MAYA_APP_CODING_SPEC.md), [`NOCSS_CODING_SPEC.md`](./NOCSS_CODING_SPEC.md), and the applicable UI or canvas-game profile before changing a Maya application.

## Agent-only styling policy

This section is mandatory for coding agents. It does not restrict how human contributors choose to work.

- NoCSS is the only permitted authoring path for CSS-based application styles.
- Import the app's typed `css` helper from its configured `styles.ts` module and pass every HTML/SVG `class` value through that helper.
- Add or change visual rules through `atomicClassOverrides`, `mediaConstraintsOverrides`, and `compoundClasses` in the NoCSS stylesheet module.
- Do not create or edit authored `.css` files, inline `style` attributes, `m.Style`/`m.SvgStyle` content, CSS-in-JS objects, runtime-injected style elements, or an additional styling dependency.
- Do not bypass NoCSS with raw, interpolated, cast, or broadly typed class-name strings. Use `css`, `css.when`, `css.cases`, or `css.ifNullable` as appropriate.
- A generated `styles.css` file and the page's link to it are build output, not alternative styling systems. Never edit staging or production output.
- Existing human-authored CSS outside the requested change may remain untouched. If an agent must change the behavior of an existing rule, move the affected styling into NoCSS instead of extending the stylesheet.
- Canvas drawing properties such as `fillStyle` describe pixels rendered by a canvas context and are not DOM CSS authoring. The canvas element and all DOM UI around it still use NoCSS.

The complete API, configuration, build behavior, and examples are in [`NOCSS_CODING_SPEC.md`](./NOCSS_CODING_SPEC.md).

## TypeScript baseline

- The repository uses exactly TypeScript `7.0.2`.
- Repository projects extend [`tsconfig.base.json`](./tsconfig.base.json); keep differences limited to project boundaries and required test aliases.
- Generated applications receive the equivalent strict configuration and exact TypeScript pin from `_karma/karma.ts`.
- Do not downgrade TypeScript, add a range to its version, or create a divergent compiler configuration to work around an error.
- Run `bun run typecheck` and the relevant tests after TypeScript changes.
