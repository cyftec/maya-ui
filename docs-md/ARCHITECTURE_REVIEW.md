# Architecture Review

Review date: 2026-06-23

Scope:

- `ARCHITECTURE.md`
- `ARCHITECTURE_v0.md` as preserved source context only
- `maya/**`
- `brahma/**`
- repository root metadata

Constraint honored: `ARCHITECTURE_v0.md` was not modified.

---

# Executive Summary

The original architecture draft describes Maya as a browser-native, MPA-first, static-deployment-oriented frontend framework with signal-driven reactivity and direct DOM updates rather than Virtual DOM rendering. The implementation broadly supports that direction.

The repository currently has two concrete packages:

- `@mufw/maya`: runtime, element factory, components, custom elements, DOM wiring, phase helpers, and query helper.
- `@mufw/brahma`: CLI, scaffolding, build pipeline, local staging server, production build workflow, and app probes.

Important initial finding: `ARCHITECTURE.md` did not exist before this task. `ARCHITECTURE_v0.md` contained the architecture draft and was used as preserved source text for the enhanced `ARCHITECTURE.md`.

---

# Preservation Check

| Requirement | Result | Notes |
| --- | --- | --- |
| Preserve at least 90% of existing architecture document | Satisfied | The v0 draft text was copied into `ARCHITECTURE.md` before expansion |
| Do not touch `ARCHITECTURE_v0.md` | Satisfied | File was read only |
| Do not rewrite philosophy | Satisfied | Expansion appends implementation detail and analysis without replacing intent |
| Do not propose alternative architecture | Satisfied | Gaps are documented as alignment notes, not replacement proposals |
| Architecture wins over implementation | Satisfied | Discrepancies are recorded as gaps |

---

# Source Files Reviewed

| Area | Files |
| --- | --- |
| Runtime exports | `maya/index.ts`, `maya/core/index.ts` |
| Component model | `maya/core/component.ts` |
| Element factory | `maya/core/elements/m.ts`, `maya/core/dom/create-element.ts` |
| Custom elements | `maya/core/elements/custom-elements/if.ts`, `for.ts`, `switch.ts` |
| Lifecycle | `maya/utils/phase-helpers.ts`, `maya/index.types.ts`, `maya/core/dom/unmount-observer.ts` |
| Types and validation | `maya/index.types.ts`, `maya/utils/type-checkers.ts`, `maya/utils/constants.ts` |
| Sanitization | `maya/utils/sanitizers.ts`, `maya/utils/decoders.ts` |
| Async toolkit | `maya/toolkit/query.ts` |
| CLI entry | `brahma/src/index.ts`, `brahma/src/commands/**` |
| Build pipeline | `brahma/src/builder/build.ts`, `build-helpers.ts`, `build-setup.ts` |
| Scaffolding/config | `brahma/src/probes/karma/karma.ts`, `karma-types.ts`, `brahma/src/probes/apps/**` |
| Package metadata | `maya/package.json`, `brahma/package.json` |

---

# Architecture Vs Implementation

| Subsystem | Intended Architecture | Current Implementation | Alignment Status | Notes |
| --- | --- | --- | --- | --- |
| Vision | Middle ground between plain web and heavy modern frameworks | Runtime and CLI are small, browser-oriented, and static-output-oriented | Aligned | README remains minimal |
| MPA-first model | Pages are first-class; interactivity layers onto pages | File-system pages build to static HTML and JS | Aligned | No SPA router present |
| Static deployment | Apps run from static hosts/CDNs/object storage | `brahma publish` outputs `prod/**`; ext mode zips output | Aligned | Upload/deploy is external |
| Build phase | Process source, prepare assets, generate pages | Bun bundles, JSDOM executes page to HTML | Aligned | Build-time browser globals can fail, and code warns about `onmount` |
| Mount phase | Initialize page/components/state/events/reactive graph | Generated `mountAndRun` resets IDs and calls page function | Mostly aligned | Relies on deterministic element creation |
| Run phase | User interaction and reactive DOM synchronization | Signal effects update only in `run` phase | Aligned | Phase guard is explicit |
| Direct DOM rendering | Avoid VDOM and full tree diffing | `createElement`, `querySelector`, `setAttribute`, `replaceChild` | Aligned | Child updates are direct/index-based |
| Signals | Foundational reactive primitive | Uses external `@cyftech/signal` | Aligned | External dependency source not reviewed |
| Effects | Dependency-driven update propagation | Attribute and child effects attached to elements | Aligned | Disposal is connected to unmount listener |
| Components | Plain functions returning UI | `component` normalizes props and returns element getters | Aligned | Prop behavior needs user documentation |
| Conditional rendering | Declarative conditionals | `m.If` returns branch child or derived branch | Aligned | Hidden span fallback is current behavior |
| List rendering | Efficient repeated UI | `m.For` supports simple and keyed mutable list rendering | Aligned | Keyed mode requires object item and key |
| Events | Native browser event handling | Uses `addEventListener`; supports `onmount`/`onunmount` | Aligned | No synthetic event layer |
| Forms | Native forms enhanced by signals | Native form/input tags plus events and value prop | Partial | No dedicated form toolkit |
| Routing | MPA-first routing | `page.ts` and `*.page.ts` conventions | Aligned | Clean URL behavior depends on host/server |
| Async operations | Browser-side async with signals | `query` helper wraps fetch state | Partial | Minimal cache and retry behavior |
| Persistence | Browser-native storage/KVDB ecosystem | No persistence module in repo | Gap | Architecture mentions KVDB externally |
| Offline support | PWA/offline capability | PWA probe exists; service worker is a log statement | Gap | Offline caching strategy not implemented |
| PWA features | Manifest and service worker should support install/offline | Manifest generation and SW registration exist | Partial | Starter-level only |
| Security | Browser alignment with safety | `href` and `style` sanitization | Partial | No broad attribute/content sanitization |
| Large project structure | Structured apps with page ownership | Probes show source-only `@` dirs, feature folders, assets | Aligned | More conventions could be documented |

---

# Discrepancies And Risks

## Missing Authoritative File At Start

`ARCHITECTURE.md` was absent before this task. The only architecture draft present was `ARCHITECTURE_v0.md`, which was untracked according to `git status --short`.

Impact: the task referred to an authoritative file that did not exist in the working tree. The enhanced `ARCHITECTURE.md` now establishes that file without modifying v0.

## Offline Support Is Architectural, Not Complete

The architecture says Maya is designed with PWA/offline-first thinking. The implementation contains a PWA probe, manifest, icons, and service worker registration, but `sw.ts` currently only logs `"service-worker"`.

Impact: contributors should not claim complete offline behavior yet.

## Persistence Is External Or Future

The architecture mentions KVDB as part of the broader ecosystem. This repository does not include KVDB integration or a persistence API.

Impact: persistence examples should be framed as browser-native patterns or future ecosystem integration.

## Build/Mount Matching Depends On Determinism

The build and mount phases both reset `idGen` and recreate the page tree so `data-elem-id` can be matched. Conditional browser-only logic during build can break this if it changes the tree.

Impact: contributors should keep tree shape deterministic between build and mount, and use `onmount` for browser-only side effects.

## Sanitization Is Narrow

The runtime blocks dangerous patterns in `href` and `style`, but most attributes are passed through.

Impact: security claims should be scoped. A fuller threat model is needed before broader security guarantees.

---

# Validation Notes By Area

## Runtime

The runtime aligns strongly with the architecture. It exports element creation and components, uses browser DOM APIs, tracks effects on DOM nodes, and has no Virtual DOM layer.

Key files:

- `maya/core/dom/create-element.ts`
- `maya/core/elements/m.ts`
- `maya/core/component.ts`

## Build Toolchain

Brahma aligns with the architecture by producing static output and owning scaffolding/staging/publishing. It is convention-driven and uses Karma configuration to define source/output names.

Key files:

- `brahma/src/builder/build.ts`
- `brahma/src/builder/build-helpers.ts`
- `brahma/src/probes/karma/karma.ts`

## Examples

The web probe demonstrates:

- `m.Html`, `m.Head`, `m.Body`
- static script inclusion
- signal state
- `m.Switch`
- native event handlers
- file-based navigation

The PWA probe demonstrates:

- manifest generation
- service worker registration
- starter assets

The extension probe demonstrates:

- build mode support beyond ordinary web apps
- production zip behavior for extension mode

---

# Recommendations For Future Work

These recommendations preserve the current architecture rather than replacing it:

| Priority | Area | Recommendation |
| --- | --- | --- |
| High | Documentation | Keep `ARCHITECTURE.md` as source of truth and update `ARCHITECTURE_REVIEW.md` when implementation diverges |
| High | Offline | Add a documented service worker caching strategy when the intended offline model is decided |
| High | Tests | Add tests for build/mount/run phase behavior, element ID matching, signal attribute updates, signal children, and keyed `For` rendering |
| Medium | Persistence | Document official KVDB/browser storage integration path |
| Medium | Forms | Add examples or a light helper for common signal-backed forms if repetition becomes significant |
| Medium | Security | Define attribute/content sanitization scope and threat model |
| Low | README | Point README readers to `ARCHITECTURE.md` |

---

# Review Conclusion

The implementation substantially validates the architecture's core claims: Maya is MPA-first, statically deployable, signal-driven, close to browser APIs, and avoids Virtual DOM rendering. The largest gaps are around the broader ecosystem claims of persistence and offline capability, which are directionally represented but not fully implemented in this repository.
