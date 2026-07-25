# Maya HTML Canvas Game Coding Profile

**Status:** normative domain profile

**Read with:** [`MAYA_APP_CODING_SPEC.md`](./MAYA_APP_CODING_SPEC.md)

**Also read:** [`MAYA_UI_CODING_SPEC.md`](./MAYA_UI_CODING_SPEC.md) for menus,
HUD, settings, forms, and other DOM interface

This profile is for real-time games whose playfield is rendered into
`m.Canvas(...)`. Maya owns the document, route, canvas element, lifecycle, and
DOM interface. A plain TypeScript game session owns the simulation, input
state, animation loop, and canvas drawing.

Canvas is an imperative rendering surface. Do not force thousands of
per-frame objects through Maya components or signals. Equally, do not abandon
Maya's deterministic build/mount contract just because the pixels are
imperative.

---

## 1. Game operating contract

A Maya canvas game MUST:

1. default-export a deterministic complete Maya HTML page;
2. create the canvas with `m.Canvas(...)`;
3. obtain its rendering context only after `onmount`;
4. keep simulation/rendering in ordinary TypeScript, not Maya components;
5. use one owned animation loop and cancel it on teardown;
6. use elapsed time, preferably with a fixed simulation step;
7. cap long frame gaps so backgrounding cannot cause a simulation explosion;
8. separate CSS display size from canvas backing-store size;
9. account for device pixel ratio and responsive resizing;
10. normalize keyboard, pointer, touch, and controller input into game actions;
11. pause or safely suspend on visibility/focus loss;
12. unlock audio only from a user gesture;
13. keep menus, instructions, settings, and important status accessible in DOM;
14. preload assets, expose loading/error state, and never begin from a
    half-loaded implicit state;
15. test deterministic game logic separately from browser rendering;
16. verify gameplay in a real browser at multiple sizes and input modes.

---

## 2. Recommended architecture

### 2.1 Ownership boundaries

```text
Maya route
├── document metadata and route script
├── DOM shell, instructions, menus, HUD, fallback
└── Canvas component
    └── mounted GameSession
        ├── input snapshot
        ├── simulation state
        ├── fixed-step update
        ├── renderer
        ├── asset/audio handles
        └── dispose()
```

The boundaries are deliberate:

- **Maya component:** creates UI and binds setup/teardown to DOM lifetime.
- **Game session:** imperative browser integration owned by one canvas.
- **Game core:** deterministic state transitions and rules.
- **Renderer:** draws a read-only view of state.
- **DOM UI:** accessible menus, score, status, help, and settings.

Do not put `requestAnimationFrame` in a global module initializer. Do not make
each sprite a Maya component. Do not let the renderer mutate simulation state.

### 2.2 Scaffold-friendly game layout

With the repository's current web scaffold,
`appViewDir: "dev/view/pages"` and `ignoreDelimiter: "@"`:

```text
dev/
├── game/
│   ├── core.ts
│   ├── input.ts
│   ├── renderer.ts
│   ├── assets.ts
│   └── session.ts
└── view/
    ├── components/
    │   └── GameCanvas.ts
    ├── elements/
    └── pages/
        ├── assets/
        │   ├── images/
        │   └── audio/
        ├── page.ts
        └── styles.css
```

In this layout `dev/view/pages` is the emitted route tree. The reusable
`GameCanvas` component and the game implementation live inside `appSrcDir`
but outside `appViewDir`, so Brahma bundles them when the page imports them
without scanning or emitting them as standalone route output.

Colocation inside the route tree is also valid for small route-local games:

```text
dev/view/pages/
├── @game/
│   ├── GameCanvas.ts
│   ├── core.ts
│   ├── input.ts
│   ├── renderer.ts
│   ├── assets.ts
│   └── session.ts
├── assets/
│   ├── images/
│   └── audio/
├── page.ts
└── styles.css
```

In the colocated layout, `@game` is private bundled source inside the emitted
route tree: Brahma skips it as direct output, but Bun bundles imports from it
into the page. `assets` is public copied output and MUST NOT use the ignore
prefix.

For PWA and extension scaffolds, Karma is transformed to use
`appViewDir: "dev"` because the current probe apps are simpler and emit
mode-specific files from `dev`. That scaffold detail is not a canvas-game
architecture rule. For larger PWA, extension, or web games, prefer a focused
view root when the project can support it; otherwise use `ignoreDelimiter` for
private modules that must sit inside the configured app-view root.

Tests can live outside `appViewDir` when the project setup supports that, or in
an ignored private directory. Never place tests where Brahma will emit them as
public standalone scripts unless that is intentional.

---

## 3. Canvas as a Maya component

Use a component for the DOM/lifecycle boundary and a plain function for the
session:

```ts
import { component, m } from "@cyftec/maya/core";

type GameCanvasProps = {
  label: string;
  onScore: (score: number) => void;
  onError: (error: Error) => void;
};

type GameSession = {
  dispose: () => void;
};

declare function mountGame(
  canvas: HTMLCanvasElement,
  onScore: (score: number) => void,
): GameSession;

export const GameCanvas = component<GameCanvasProps>(
  ({ label, onScore, onError }) => {
    let session: GameSession | undefined;
    let unmounted = false;

    return m.Canvas({
      class: "game__canvas",
      width: "1280",
      height: "720",
      tabindex: "0",
      "aria-label": label,
      onmount: (node) => {
        if (unmounted) return;
        try {
          session = mountGame(
            node as unknown as HTMLCanvasElement,
            onScore,
          );
        } catch (cause) {
          onError(
            cause instanceof Error
              ? cause
              : new Error("Could not start the game."),
          );
        }
      },
      onunmount: () => {
        unmounted = true;
        session?.dispose();
        session = undefined;
      },
      children:
        "This game needs canvas support. Use the controls below for an accessible alternative.",
    });
  },
);
```

Rules:

- `width` and `height` Maya attributes are strings in the current type model.
- The attributes provide a stable initial backing size and aspect ratio.
- Cast the mounted generic `MayaNode` narrowly to `HTMLCanvasElement`.
- `label` is a normalized prop and can be forwarded to an attribute.
- `onScore` and `onError` are callbacks and are called directly.
- The session owns everything it creates and exposes one idempotent `dispose`.
- The `unmounted` guard handles Maya's deferred mount callback.
- Canvas fallback children are useful but are not a complete accessible
  equivalent for a complex game.

For a decorative, noninteractive canvas, omit `tabindex` and use the correct
decorative accessibility treatment. A playable canvas needs a visible focus
style and an explicit interaction model.

### 3.1 Route shell with DOM status

The route remains a complete Maya document. Keep instructions and important
status outside the bitmap:

```ts
import { m } from "@cyftec/maya/core";
import { signal, tmpl } from "@cyftec/maya/signal";
import { GameCanvas } from "../components/GameCanvas.js";

const score = signal(0);
const error = signal("");

export default m.Html({
  lang: "en",
  children: [
    m.Head([
      m.Meta({ charset: "UTF-8" }),
      m.Meta({
        name: "viewport",
        content: "width=device-width, initial-scale=1",
      }),
      m.Title("Skyway"),
      m.Link({ rel: "stylesheet", href: "styles.css" }),
    ]),
    m.Body([
      m.Main({
        class: "game",
        children: [
          m.H1("Skyway"),
          m.P({
            id: "game-help",
            children:
              "Focus the playfield. Use Left and Right Arrow to move.",
          }),
          m.Output({
            class: "game__score",
            "aria-label": "Score",
            children: tmpl`Score: ${score}`,
          }),
          m.P({
            class: "game__error",
            role: "alert",
            children: error,
          }),
          m.Div({
            class: "game__frame",
            children: GameCanvas({
              label:
                "Skyway playfield. Use Left and Right Arrow to move.",
              onScore: (nextScore) => {
                if (nextScore !== score.value) score.value = nextScore;
              },
              onError: (cause) => {
                error.value = cause.message;
              },
            }),
          }),
        ],
      }),
      m.Script({ src: "main.js", defer: true }),
    ]),
  ],
});
```

Update DOM-facing signals only when their value changes. If score changes very
rapidly, do not mark it as an always-live announcement; announce milestones or
requested status instead.

---

## 4. Game core design

### 4.1 Deterministic state

Represent core state with serializable domain data:

```ts
export type InputFrame = {
  left: boolean;
  right: boolean;
  jumpPressed: boolean;
};

export type World = {
  tick: number;
  player: {
    x: number;
    y: number;
    vx: number;
    vy: number;
    grounded: boolean;
  };
  score: number;
};

export const updateWorld = (
  world: World,
  input: InputFrame,
  dt: number,
): void => {
  const direction = Number(input.right) - Number(input.left);
  world.player.vx = direction * 180;

  if (input.jumpPressed && world.player.grounded) {
    world.player.vy = -360;
    world.player.grounded = false;
  }

  world.player.vy += 900 * dt;
  world.player.x += world.player.vx * dt;
  world.player.y += world.player.vy * dt;
  world.tick += 1;
};
```

The update function SHOULD:

- accept all external decisions as input;
- use an explicit `dt`;
- avoid DOM, canvas, audio, network, storage, and global clock access;
- avoid allocating avoidable temporary objects in hot paths;
- produce the same result for the same state/input sequence.

Mutable state is appropriate inside a tightly owned real-time loop. Purity at
the boundary means deterministic inputs and results, not mandatory immutable
allocation every tick.

### 4.2 Randomness

Never call `Math.random()` while building the Maya tree. For gameplay,
prefer an injected seeded pseudo-random generator:

```ts
export type RandomSource = {
  next: () => number;
};
```

Store the seed for replay/debugging. All authoritative random decisions should
flow through the injected source; cosmetic-only randomness may use a separate
stream so it cannot change game outcomes.

### 4.3 Units and coordinate systems

Define coordinate spaces explicitly:

- **world units:** authoritative simulation space;
- **camera/view units:** visible world rectangle;
- **canvas CSS pixels:** layout and pointer-event space;
- **backing pixels:** CSS pixels multiplied by device pixel ratio;
- **asset pixels:** source texture/sprite coordinates.

Do not mix `clientX`, backing-store width, and world X in one formula. Put
conversion functions in one module and test them.

---

## 5. Time and the frame loop

### 5.1 Fixed-step simulation

Use one `requestAnimationFrame` loop for one game session:

```ts
const FIXED_STEP = 1 / 60;
const MAX_FRAME_DELTA = 0.25;
const MAX_STEPS_PER_FRAME = 8;

type LoopHooks = {
  update: (dt: number) => void;
  render: (alpha: number) => void;
};

export const startLoop = ({ update, render }: LoopHooks) => {
  let frameId = 0;
  let previousTime: number | undefined;
  let accumulator = 0;
  let paused = false;
  let disposed = false;

  const frame = (now: number) => {
    if (disposed) return;

    if (previousTime === undefined) previousTime = now;
    const elapsed = Math.min(
      (now - previousTime) / 1_000,
      MAX_FRAME_DELTA,
    );
    previousTime = now;

    if (!paused) {
      accumulator += elapsed;
      let steps = 0;

      while (
        accumulator >= FIXED_STEP &&
        steps < MAX_STEPS_PER_FRAME
      ) {
        update(FIXED_STEP);
        accumulator -= FIXED_STEP;
        steps += 1;
      }

      if (steps === MAX_STEPS_PER_FRAME) {
        accumulator = 0;
      }

      render(accumulator / FIXED_STEP);
    }

    frameId = requestAnimationFrame(frame);
  };

  frameId = requestAnimationFrame(frame);

  return {
    setPaused(next: boolean) {
      paused = next;
      previousTime = undefined;
      accumulator = 0;
    },
    dispose() {
      if (disposed) return;
      disposed = true;
      cancelAnimationFrame(frameId);
    },
  };
};
```

Why:

- game speed does not depend on monitor refresh rate;
- long background gaps are capped;
- a maximum catch-up count avoids a spiral of death;
- interpolation `alpha` is available for smooth rendering;
- pause resets timing instead of applying one giant resume step;
- disposal is idempotent.

Variable-step simulation is acceptable for a small non-physical game when
documented and tested, but movement still MUST use elapsed time rather than
“pixels per frame.”

### 5.2 Simulation versus presentation

`update(dt)` advances authoritative state. `render(alpha)` reads state and
draws. Rendering may interpolate between previous/current transforms, but it
must not decide collisions, scoring, spawns, or other authoritative outcomes.

Do not update DOM signals on every animation frame. Publish score, phase,
health, and status only when their semantic value changes.

### 5.3 Pause and visibility

Listen for `visibilitychange`; pause when `document.hidden` is true. Also clear
held input on blur/focus loss so a released key cannot remain stuck.

Choose and document one policy:

- auto-resume when visible;
- remain paused and ask the player to resume;
- continue an explicitly designed background simulation without rendering.

For most games, remaining paused until user intent is safest.

---

## 6. Responsive and high-DPI canvas

CSS size and backing resolution are separate:

```css
.game__frame {
  inline-size: min(100%, 80rem);
  margin-inline: auto;
}

.game__canvas {
  display: block;
  inline-size: 100%;
  aspect-ratio: 16 / 9;
  background: #10131a;
  touch-action: none;
}

.game__canvas:focus-visible {
  outline: 0.1875rem solid #7dd3fc;
  outline-offset: 0.25rem;
}
```

Synchronize the backing store after mount:

```ts
type Viewport = {
  cssWidth: number;
  cssHeight: number;
  dpr: number;
};

export const fitCanvas = (
  canvas: HTMLCanvasElement,
  context: CanvasRenderingContext2D,
  maxDpr = 2,
): Viewport => {
  const rect = canvas.getBoundingClientRect();
  const dpr = Math.min(window.devicePixelRatio || 1, maxDpr);
  const width = Math.max(1, Math.round(rect.width * dpr));
  const height = Math.max(1, Math.round(rect.height * dpr));

  if (canvas.width !== width || canvas.height !== height) {
    canvas.width = width;
    canvas.height = height;
  }

  context.setTransform(dpr, 0, 0, dpr, 0, 0);

  return {
    cssWidth: rect.width,
    cssHeight: rect.height,
    dpr,
  };
};
```

Use a `ResizeObserver` on the canvas or its frame and call `fitCanvas` when its
CSS size changes. Cap DPR deliberately; uncapped DPR can multiply fill cost
and memory on large/high-density screens.

Changing `canvas.width` or `canvas.height` clears the bitmap and resets context
state. Reapply transforms, smoothing mode, text settings, compositing, and
other required context state after a resize.

### 6.1 Stable logical viewport

For a fixed 16:9 world such as 1280 × 720, compute a uniform scale and
letterbox/pillarbox:

```ts
export const getViewTransform = (
  cssWidth: number,
  cssHeight: number,
  worldWidth: number,
  worldHeight: number,
) => {
  const scale = Math.min(
    cssWidth / worldWidth,
    cssHeight / worldHeight,
  );

  return {
    scale,
    offsetX: (cssWidth - worldWidth * scale) / 2,
    offsetY: (cssHeight - worldHeight * scale) / 2,
  };
};
```

At render time:

1. set the DPR transform;
2. clear in CSS-pixel space;
3. translate by the view offset;
4. scale by the world scale;
5. draw in stable world units.

Choose a policy for very narrow/tall screens: letterbox, crop with a safe
region, alter the camera, or use a responsive world. Do not accidentally
stretch the world.

---

## 7. Input

### 7.1 Normalize physical input to actions

Game rules should read actions:

```ts
type Actions = {
  moveX: number;
  jumpPressed: boolean;
  pausePressed: boolean;
};
```

An input adapter maps keyboard keys, pointer/touch regions, and gamepad buttons
to those actions. This makes remapping, testing, and alternate input possible.

Distinguish:

- **held:** true while a key/button remains down;
- **pressed:** true for one simulation tick on the transition down;
- **released:** true for one tick on transition up.

Consume edge-triggered flags after the simulation tick, not after every render
frame.

### 7.2 Keyboard

Make the canvas focusable and listen on the canvas when practical:

```ts
const held = new Set<string>();
const listeners = new AbortController();
const options = { signal: listeners.signal };

canvas.addEventListener("keydown", (event) => {
  if (["ArrowLeft", "ArrowRight", "Space"].includes(event.code)) {
    event.preventDefault();
    held.add(event.code);
  }
}, options);

canvas.addEventListener("keyup", (event) => {
  held.delete(event.code);
}, options);

canvas.addEventListener("blur", () => {
  held.clear();
}, options);
```

Use `event.code` for physical gameplay positions and `event.key` for
text/meaningful character commands. Prevent defaults only for keys the active
game owns. Never block browser shortcuts wholesale.

If listeners are on `window`, enable them only while gameplay is active and
remove them on teardown. Provide DOM buttons for essential actions where
appropriate.

### 7.3 Pointer and touch

Use Pointer Events as the common mouse/pen/touch path. On pointer down:

- focus the canvas;
- call `setPointerCapture(event.pointerId)` for a drag;
- track by pointer ID for multitouch;
- release capture on up/cancel/teardown;
- handle `pointercancel`;
- use `touch-action: none` only on the actual game surface.

Convert pointer coordinates from CSS pixels to world coordinates:

```ts
const pointerToWorld = (
  event: PointerEvent,
  canvas: HTMLCanvasElement,
  scale: number,
  offsetX: number,
  offsetY: number,
) => {
  const rect = canvas.getBoundingClientRect();
  return {
    x: (event.clientX - rect.left - offsetX) / scale,
    y: (event.clientY - rect.top - offsetY) / scale,
  };
};
```

Do not multiply `clientX` by DPR when the view transform is defined in CSS
pixels. DPR belongs to backing-store drawing, not event coordinates.

### 7.4 Gamepad

Poll `navigator.getGamepads()` once per simulation/frame boundary; gamepad
state does not use ordinary DOM events for all changes. Apply dead zones to
axes, normalize actions, and detect pressed edges from the previous snapshot.
Controller support must not be the only way to start or recover from a game.

---

## 8. Rendering

### 8.1 Context creation

Create and validate the context after mount:

```ts
const context = canvas.getContext("2d", {
  alpha: false,
});

if (!context) {
  throw new Error("Canvas 2D rendering is unavailable.");
}
```

Choose 2D, WebGL, or another context deliberately. This profile's examples use
2D canvas. For WebGL, the same Maya lifecycle applies, plus shader/resource
cleanup and context-loss recovery.

### 8.2 Frame rendering

A renderer SHOULD:

- clear or fully cover the intended buffer every frame;
- apply camera transforms once per layer/group;
- balance every `save()` with `restore()`;
- batch by texture/style where beneficial;
- avoid DOM reads inside sprite loops;
- avoid per-frame image decoding, gradient creation, and text measurement when
  cacheable;
- draw from loaded handles, not asset URLs;
- render in a documented layer order;
- handle resize/context reset.

Use `imageSmoothingEnabled = false` for intentionally pixelated scaled art;
use the default smoothing for ordinary illustration. Align pixel art to its
logical grid to avoid shimmering.

### 8.3 DOM HUD versus canvas HUD

Use DOM for:

- headings and instructions;
- menus and settings;
- pause/game-over dialogs;
- important status and accessible score;
- controls that must be keyboard/screen-reader operable;
- long or localized text.

Use canvas for tightly integrated visual presentation. A canvas-drawn score
can coexist with a visually hidden or visible DOM `output` updated only when
the score changes.

Do not duplicate rapid announcements into an `aria-live` region. Announce
meaningful milestones, game state changes, and user-requested status.

---

## 9. Assets and loading

### 9.1 Asset manifest

Centralize public URLs:

```ts
export const ASSETS = {
  player: "assets/images/player.webp",
  tiles: "assets/images/tiles.webp",
  jump: "assets/audio/jump.ogg",
} as const;
```

Paths are relative to generated route output. A nested route needs adjusted or
root-relative URLs. Verify direct route loading.

### 9.2 Preloading

Preload before entering playable state:

- images via `Image.decode()` or load/error events;
- audio via fetch/decode or media load readiness as appropriate;
- fonts via `document.fonts.load()` when canvas text metrics depend on them;
- level data via `fetch` with validation.

Represent `idle`, `loading`, `ready`, and `error` explicitly in DOM UI. Track
loaded count/bytes when useful. A failed required asset must produce a visible
retry or fallback, not a blank canvas.

Start loading from `onmount` or a user event. Abort fetches and ignore late
results after disposal.

### 9.3 Sprite atlases

For atlas rendering, keep metadata typed:

```ts
type SpriteFrame = {
  x: number;
  y: number;
  width: number;
  height: number;
  originX: number;
  originY: number;
};
```

Validate frame bounds at load/test time. Keep animation timing in seconds or
ticks, not assumptions about display frames.

---

## 10. Audio

Browsers generally require a user gesture before audible playback or resuming
an `AudioContext`.

Requirements:

- create/resume audio from a Start/Play gesture;
- expose mute and volume controls;
- preserve user choice when storage is allowed;
- separate music and effects gain where practical;
- do not create a new audio element/context for every effect;
- cap or pool repeated simultaneous effects;
- stop/disconnect owned nodes on teardown;
- handle rejected playback promises;
- do not make sound the only cue for required information.

Page visibility policy should cover audio: suspend/mute while hidden unless the
product explicitly requires background audio and the platform permits it.

---

## 11. Save data, replay, and versioning

Read storage only after mount. Treat it as untrusted input:

```ts
type SaveEnvelope = {
  version: 1;
  bestScore: number;
  settings: {
    muted: boolean;
  };
};
```

Validate shape, ranges, and version before use. Provide migrations or discard
incompatible data safely. Storage failure/private mode must not prevent play.

For deterministic replay/debugging, record:

- game version;
- initial seed;
- fixed step;
- input transitions by tick;
- level/config version.

Do not store every rendered frame.

---

## 12. Performance and memory

Measure before optimizing, but design hot paths responsibly:

- one animation loop per active game;
- object pools for high-churn particles/projectiles when profiling justifies;
- spatial partitioning for large collision sets;
- no layout reads in inner render loops;
- no signal writes for unchanged values;
- no per-frame JSON serialization or storage;
- reuse vectors/arrays where allocation shows up in profiles;
- cap particles, audio voices, DPR, and catch-up steps;
- remove dead entities in controlled batches;
- release asset/session references when the game is discarded.

Use browser performance tools to check:

- frame-time distribution, not only average FPS;
- long tasks;
- garbage collection spikes;
- GPU/canvas fill cost;
- memory after repeated restart;
- slow-device and high-DPR behavior.

A game that holds 60 FPS on a developer laptop but leaks on each restart is
not complete.

---

## 13. Accessibility and reduced motion

Canvas pixels do not expose a semantic tree. Provide an equivalent interaction
strategy appropriate to the game:

- visible DOM title and concise instructions;
- keyboard controls and remapping where feasible;
- DOM Start, Pause/Resume, Restart, Mute, and Help controls;
- visible focus and no keyboard trap;
- DOM status for phase, score, and important events;
- non-color cues;
- captions/text equivalents for meaningful spoken audio;
- configurable volume;
- large practical touch targets;
- pause when focus/visibility is lost;
- reduced motion mode.

`prefers-reduced-motion` may require:

- disabling screen shake, flashes, parallax, and nonessential particles;
- shortening transitions;
- reducing camera acceleration;
- offering a non-twitch or turn-based accommodation when product scope allows.

Do not default to `role="application"` on the canvas. It changes assistive
technology behavior substantially. Use it only after testing a complete custom
interaction model. A clear label, focus strategy, DOM controls, and documented
instructions are the safer baseline.

For photosensitive safety, avoid rapid high-contrast flashing and test effects
that can cover a substantial portion of the screen.

---

## 14. Complete session skeleton

This is the minimum shape of an owned 2D session. Domain-specific update and
render code can replace the placeholders without changing lifecycle:

```ts
type Session = {
  dispose: () => void;
};

export const mountGame = (
  canvas: HTMLCanvasElement,
  onScore: (score: number) => void,
): Session => {
  const context = canvas.getContext("2d", { alpha: false });
  if (!context) throw new Error("Canvas 2D is unavailable.");

  const abort = new AbortController();
  const held = new Set<string>();
  const resizeObserver = new ResizeObserver(resize);
  let frameId = 0;
  let disposed = false;
  let hidden = document.hidden;
  let previousTime: number | undefined;
  let accumulator = 0;
  let viewport = {
    cssWidth: 1,
    cssHeight: 1,
    dpr: 1,
  };
  const world = {
    playerX: 100,
    score: 0,
  };

  function resize() {
    const rect = canvas.getBoundingClientRect();
    const dpr = Math.min(window.devicePixelRatio || 1, 2);
    const width = Math.max(1, Math.round(rect.width * dpr));
    const height = Math.max(1, Math.round(rect.height * dpr));

    if (canvas.width !== width || canvas.height !== height) {
      canvas.width = width;
      canvas.height = height;
    }

    viewport = {
      cssWidth: rect.width,
      cssHeight: rect.height,
      dpr,
    };
  }

  function update(dt: number) {
    const direction =
      Number(held.has("ArrowRight")) -
      Number(held.has("ArrowLeft"));
    world.playerX += direction * 180 * dt;
  }

  function render() {
    context.setTransform(
      viewport.dpr,
      0,
      0,
      viewport.dpr,
      0,
      0,
    );
    context.fillStyle = "#10131a";
    context.fillRect(
      0,
      0,
      viewport.cssWidth,
      viewport.cssHeight,
    );
    context.fillStyle = "#7dd3fc";
    context.fillRect(world.playerX, 100, 32, 32);
  }

  function frame(now: number) {
    if (disposed) return;

    if (previousTime === undefined) previousTime = now;
    const elapsed = Math.min((now - previousTime) / 1_000, 0.25);
    previousTime = now;

    if (!hidden) {
      accumulator += elapsed;
      let steps = 0;

      while (accumulator >= 1 / 60 && steps < 8) {
        update(1 / 60);
        accumulator -= 1 / 60;
        steps += 1;
      }

      if (steps === 8) accumulator = 0;
      render();
    }

    frameId = requestAnimationFrame(frame);
  }

  canvas.addEventListener("keydown", (event) => {
    if (event.code === "ArrowLeft" || event.code === "ArrowRight") {
      event.preventDefault();
      held.add(event.code);
    }
  }, { signal: abort.signal });

  canvas.addEventListener("keyup", (event) => {
    held.delete(event.code);
  }, { signal: abort.signal });

  canvas.addEventListener("blur", () => {
    held.clear();
  }, { signal: abort.signal });

  canvas.addEventListener("pointerdown", () => {
    canvas.focus();
  }, { signal: abort.signal });

  document.addEventListener("visibilitychange", () => {
    hidden = document.hidden;
    held.clear();
    previousTime = undefined;
    accumulator = 0;
  }, { signal: abort.signal });

  resizeObserver.observe(canvas);
  resize();
  onScore(world.score);
  frameId = requestAnimationFrame(frame);

  return {
    dispose() {
      if (disposed) return;
      disposed = true;
      cancelAnimationFrame(frameId);
      abort.abort();
      resizeObserver.disconnect();
      held.clear();
    },
  };
};
```

Production additions normally include an explicit ready/start/pause state,
asset preload, pointer/controller adapters, resize-aware world transform,
audio owner, error reporting, and testable domain modules.

---

## 15. Testing protocol

### 15.1 Unit tests

Test plain TypeScript without a canvas:

- same seed + inputs produces same state;
- movement is stable across the fixed step;
- collisions at edges/corners and high velocity;
- pressed/held/released transitions;
- score/lives/state-machine transitions;
- spawn/despawn and object-pool reuse;
- coordinate transforms and letterboxing;
- save parsing and migration;
- replay determinism.

Avoid snapshotting huge world objects when targeted assertions explain the
contract better.

### 15.2 Session tests

With controlled browser mocks:

- no context produces a visible/handled failure;
- only one frame is scheduled;
- long deltas are capped;
- pause resets timing;
- resize updates backing dimensions and context state;
- listeners/observer/frame are removed by `dispose`;
- repeated `dispose` is safe;
- late asset completion cannot mutate a disposed session.

### 15.3 Real-browser gameplay

Verify:

- generated route mounts with no console error;
- canvas is crisp at DPR 1 and high DPR;
- CSS resizing and orientation changes preserve coordinates/aspect policy;
- keyboard focus is visible and keys do not scroll the page while owned;
- key state clears on blur;
- pointer mapping is correct after resize;
- touch uses no accidental page gestures inside the playfield;
- pause/hidden/resume behavior is correct;
- Start unlocks audio and mute/volume work;
- reduced-motion mode changes the intended effects;
- loading failure and retry work;
- restart does not create a second loop or leak listeners/audio;
- performance remains acceptable during worst-case gameplay.

Use browser automation for repeatable smoke paths, but also play manually.
Timing, feel, audio, focus, and touch defects are not fully covered by JSDOM.

---

## 16. Game failure catalogue

### Canvas is blank in generated HTML

That is expected before mount if all pixels are drawn by browser code. The DOM
must still expose loading/fallback/status, and the route script must mount.

### Build crashes on `getContext`, `Image`, `Audio`, or `devicePixelRatio`

Browser work ran during tree construction. Create the session in `onmount`.

### Game runs twice or speeds up after restart

Multiple animation loops survived. Keep one frame ID per session, make
`dispose` idempotent, and dispose before replacing the session.

### Movement is faster on high-refresh displays

Movement is expressed per frame. Multiply by elapsed seconds and preferably
use a fixed update step.

### The player teleports after returning to the tab

The loop applied a huge hidden-tab delta. Cap deltas, pause on visibility
loss, and reset previous time/accumulator.

### Canvas looks blurry

Only CSS dimensions were set. Resize the backing store using DPR, then restore
the context transform/state.

### Pointer hits are offset

Coordinates mixed page, CSS, backing, camera, or world spaces. Convert from
`clientX/Y` through the canvas rect and view transform; do not blindly apply
DPR.

### Arrow/space keys scroll the page

The focused game did not prevent default for the specific owned keys, or the
canvas is not focusable/focused.

### A key remains held after switching tabs

Clear input on blur and visibility change.

### Audio works only after several clicks or logs a rejected promise

Create/resume playback directly inside a trusted Start/Play gesture and handle
the playback promise.

### FPS degrades over time

Profile allocation, retained sessions/listeners, uncapped particles, audio
voices, DPR, and repeated asset/context creation.

### Screen reader users receive no game state

Important information exists only as pixels. Add DOM instructions, controls,
phase/score/status, and an appropriate alternative interaction strategy.

---

## 17. Canvas-game checklist

- [ ] Shared Maya application specification also followed.
- [ ] UI profile followed for DOM menus/HUD/settings.
- [ ] Game engine/source modules live outside emitted route output, or under an
      ignored route-local directory by deliberate choice.
- [ ] Canvas/context creation happens after mount.
- [ ] One plain `GameSession` owns loop, input, observers, assets, and audio.
- [ ] `dispose()` is complete and idempotent.
- [ ] Core update logic is deterministic and DOM-free.
- [ ] Randomness is seeded/injected where outcomes matter.
- [ ] Simulation uses elapsed time and capped fixed-step catch-up.
- [ ] Render does not mutate authoritative game state.
- [ ] CSS size, backing size, DPR, and world transforms are explicit.
- [ ] Pointer coordinates are converted through named coordinate spaces.
- [ ] Keyboard held/pressed/released state and blur clearing are correct.
- [ ] Pointer cancel/capture and touch behavior are handled.
- [ ] Visibility pause/resume policy is implemented.
- [ ] Audio begins from user gesture and has mute/volume controls.
- [ ] Asset loading, failure, retry, and disposal are explicit.
- [ ] Important UI/state is available outside canvas pixels.
- [ ] Reduced motion and flashing safety were considered.
- [ ] Unit, lifecycle, resize, teardown, and browser gameplay tests pass.
- [ ] Repeated restart creates no extra loop, listener, observer, or audio owner.
