# Maya UI framework mono repo

This repository contains the `@cyftec/maya` UI runtime, the `@cyftec/brahma`
CLI, the docs site, and the embedded app probes Brahma uses for scaffolding.

## Setup

After cloning the repository, configure git hooks:

```bash
git config core.hooksPath .githooks
```

This ensures the pre-commit and pre-push hooks are active, which prevent commits/pushes while in dev-mode.

## Tests

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
