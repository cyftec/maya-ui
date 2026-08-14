# Maya UI framework mono repo

This repository contains the `@cyftec/maya` UI runtime, the `@cyftec/brahma`
CLI, the docs site, and the embedded app probes Brahma uses for scaffolding.

## Current baseline

- The entire monorepo is pinned to exactly TypeScript `7.0.2`.
- Repository TypeScript projects inherit the strict settings in
  [`tsconfig.base.json`](./tsconfig.base.json).
- NoCSS is Maya's application styling system. TypeScript source declares typed
  class usage and Brahma emits only the CSS required by the built pages.

## Setup

After cloning the repository, configure git hooks:

```bash
git config core.hooksPath .githooks
```

This ensures the pre-commit and pre-push hooks are active, which prevent commits/pushes while in dev-mode.

## Tests

Run the repository-wide TypeScript check:

```bash
bun run typecheck
```

Run the full workspace test suite:

```bash
bun run test
```

Run package suites individually:

```bash
bun run test:maya
bun run test:brahma
```

## Brahma scaffolds

`brahma create` and `brahma reset` copy embedded probe files from
`brahma/src/probe-helpers/probe`. The shared Karma template lives in
`brahma/src/probe-helpers/probe/base-karma`, while mode-specific app templates
live under `brahma/src/probe-helpers/probe/apps/{web,pwa,ext}`.

The generated web scaffold emits routes from `dev/view/pages`. PWA and
extension scaffolds transform the base Karma file to emit from `dev`.

Karma also defines `buildableStylesheetFileName` and `assetsDirName`. Brahma
installs the NoCSS stylesheet probe at that configured location, collects
typed class usage while building pages, and writes the generated `styles.css`
to the staging or production assets directory.

## Coding specifications

- [`MAYA_APP_CODING_SPEC.md`](./MAYA_APP_CODING_SPEC.md): shared Maya and Brahma
  application contract.
- [`NOCSS_CODING_SPEC.md`](./NOCSS_CODING_SPEC.md): NoCSS configuration,
  helpers, build behavior, and the mandatory styling policy for coding agents.
- [`MAYA_UI_CODING_SPEC.md`](./MAYA_UI_CODING_SPEC.md): DOM UI profile.
- [`MAYA_CANVAS_GAME_CODING_SPEC.md`](./MAYA_CANVAS_GAME_CODING_SPEC.md):
  canvas-game profile.
- [`AGENTS.md`](./AGENTS.md): concise repository instructions that coding
  agents must follow.
