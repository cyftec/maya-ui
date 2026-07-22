import {
  afterEach,
  beforeEach,
  describe,
  expect,
  spyOn,
  test,
} from "bun:test";
import { exists, mkdir, rm } from "node:fs/promises";
import path from "node:path";
import {
  createApp,
  createAppRootDir,
  getCreateAppCommandArgs,
} from "../src/commands/create.ts";
import { showHelp } from "../src/commands/help.ts";
import { installPackageOrEverything } from "../src/commands/install.ts";
import { getResetMode, resetApp } from "../src/commands/reset.ts";
import {
  removeInstalledFiles,
  uninstallPackageOrEverything,
} from "../src/commands/uninstall.ts";
import { showVersion, showVersionOnly } from "../src/commands/version.ts";
import { execCli } from "../src/index.ts";
import type { CommandRunner } from "../src/utils/command-runner.ts";
import {
  ProcessExit,
  karmaModuleText,
  makeKarma,
  makeTempDir,
  writeText,
} from "./fixtures.ts";

const originalDevMode = process.env.MAYA_DEV_MODE;
const originalInitCwd = process.env.INIT_CWD;
let root = "";
let commands: Array<{ command: string; cwd?: string }> = [];
const runCommand: CommandRunner = async (command, cwd) => {
  commands.push({ command, cwd });
};

const expectProcessExit = async (
  operation: () => unknown | Promise<unknown>,
  expectedCode = 0,
) => {
  const exit = spyOn(process, "exit").mockImplementation(
    ((code?: number | string | null): never => {
      throw new ProcessExit(Number(code || 0));
    }) as typeof process.exit,
  );
  try {
    await operation();
    throw new Error("Expected process.exit");
  } catch (error) {
    expect(error).toBeInstanceOf(ProcessExit);
    expect((error as ProcessExit).code).toBe(expectedCode);
  } finally {
    exit.mockRestore();
  }
};

beforeEach(async () => {
  root = await makeTempDir();
  commands = [];
  process.env.MAYA_DEV_MODE = "1";
  process.env.INIT_CWD = root;
});

afterEach(async () => {
  if (await exists(root)) await rm(root, { recursive: true });
  if (originalDevMode === undefined) delete process.env.MAYA_DEV_MODE;
  else process.env.MAYA_DEV_MODE = originalDevMode;
  if (originalInitCwd === undefined) delete process.env.INIT_CWD;
  else process.env.INIT_CWD = originalInitCwd;
});

describe("help and create commands", () => {
  test("prints the complete help and exits successfully", async () => {
    const log = spyOn(console, "log").mockImplementation(() => {});
    await expectProcessExit(() => showHelp());
    expect(log.mock.calls.flat().join("\n")).toContain(
      "Usage: brahma <COMMAND>",
    );
    expect(log.mock.calls.flat().join("\n")).toContain("brahma reset --hard");
    log.mockRestore();
  });

  test("parses create arguments in either order and rejects malformed input", () => {
    expect(getCreateAppCommandArgs(["my-app"])).toEqual(["my-app"]);
    expect(getCreateAppCommandArgs(["my-app", "--ext"])).toEqual([
      "my-app",
      "ext",
    ]);
    expect(getCreateAppCommandArgs(["--pwa", "my-app"])).toEqual([
      "my-app",
      "pwa",
    ]);
    expect(() => getCreateAppCommandArgs([])).toThrow("Max 2 args");
    expect(() => getCreateAppCommandArgs(["a", "b", "c"])).toThrow(
      "Max 2 args",
    );
    expect(() => getCreateAppCommandArgs(["a", "b"])).toThrow("Bad input");
    expect(() => getCreateAppCommandArgs(["--ext", "--pwa"])).toThrow(
      "Bad input",
    );
    expect(() => getCreateAppCommandArgs(["app", "--mobile"])).toThrow(
      "Incorrect app mode",
    );
    expect(() => getCreateAppCommandArgs(["--ext"])).toThrow(
      "Incorrect app directory",
    );
  });

  test("creates the computed absolute target and invokes the scaffold CLI", async () => {
    const log = spyOn(console, "log").mockImplementation(() => {});
    await expectProcessExit(() =>
      createApp(["nested-app", "--pwa"], runCommand),
    );
    expect(await exists(path.join(root, "nested-app"))).toBe(true);
    expect(commands).toContainEqual({
      command: `sample-maya app pwa ${path.join(root, "nested-app")}`,
      cwd: root,
    });
    log.mockRestore();
  });

  test("exits when the requested app directory already exists", async () => {
    const existing = path.join(root, "existing");
    await mkdir(existing);
    const log = spyOn(console, "log").mockImplementation(() => {});
    await expectProcessExit(() => createAppRootDir(existing), 1);
    expect(log.mock.calls.flat().join(" ")).toContain("already exists");
    log.mockRestore();
  });
});

describe("version and reset commands", () => {
  test("shows Brahma and Maya versions inside and outside an app", async () => {
    const log = spyOn(console, "log").mockImplementation(() => {});
    await showVersionOnly();
    expect(log.mock.calls.flat().join("\n")).toContain(
      "maya   - (Not a Maya app directory)",
    );

    const karma = makeKarma();
    karma.maya.dependencies["@cyftec/maya"] = "9.8.7";
    await writeText(path.join(root, "karma.ts"), karmaModuleText(karma));
    await showVersionOnly();
    expect(log.mock.calls.flat().join("\n")).toContain("maya   - 9.8.7");
    log.mockRestore();
  });

  test("shows a version through the command and shifts versions with fake bun", async () => {
    const log = spyOn(console, "log").mockImplementation(() => {});
    await expectProcessExit(() => showVersion([]));
    await expectProcessExit(() => showVersion(["--v=1.2.3"], runCommand));
    expect(commands).toContainEqual({
      command: "bun add -g @cyftec/brahma@1.2.3",
      cwd: undefined,
    });
    expect(log.mock.calls.flat().join("\n")).toContain(
      "Shifting to '@cyftec/brahma@1.2.3'",
    );
    log.mockRestore();
  });

  test("rejects malformed version and reset specifiers", async () => {
    const log = spyOn(console, "log").mockImplementation(() => {});
    await expectProcessExit(() => showVersion(["latest"]), 1);
    expect(getResetMode([])).toBe("soft");
    expect(getResetMode(["--hard"])).toBe("hard");
    await expectProcessExit(() => getResetMode(["hard"]), 1);
    await expectProcessExit(() => getResetMode(["--unknown"]), 1);
    log.mockRestore();
  });

  test("soft reset preserves app mode and hard reset returns to web", async () => {
    const karma = makeKarma({ appType: "ext" });
    const karmaPath = path.join(root, "karma.ts");
    const typesPath = path.join(root, "karma-types.ts");
    await writeText(karmaPath, karmaModuleText(karma));
    await writeText(typesPath, "export {};");
    await expectProcessExit(() => resetApp(["--soft"], runCommand));
    expect(await exists(karmaPath)).toBe(false);
    expect(await exists(typesPath)).toBe(false);
    expect(commands).toContainEqual({
      command: `sample-maya karma ext ${root}`,
      cwd: root,
    });

    commands = [];
    await writeText(karmaPath, karmaModuleText(karma));
    await expectProcessExit(() => resetApp(["--hard"], runCommand));
    expect(commands).toContainEqual({
      command: `sample-maya karma web ${root}`,
      cwd: root,
    });
  });
});

describe("install and uninstall commands", () => {
  test("installs all generated config and packages after removing disposable files", async () => {
    const karma = makeKarma();
    await writeText(path.join(root, "stage/old.txt"), "old");
    await writeText(path.join(root, "package.json"), '{"old":true}');
    const log = spyOn(console, "log").mockImplementation(() => {});
    await expectProcessExit(() =>
      installPackageOrEverything([], karma, runCommand),
    );
    expect(await exists(path.join(root, "stage"))).toBe(false);
    expect(await Bun.file(path.join(root, "package.json")).json()).toEqual(
      karma.maya,
    );
    expect(await Bun.file(path.join(root, ".vscode/settings.json")).json())
      .toEqual(karma.vscode.settings);
    expect(await Bun.file(path.join(root, ".gitignore")).text()).toBe(
      karma.git.ignore.join("\n"),
    );
    expect(commands).toContainEqual({ command: "bun i", cwd: root });
    log.mockRestore();
  });

  test("exits when install configuration has no package metadata", async () => {
    const karma = makeKarma();
    const invalidKarma = { ...karma, maya: undefined } as never;
    const log = spyOn(console, "log").mockImplementation(() => {});
    await expectProcessExit(
      () => installPackageOrEverything([], invalidKarma, runCommand),
      1,
    );
    expect(log.mock.calls.flat().join("\n")).toContain(
      "does not contain any property named 'packageJson'",
    );
    log.mockRestore();
  });

  test("installs a specific package and synchronizes package metadata", async () => {
    const karma = makeKarma();
    await writeText(path.join(root, "karma.ts"), karmaModuleText(karma));
    await writeText(
      path.join(root, "package.json"),
      JSON.stringify({ name: "custom", dependencies: { lodash: "4.17.21" } }),
    );
    const log = spyOn(console, "log").mockImplementation(() => {});
    await expectProcessExit(() =>
      installPackageOrEverything(
        ["lodash@4.17.21", "--dev"],
        karma,
        runCommand,
      ),
    );
    expect(commands).toContainEqual({
      command: "bun add lodash@4.17.21 --dev",
      cwd: root,
    });
    expect(await Bun.file(path.join(root, "karma.ts")).text()).toContain(
      '"name":"custom"',
    );
    log.mockRestore();
  });

  test("removes existing disposable files and ignores missing ones", async () => {
    const karma = makeKarma();
    await writeText(path.join(root, "stage/file.txt"), "x");
    await writeText(path.join(root, "package.json"), "{}");
    const log = spyOn(console, "log").mockImplementation(() => {});
    await removeInstalledFiles(root, karma);
    expect(await exists(path.join(root, "stage"))).toBe(false);
    expect(await exists(path.join(root, "package.json"))).toBe(false);
    log.mockRestore();
  });

  test("uninstalls all files or one package and synchronizes karma", async () => {
    const karma = makeKarma();
    await writeText(path.join(root, "stage/file.txt"), "x");
    const log = spyOn(console, "log").mockImplementation(() => {});
    await expectProcessExit(() =>
      uninstallPackageOrEverything([], karma, runCommand),
    );
    expect(await exists(path.join(root, "stage"))).toBe(false);

    await writeText(path.join(root, "karma.ts"), karmaModuleText(karma));
    await writeText(path.join(root, "package.json"), '{"name":"after-remove"}');
    await expectProcessExit(() =>
      uninstallPackageOrEverything(["lodash"], karma, runCommand),
    );
    expect(commands).toContainEqual({
      command: "bun remove lodash",
      cwd: root,
    });
    expect(await Bun.file(path.join(root, "karma.ts")).text()).toContain(
      '"name":"after-remove"',
    );
    log.mockRestore();
  });
});

describe("publish and CLI entrypoint", () => {
  test("publishes the app through the real entrypoint", async () => {
    const karma = makeKarma({ appViewDir: "dev" });
    await writeText(path.join(root, "karma.ts"), karmaModuleText(karma));
    await writeText(path.join(root, "package.json"), "{}");
    const mayaCore = path.resolve(import.meta.dir, "../../maya/src/core/index.ts");
    await writeText(
      path.join(root, "dev/page.ts"),
      `import { m } from ${JSON.stringify(mayaCore)}; export default m.Html(m.Body("Published"));`,
    );
    const log = spyOn(console, "log").mockImplementation(() => {});
    await execCli(["bun", "brahma", "publish"]);
    expect(await Bun.file(path.join(root, "prod/index.html")).text()).toContain(
      "Published",
    );
    expect(log.mock.calls.flat().join("\n")).toContain(
      "Building app for production deployment",
    );
    log.mockRestore();
  }, 20_000);

  test("runs help and rejects an unknown command before requiring karma", async () => {
    const cliPath = path.resolve(import.meta.dir, "../src/index.ts");
    const run = async (...args: string[]) => {
      const child = Bun.spawn([process.execPath, cliPath, ...args], {
        cwd: root,
        env: { ...process.env, MAYA_DEV_MODE: "0" },
        stdout: "pipe",
        stderr: "pipe",
      });
      const [stdout, stderr, exitCode] = await Promise.all([
        new Response(child.stdout).text(),
        new Response(child.stderr).text(),
        child.exited,
      ]);
      return { stdout, stderr, exitCode };
    };
    const help = await run("help");
    expect(help.exitCode).toBe(0);
    expect(help.stdout).toContain("Usage: brahma <COMMAND>");
    const invalid = await run("unknown");
    expect(invalid.exitCode).toBe(0);
    expect(invalid.stdout).toContain("ERROR: bad input");
    expect(invalid.stdout).not.toContain("No karma.ts found");
    expect(invalid.stderr).toBe("");
  });
});
