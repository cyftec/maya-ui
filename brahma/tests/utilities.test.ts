import {
  afterEach,
  beforeEach,
  describe,
  expect,
  mock,
  spyOn,
  test,
} from "bun:test";
import { EventEmitter } from "node:events";
import { exists, mkdir, rm } from "node:fs/promises";
import path from "node:path";
import {
  getBrahmaPackageJsonPath,
  getBrahmaRootPath,
  getCurrentBrahmaVersion,
} from "../src/brahma-version-getter.ts";
import { transformWebKarmaToNonWebKarma } from "../src/probe-helpers/karma-transformer.ts";
import {
  copyApp,
  copyBaseKarmaFiles,
} from "../src/probe-helpers/probe-copier/index.ts";
import { getParsedCommands } from "../src/utils/command-parser.ts";
import {
  createDirIfNotExist,
  getCWD,
  getFileNameFromPath,
  getKarma,
  nonCachedImport,
} from "../src/utils/common.ts";
import { ACCEPTED_COMMANDS, DS_STORE_REGEX } from "../src/utils/constants.ts";
import {
  getAppSrcPath,
  getAppViewPath,
  getBuildDirPath,
  getKarmaPaths,
  getPackageJsonPath,
} from "../src/utils/file-path-getters.ts";
import {
  splitText,
  updateSectionInFile,
} from "../src/utils/file-section-updater.ts";
import { ValidateAndExitIf } from "../src/utils/file-validations.ts";
import { syncPackageJsonToKarma } from "../src/utils/karma-file-updaters.ts";
import { onProcessSigInt } from "../src/utils/process-helpers.ts";
import { startStdinListener } from "../src/utils/stdin-listener.ts";
import {
  ProcessExit,
  karmaModuleText,
  makeKarma,
  makeTempDir,
  writeText,
} from "./fixtures.ts";

const originalDevMode = process.env.MAYA_DEV_MODE;
const originalInitCwd = process.env.INIT_CWD;
let exitSpy: ReturnType<typeof spyOn> | undefined;

const mockExit = () => {
  exitSpy = spyOn(process, "exit").mockImplementation(((
    code?: number | string | null,
  ): never => {
    throw new ProcessExit(Number(code || 0));
  }) as typeof process.exit);
};

beforeEach(() => {
  mockExit();
});

afterEach(() => {
  exitSpy?.mockRestore();
  if (originalDevMode === undefined) delete process.env.MAYA_DEV_MODE;
  else process.env.MAYA_DEV_MODE = originalDevMode;
  if (originalInitCwd === undefined) delete process.env.INIT_CWD;
  else process.env.INIT_CWD = originalInitCwd;
});

describe("command parsing and constants", () => {
  test("parses every long and short command with trailing args", () => {
    for (const accepted of ACCEPTED_COMMANDS) {
      for (const name of [accepted.long, accepted.short]) {
        const result = getParsedCommands(["bun", "brahma", name, "one", "two"]);
        expect(result[accepted.long]?.args).toEqual(["one", "two"]);
        expect(result.error).toBe(false);
        expect(result.nocmd).toBe(false);
      }
    }
  });

  test("distinguishes no command from an unknown command", () => {
    expect(getParsedCommands(["bun", "brahma"]).nocmd).toBe(true);
    const invalid = getParsedCommands(["bun", "brahma", "wat"]);
    expect(invalid.error).toBe(true);
    expect(invalid.nocmd).toBe(false);
  });

  test("matches only actual .DS_Store path endings", () => {
    expect(DS_STORE_REGEX.test("/app/.DS_Store")).toBe(true);
    expect(DS_STORE_REGEX.test("/app/xDS_Store")).toBe(false);
    expect(DS_STORE_REGEX.test("/app/.DS_Store.txt")).toBe(false);
  });
});

describe("path and common helpers", () => {
  test("derives app, config, package, staging, and production paths", () => {
    const karma = makeKarma();
    expect(getAppSrcPath("/tmp/app", karma)).toBe("/tmp/app/dev");
    expect(getAppViewPath("/tmp/app", karma)).toBe("/tmp/app/dev/view");
    expect(getPackageJsonPath("/tmp/app")).toBe("/tmp/app/package.json");
    expect(getKarmaPaths("/tmp/app")).toEqual([
      "/tmp/app/_karma/karma.ts",
      "/tmp/app/_karma/types.ts",
    ]);
    expect(getBuildDirPath("/tmp/app", "/tmp/app/dev/view", karma, false)).toBe(
      "/tmp/app/stage",
    );
    expect(
      getBuildDirPath("/tmp/app", "/tmp/app/dev/view/about", karma, true),
    ).toBe("/tmp/app/prod/about");
  });

  test("creates missing directories and tolerates existing directories", async () => {
    const root = await makeTempDir();
    const child = path.join(root, "child");
    await createDirIfNotExist(child);
    expect(await exists(child)).toBe(true);
    await createDirIfNotExist(child);
    await expect(createDirIfNotExist("/")).resolves.toBeUndefined();
    await rm(root, { recursive: true });
  });

  test("reports the path when directory creation fails", async () => {
    const root = await makeTempDir();
    const blockingFile = path.join(root, "file");
    const nestedPath = path.join(blockingFile, "child");
    await writeText(blockingFile, "not a directory");
    const log = spyOn(console, "log").mockImplementation(() => {});
    await expect(createDirIfNotExist(nestedPath)).rejects.toBeDefined();
    expect(log).toHaveBeenCalledWith(nestedPath);
    log.mockRestore();
    await rm(root, { recursive: true });
  });

  test("extracts filenames and rejects pathless values", () => {
    expect(getFileNameFromPath("/tmp/app/file.ts")).toBe("file.ts");
    expect(() => getFileNameFromPath("file.ts")).toThrow("Not a valid");
  });

  test("uses process cwd normally and INIT_CWD only in development mode", () => {
    process.env.MAYA_DEV_MODE = "0";
    process.env.INIT_CWD = "/tmp/ignored";
    expect(getCWD()).toBe(process.cwd());
    process.env.MAYA_DEV_MODE = "1";
    expect(getCWD()).toBe("/tmp/ignored");
    delete process.env.INIT_CWD;
    expect(getCWD()).toBe(process.cwd());
  });

  test("loads non-cached modules and valid karma files", async () => {
    const root = await makeTempDir();
    const modulePath = path.join(root, "value.ts");
    await writeText(modulePath, "export const value = 1;");
    expect((await nonCachedImport(modulePath)).value).toBe(1);
    const karma = makeKarma({ appType: "pwa" });
    await mkdir(path.join(root, "_karma"), { recursive: true });
    await writeText(path.join(root, "_karma/karma.ts"), karmaModuleText(karma));
    expect((await getKarma(root)).maya.appType).toBe("pwa");
    await rm(root, { recursive: true });
  });
});

describe("structured file updates", () => {
  test("splits through ordered milestones and reports missing ones", () => {
    expect(
      splitText("before alpha middle beta after", ["alpha", "beta"]),
    ).toEqual(["before alpha middle beta", " after"]);
    expect(() => splitText("alpha", ["missing"])).toThrow("does not exist");
  });

  test("updates nested object and array sections without disturbing surrounding text", async () => {
    const root = await makeTempDir();
    const objectFile = path.join(root, "object.ts");
    await writeText(
      objectFile,
      "const config = { before: true, target: { nested: { old: 1 } }, after: true };",
    );
    await updateSectionInFile(objectFile, ["target:"], "{ replaced: 2 }");
    expect(await Bun.file(objectFile).text()).toBe(
      "const config = { before: true, target:{ replaced: 2 }, after: true };",
    );

    const arrayFile = path.join(root, "array.ts");
    await writeText(
      arrayFile,
      "const config = { list: [1, [2, 3], 4], end: 1 };",
    );
    await updateSectionInFile(arrayFile, ["list:"], "[9, 8]", "array");
    expect(await Bun.file(arrayFile).text()).toBe(
      "const config = { list:[9, 8], end: 1 };",
    );
    await rm(root, { recursive: true });
  });

  test("syncs package.json into karma after awaiting file validation", async () => {
    const root = await makeTempDir();
    const karma = makeKarma();
    await mkdir(path.join(root, "_karma"), { recursive: true });
    await writeText(path.join(root, "_karma/karma.ts"), karmaModuleText(karma));
    await writeText(
      path.join(root, "package.json"),
      JSON.stringify({ name: "updated", dependencies: { x: "1.0.0" } }),
    );
    await syncPackageJsonToKarma(root);
    const updated = await Bun.file(path.join(root, "_karma/karma.ts")).text();
    expect(updated).toContain('"name":"updated"');
    expect(updated).toContain('"x":"1.0.0"');
    await rm(root, { recursive: true });
  });
});

describe("probe helpers", () => {
  test("rejects invalid karma transform paths", async () => {
    const root = await makeTempDir();
    await expect(
      transformWebKarmaToNonWebKarma("pwa", path.join(root, "missing.ts")),
    ).rejects.toBe(`Invalid karma path provided - '${path.join(root, "missing.ts")}'`);
    await rm(root, { recursive: true });
  });

  test("exits when scaffold copy targets cannot be created", async () => {
    const root = await makeTempDir();
    const blockingFile = path.join(root, "blocking-file");
    await writeText(blockingFile, "not a directory");
    const error = spyOn(console, "error").mockImplementation(() => {});

    await expect(copyApp("web", path.join(blockingFile, "app"))).rejects.toBeInstanceOf(
      ProcessExit,
    );
    await expect(
      copyBaseKarmaFiles("web", path.join(blockingFile, "app")),
    ).rejects.toBeInstanceOf(ProcessExit);
    expect(error).toHaveBeenCalledTimes(2);

    error.mockRestore();
    await rm(root, { recursive: true });
  });
});

describe("validations", () => {
  test("accepts a complete app layout", async () => {
    const root = await makeTempDir();
    const karma = makeKarma();
    await mkdir(path.join(root, "_karma"), { recursive: true });
    await writeText(path.join(root, "_karma/karma.ts"), karmaModuleText(karma));
    await mkdir(path.join(root, "dev/view"), { recursive: true });
    await writeText(path.join(root, "package.json"), "{}");
    await expect(
      ValidateAndExitIf.karmaFileMissing(root),
    ).resolves.toBeUndefined();
    expect(ValidateAndExitIf.exportedKarmaMissing(karma)).toBeUndefined();
    await expect(
      ValidateAndExitIf.appSrcDirMissing(root, karma),
    ).resolves.toBeUndefined();
    await expect(
      ValidateAndExitIf.appViewDirMissing(root, karma),
    ).resolves.toBeUndefined();
    await expect(
      ValidateAndExitIf.packageJsonMissing(root),
    ).resolves.toBeUndefined();
    await rm(root, { recursive: true });
  });

  test("exits for each missing or corrupt prerequisite", async () => {
    const root = await makeTempDir();
    const karma = makeKarma();
    const log = spyOn(console, "log").mockImplementation(() => {});
    await expect(
      ValidateAndExitIf.karmaFileMissing(root),
    ).rejects.toBeInstanceOf(ProcessExit);
    expect(() =>
      ValidateAndExitIf.exportedKarmaMissing(undefined as never),
    ).toThrow(ProcessExit);
    await expect(
      ValidateAndExitIf.appSrcDirMissing(root, karma),
    ).rejects.toBeInstanceOf(ProcessExit);
    await mkdir(path.join(root, "dev"));
    await expect(
      ValidateAndExitIf.appViewDirMissing(root, karma),
    ).rejects.toBeInstanceOf(ProcessExit);
    await expect(
      ValidateAndExitIf.packageJsonMissing(root),
    ).rejects.toBeInstanceOf(ProcessExit);
    expect(log).toHaveBeenCalled();
    log.mockRestore();
    await rm(root, { recursive: true });
  });
});

describe("zip utility", () => {
  test("zips a directory and creates a zip file", async () => {
    const { zipTheFolder } = await import("../src/utils/zip-the-folder.ts");
    const root = await makeTempDir();
    const sourceDir = path.join(root, "source");
    const zipPath = path.join(root, "output.zip");

    await mkdir(sourceDir, { recursive: true });
    await writeText(path.join(sourceDir, "file.txt"), "content");

    await zipTheFolder(sourceDir, zipPath as `${string}.zip`);

    expect(await exists(zipPath)).toBe(true);
    expect(await exists(sourceDir)).toBe(true);

    await rm(root, { recursive: true });
  });

  test("zips a directory with multiple files", async () => {
    const { zipTheFolder } = await import("../src/utils/zip-the-folder.ts");
    const root = await makeTempDir();
    const sourceDir = path.join(root, "source");
    const zipPath = path.join(root, "output.zip");

    await mkdir(sourceDir, { recursive: true });
    await writeText(path.join(sourceDir, "file1.txt"), "content1");
    await writeText(path.join(sourceDir, "file2.txt"), "content2");
    await mkdir(path.join(sourceDir, "subdir"), { recursive: true });
    await writeText(path.join(sourceDir, "subdir", "file3.txt"), "content3");

    await zipTheFolder(sourceDir, zipPath as `${string}.zip`);

    expect(await exists(zipPath)).toBe(true);
    expect(Bun.file(zipPath).size).toBeGreaterThan(100);

    await rm(root, { recursive: true });
  });
});

describe("debouncer utility", () => {
  test("delays function execution by specified delay period", async () => {
    const { debouncer } = await import("../src/utils/debouncer.ts");
    const callback = mock(async (_value: string) => {});
    const delay = (milliseconds: number) =>
      new Promise((resolve) => setTimeout(resolve, milliseconds));

    const debouncedFn = debouncer(callback, 100, false);

    debouncedFn("first");

    await delay(50);
    expect(callback).toHaveBeenCalledTimes(0);

    await delay(60);
    expect(callback).toHaveBeenCalledTimes(1);
    expect(callback).toHaveBeenCalledWith("first");
  });

  test("executes each delayed call after delay period", async () => {
    const { debouncer } = await import("../src/utils/debouncer.ts");
    const callback = mock(async (_value: string) => {});
    const delay = (milliseconds: number) =>
      new Promise((resolve) => setTimeout(resolve, milliseconds));

    const debouncedFn = debouncer(callback, 100, false);

    debouncedFn("first");
    debouncedFn("second");
    debouncedFn("third");

    await delay(150);

    expect(callback).toHaveBeenCalledTimes(3);
    expect(callback).toHaveBeenNthCalledWith(1, "first");
    expect(callback).toHaveBeenNthCalledWith(2, "second");
    expect(callback).toHaveBeenNthCalledWith(3, "third");
  });

  test("logs performance timing when withPerf is enabled", async () => {
    const { debouncer } = await import("../src/utils/debouncer.ts");
    const callback = mock(async () => {});
    const log = spyOn(console, "log").mockImplementation(() => {});
    const delay = (milliseconds: number) =>
      new Promise((resolve) => setTimeout(resolve, milliseconds));

    const debouncedFn = debouncer(callback, 100, true);

    debouncedFn("test");

    await delay(150);

    expect(callback).toHaveBeenCalledTimes(1);
    expect(log).toHaveBeenCalledWith(expect.stringContaining("Done in"));
    log.mockRestore();
  });
});

describe("version and process utilities", () => {
  test("resolves and reads the Brahma package version", async () => {
    expect(getBrahmaRootPath()).toBe(path.resolve(import.meta.dir, ".."));
    expect(getBrahmaPackageJsonPath()).toBe(
      path.join(getBrahmaRootPath(), "package.json"),
    );
    expect(await getCurrentBrahmaVersion()).toBe("0.0.16");
  });

  test("exits for missing or versionless package metadata", async () => {
    const root = await makeTempDir();
    const error = spyOn(console, "error").mockImplementation(() => {});
    await expect(
      getCurrentBrahmaVersion(path.join(root, "missing.json")),
    ).rejects.toBeInstanceOf(ProcessExit);
    const packagePath = path.join(root, "package.json");
    await writeText(packagePath, '{"name":"brahma"}');
    await expect(getCurrentBrahmaVersion(packagePath)).rejects.toBeInstanceOf(
      ProcessExit,
    );
    expect(error).toHaveBeenCalledTimes(2);
    error.mockRestore();
    await rm(root, { recursive: true });
  });

  test("handles SIGINT and q input through injectable process controls", async () => {
    const processEvents = new EventEmitter();
    const exit = mock(() => undefined) as unknown as NodeJS.Process["exit"];
    onProcessSigInt({
      on: processEvents.on.bind(processEvents) as NodeJS.Process["on"],
      exit,
    });
    processEvents.emit("SIGINT");
    expect(exit).toHaveBeenCalledTimes(1);

    const stdinEvents = new EventEmitter();
    const setRawMode = mock(() => stdinEvents) as never;
    const resume = mock(() => stdinEvents) as never;
    const setEncoding = mock(() => stdinEvents) as never;
    const quit = mock(() => {});
    await startStdinListener(quit, {
      setRawMode,
      resume,
      setEncoding,
      on: stdinEvents.on.bind(stdinEvents) as NodeJS.ReadStream["on"],
    });
    stdinEvents.emit("data", "keep going\n");
    stdinEvents.emit("data", "q");
    expect(setRawMode).toHaveBeenCalledTimes(1);
    expect(setRawMode).toHaveBeenCalledWith(true);
    expect(resume).toHaveBeenCalledTimes(1);
    expect(setEncoding).toHaveBeenCalledWith("utf8");
    expect(quit).toHaveBeenCalledTimes(1);
  });
});
