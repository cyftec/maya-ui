import { afterEach, describe, expect, mock, spyOn, test } from "bun:test";
import { EventEmitter } from "node:events";
import { exists, rm } from "node:fs/promises";
import path from "node:path";
import { stageApp } from "../src/commands/stage.ts";
import { execCli } from "../src/index.ts";
import { runShellCommand } from "../src/utils/command-runner.ts";
import { watchFileChange } from "../src/utils/file-change-watcher.ts";
import { runLocalServer } from "../src/utils/local-server.ts";
import { ProcessExit, makeKarma, makeTempDir, writeText } from "./fixtures.ts";

const roots: string[] = [];
const delay = (milliseconds: number) =>
  new Promise((resolve) => setTimeout(resolve, milliseconds));

afterEach(async () => {
  for (const root of roots.splice(0)) {
    if (await exists(root)) await rm(root, { recursive: true });
  }
});

describe("stage lifecycle", () => {
  test("builds, watches, rebuilds after debounce, serves, and quits on stdin", async () => {
    const root = await makeTempDir();
    roots.push(root);
    const karma = makeKarma();
    let onChange: ((path: string) => void) | undefined;
    let onQuit: (() => void) | undefined;
    const build = mock(async () => {});
    const serve = mock(() => {});
    const exit = mock(() => undefined) as unknown as typeof process.exit;
    const log = spyOn(console, "log").mockImplementation(() => {});

    await stageApp({
      getCWD: () => root,
      getKarma: async () => karma,
      buildApp: build as never,
      watchFileChange: ((watchPath: string, ignored: unknown, callback: (path: string) => void) => {
        expect(watchPath).toBe(path.join(root, "dev"));
        expect(ignored).toEqual([expect.any(RegExp)]);
        onChange = callback;
        return {};
      }) as never,
      runLocalServer: serve as never,
      startStdinListener: (async (callback: () => void) => {
        onQuit = callback;
      }) as never,
      exit,
    });

    expect(build).toHaveBeenCalledTimes(1);
    expect(build).toHaveBeenCalledWith(root, karma, false);
    expect(serve).toHaveBeenCalledWith(0, path.join(root, "stage"), false);
    await delay(0);
    expect(onQuit).toBeDefined();

    onChange?.("dev/page.ts");
    await delay(550);
    expect(build).toHaveBeenCalledTimes(2);
    expect(log.mock.calls.flat().join("\n")).toContain(
      "Change detected: dev/page.ts",
    );
    onQuit?.();
    expect(exit).toHaveBeenCalledTimes(1);
    log.mockRestore();
  });

  test("returns false when no karma configuration is available", async () => {
    const log = spyOn(console, "log").mockImplementation(() => {});
    const result = await stageApp({
      getCWD: () => "/tmp/no-app",
      getKarma: (async () => undefined) as never,
      buildApp: mock(async () => {}) as never,
      watchFileChange: mock(() => ({})) as never,
      runLocalServer: mock(() => {}) as never,
      startStdinListener: mock(async () => {}) as never,
      exit: mock(() => undefined) as never,
    });
    expect(result).toBe(false);
    log.mockRestore();
  });
});

describe("watcher, server, shell, and entrypoint lifecycle", () => {
  test("observes real file changes and returns a closable watcher", async () => {
    const root = await makeTempDir();
    roots.push(root);
    const watchedFile = path.join(root, "watched.txt");
    await writeText(watchedFile, "before");
    const processEvents = new EventEmitter();
    const processExit = mock(() => undefined) as unknown as NodeJS.Process["exit"];
    let watcher: ReturnType<typeof watchFileChange>;
    const changed = new Promise<string>((resolve) => {
      watcher = watchFileChange(root, undefined, (changedPath) => {
        resolve(changedPath);
      }, {
        on: processEvents.on.bind(processEvents) as NodeJS.Process["on"],
        exit: processExit,
      });
      watcher.once("ready", async () => {
        await Bun.write(watchedFile, "after");
      });
    });
    await expect(changed).resolves.toBe(watchedFile);
    processEvents.emit("exit");
    await watcher!.close();
  }, 5_000);

  test("configures and closes an injected local server", () => {
    const events = new EventEmitter();
    const init = mock(() => undefined);
    const serverExit = mock(() => undefined);
    const processExit = mock(() => undefined) as unknown as NodeJS.Process["exit"];
    const log = spyOn(console, "log").mockImplementation(() => {});
    runLocalServer(
      4321,
      "/tmp/site",
      true,
      { init: init as never, exit: serverExit },
      {
        on: events.on.bind(events) as NodeJS.Process["on"],
        exit: processExit,
      },
    );
    expect(init).toHaveBeenCalledWith({
      port: 4321,
      server: "/tmp/site",
      open: true,
      ui: false,
      logLevel: "silent",
    });
    events.emit("exit");
    expect(serverExit).toHaveBeenCalledTimes(1);
    events.emit("SIGINT");
    expect(processExit).toHaveBeenCalledTimes(1);
    log.mockRestore();
  });

  test("runs a shell command in the requested working directory", async () => {
    const root = await makeTempDir();
    roots.push(root);
    await expect(runShellCommand("true", root)).resolves.toBeUndefined();
  });

  test("executes help, version, and invalid entrypoint routes without importing side effects", async () => {
    const log = spyOn(console, "log").mockImplementation(() => {});
    const exit = spyOn(process, "exit").mockImplementation(
      ((code?: number | string | null): never => {
        throw new ProcessExit(Number(code || 0));
      }) as typeof process.exit,
    );
    await expect(execCli(["bun", "brahma", "help"])).rejects.toMatchObject({
      code: 0,
    });
    await expect(execCli(["bun", "brahma", "version"])).rejects.toMatchObject({
      code: 0,
    });
    await expect(execCli(["bun", "brahma", "unknown"])).rejects.toMatchObject({
      code: 0,
    });
    expect(log.mock.calls.flat().join("\n")).toContain("ERROR: bad input");
    exit.mockRestore();
    log.mockRestore();
  });
});
