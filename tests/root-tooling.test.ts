import { afterEach, describe, expect, mock, spyOn, test } from "bun:test";
import { mkdir, mkdtemp, rm } from "node:fs/promises";
import { tmpdir } from "node:os";
import path from "node:path";
import {
  PROBE_KARMA_FILE_PATH,
  REPO_ROOT,
  WORKSPACE_PACKAGE_DIRS,
  hasUncommittedChanges,
} from "../src/common";
import { postPublishReset } from "../src/publish/post-publish";
import { prePublishCleanup } from "../src/publish/pre-publish";
import {
  getPackageLatestPublishedVersion,
  getPackageRegistryURL,
  parsePackageInfo,
  verifyPublishState,
} from "../src/publish/verify-version";
import {
  updateAndVerifyMayaVersionsInKarmaProbe,
  verifyKarmProbeMayaVersion,
} from "../src/version-manager/karma-probe-maya-version";
import {
  updateAndVerifyVersionsInPackageJson,
  verifyVersionsInPackageJson,
} from "../src/version-manager/package-json";
import { verifyProbeAppsMayaVersion } from "../src/version-manager/verify-maya-version";

class ProcessExit extends Error {
  constructor(public readonly code: number) {
    super(`process.exit(${code})`);
  }
}

const roots: string[] = [];

const sleepFor = mock(async (_ms: number | Date) => {});

const makeTempDir = async () => {
  const root = await mkdtemp(path.join(tmpdir(), "maya-root-test-"));
  roots.push(root);
  return root;
};

const writeText = async (filePath: string, text: string) => {
  await mkdir(path.dirname(filePath), { recursive: true });
  await Bun.write(filePath, text);
};

const exitWithThrow = ((code?: number | string | null): never => {
  throw new ProcessExit(Number(code || 0));
}) as typeof process.exit;

afterEach(async () => {
  for (const root of roots.splice(0)) {
    await rm(root, { recursive: true });
  }
});

describe("root common utilities", () => {
  test("exposes repository paths and detects git status text", async () => {
    expect(REPO_ROOT).toBe(path.resolve(import.meta.dir, ".."));
    expect(PROBE_KARMA_FILE_PATH).toBe(
      path.join(
        REPO_ROOT,
        "brahma",
        "src",
        "probe-helpers",
        "probe",
        "base-karma",
        "karma.ts",
      ),
    );
    expect(WORKSPACE_PACKAGE_DIRS).toEqual(["maya", "brahma"]);
    await expect(hasUncommittedChanges(async () => "")).resolves.toBe(false);
    await expect(
      hasUncommittedChanges(async () => " M src/common\n"),
    ).resolves.toBe(true);
    expect(typeof (await hasUncommittedChanges())).toBe("boolean");
  });

  test("exits when git status cannot be read", async () => {
    const error = spyOn(console, "error").mockImplementation(() => {});
    await expect(
      hasUncommittedChanges(async () => {
        throw new Error("git failed");
      }, exitWithThrow),
    ).rejects.toBeInstanceOf(ProcessExit);
    error.mockRestore();
  });
});

describe("root package version manager", () => {
  test("updates and verifies package metadata versions", async () => {
    const root = await makeTempDir();
    const packagePath = path.join(root, "package.json");
    await writeText(
      packagePath,
      JSON.stringify({
        name: "fixture",
        version: "0.0.1",
        dependencies: {
          "@cyftec/maya": "workspace:*",
          untouched: "1.0.0",
        },
        devDependencies: { "@cyftec/maya": "workspace:*" },
        peerDependencies: { "@cyftec/maya": "workspace:*" },
      }),
    );

    await updateAndVerifyVersionsInPackageJson(packagePath, "1.2.3");
    const pkg = await Bun.file(packagePath).json();
    expect(pkg.version).toBe("1.2.3");
    expect(pkg.dependencies["@cyftec/maya"]).toBe("1.2.3");
    expect(pkg.dependencies.untouched).toBe("1.0.0");
    expect(pkg.devDependencies["@cyftec/maya"]).toBe("1.2.3");
    expect(pkg.peerDependencies["@cyftec/maya"]).toBe("1.2.3");
  });

  test("rejects package metadata with stale Maya dependency pins", async () => {
    const root = await makeTempDir();
    const packagePath = path.join(root, "package.json");
    await writeText(
      packagePath,
      JSON.stringify({
        name: "fixture",
        dependencies: { "@cyftec/maya": "0.0.1" },
      }),
    );

    await expect(
      verifyVersionsInPackageJson(packagePath, "1.2.3"),
    ).rejects.toBe(
      `dependencies["@cyftec/maya"] in '${packagePath}' found this version - '0.0.1' instead of '1.2.3'`,
    );
  });
});

describe("root karma probe version manager", () => {
  const karmaText = (version: string) => `
type Karma = any;
export const karma: Karma = {
  maya: {
    dependencies: { "@cyftec/maya": "${version}" },
  },
};
`;

  test("updates and verifies a supplied karma probe", async () => {
    const root = await makeTempDir();
    const karmaPath = path.join(root, "karma.ts");
    await writeText(karmaPath, karmaText("workspace:*"));

    await updateAndVerifyMayaVersionsInKarmaProbe("1.2.3", karmaPath);
    await verifyKarmProbeMayaVersion("1.2.3", karmaPath);
    expect(await Bun.file(karmaPath).text()).toContain(
      '{"@cyftec/maya": "1.2.3"}',
    );
  });

  test("rejects karma probes with mismatched Maya versions", async () => {
    const root = await makeTempDir();
    const karmaPath = path.join(root, "karma.ts");
    await writeText(karmaPath, karmaText("0.0.1"));

    await expect(verifyKarmProbeMayaVersion("1.2.3", karmaPath)).rejects.toBe(
      "Probe 'karma.ts' file doesn't contain this maya version - '1.2.3'",
    );
    await expect(verifyProbeAppsMayaVersion("1.2.3", karmaPath)).rejects.toBe(
      "Version in karma probe found to be 0.0.1.\nVersion expected: 1.2.3",
    );
  });

  test("verifies the current probe layout through an explicit karma path", async () => {
    const root = await makeTempDir();
    const karmaPath = path.join(root, "karma.ts");
    await writeText(karmaPath, karmaText("2.0.0"));
    await verifyProbeAppsMayaVersion("2.0.0", karmaPath);
  });
});

describe("root publish orchestration", () => {
  test("pre-publish updates each package and probe when the tree is clean", async () => {
    const updatePackageJson = mock(
      async (_pkgPath: string, _version: string) => {},
    );
    const updateKarmaProbe = mock(async (_version: string) => {});

    await prePublishCleanup("1.2.3", {
      repoRoot: "/repo",
      packageDirs: ["maya", "brahma"],
      hasChanges: async () => false,
      updatePackageJson,
      updateKarmaProbe,
    });

    expect(updatePackageJson).toHaveBeenNthCalledWith(
      1,
      "/repo/maya/package.json",
      "1.2.3",
    );
    expect(updatePackageJson).toHaveBeenNthCalledWith(
      2,
      "/repo/brahma/package.json",
      "1.2.3",
    );
    expect(updateKarmaProbe).toHaveBeenCalledTimes(1);
    expect(updateKarmaProbe).toHaveBeenCalledWith("1.2.3");
  });

  test("pre-publish exits before mutation when the tree is dirty", async () => {
    const error = spyOn(console, "error").mockImplementation(() => {});
    const updatePackageJson = mock(async () => {});

    await expect(
      prePublishCleanup("1.2.3", {
        hasChanges: async () => true,
        updatePackageJson,
        exit: exitWithThrow,
      }),
    ).rejects.toMatchObject({ code: 1 });
    expect(updatePackageJson).toHaveBeenCalledTimes(0);
    error.mockRestore();
  });

  test("post-publish resets each package and probe to workspace dependencies", async () => {
    const updatePackageJson = mock(
      async (_pkgPath: string, _version: string) => {},
    );
    const updateKarmaProbe = mock(async (_version: string) => {});

    await postPublishReset({
      repoRoot: "/repo",
      packageDirs: ["maya", "brahma"],
      updatePackageJson,
      updateKarmaProbe,
    });

    expect(updatePackageJson).toHaveBeenNthCalledWith(
      1,
      "/repo/maya/package.json",
      "workspace:*",
    );
    expect(updatePackageJson).toHaveBeenNthCalledWith(
      2,
      "/repo/brahma/package.json",
      "workspace:*",
    );
    expect(updateKarmaProbe).toHaveBeenCalledWith("workspace:*");
  });
});

describe("root publish verification", () => {
  test("builds npm registry URLs and reads latest published versions", async () => {
    expect(getPackageRegistryURL("@cyftec/maya")).toBe(
      "https://registry.npmjs.org/%40cyftec%2Fmaya/latest",
    );

    const fetchMetadata = mock(
      async () =>
        new Response(JSON.stringify({ version: "1.2.3" }), { status: 200 }),
    ) as unknown as typeof fetch;
    await expect(
      getPackageLatestPublishedVersion("@cyftec/maya", fetchMetadata),
    ).resolves.toBe("1.2.3");
  });

  test("exits when npm metadata cannot be fetched", async () => {
    const error = spyOn(console, "error").mockImplementation(() => {});
    const fetchMetadata = mock(
      async () => new Response("missing", { status: 404 }),
    ) as unknown as typeof fetch;

    await expect(
      getPackageLatestPublishedVersion(
        "@cyftec/maya",
        fetchMetadata,
        exitWithThrow,
      ),
    ).rejects.toMatchObject({ code: 1 });
    error.mockRestore();
  });

  test("parses package info and rejects invalid Bun output", () => {
    expect(
      parsePackageInfo("maya", '{"name":"@cyftec/maya","version":"1.2.3"}'),
    ).toEqual({ name: "@cyftec/maya", version: "1.2.3" });

    const error = spyOn(console, "error").mockImplementation(() => {});
    expect(() => parsePackageInfo("maya", "not json", exitWithThrow)).toThrow(
      ProcessExit,
    );
    expect(() =>
      parsePackageInfo(
        "maya",
        '{"name":"@cyftec/maya","extra":true}',
        exitWithThrow,
      ),
    ).toThrow(ProcessExit);
    error.mockRestore();
  });

  test("verifies published state when local and registry versions match", async () => {
    const getPackageInfo = mock(async (dirName: string) => ({
      name: `@cyftec/${dirName}`,
      version: "1.2.3",
    }));
    const getPublishedVersion = mock(async (_packageName: string) => "1.2.3");

    await verifyPublishState({
      packageDirs: ["maya", "brahma"],
      getPackageInfo,
      getPublishedVersion,
      sleepFor,
    });

    expect(getPackageInfo).toHaveBeenCalledTimes(2);
    expect(getPublishedVersion).toHaveBeenCalledTimes(2);
    expect(sleepFor).toHaveBeenCalledTimes(0);
  });

  test("reads local package info with Bun when no package-info adapter is supplied", async () => {
    const mayaPackage = await Bun.file(
      path.join(REPO_ROOT, "maya/package.json"),
    ).json();
    const getPublishedVersion = mock(
      async (_packageName: string) => mayaPackage.version,
    );

    await verifyPublishState({
      packageDirs: ["maya"],
      getPublishedVersion,
    });

    expect(getPublishedVersion).toHaveBeenCalledWith("@cyftec/maya");
  });

  test("exits when workspace package versions differ", async () => {
    const error = spyOn(console, "error").mockImplementation(() => {});
    const versions: Record<string, string> = { maya: "1.2.3", brahma: "2.0.0" };

    await expect(
      verifyPublishState({
        packageDirs: ["maya", "brahma"],
        getPackageInfo: async (dirName) => ({
          name: `@cyftec/${dirName}`,
          version: versions[dirName],
        }),
        getPublishedVersion: async () => "1.2.3",
        exit: exitWithThrow,
      }),
    ).rejects.toMatchObject({ code: 1 });
    error.mockRestore();
  });

  test("retries stale registry metadata and times out", async () => {
    const error = spyOn(console, "error").mockImplementation(() => {});
    const nowValues = [0, 0, 20];

    await expect(
      verifyPublishState({
        packageDirs: ["maya"],
        timeoutMs: 10,
        pollIntervalMs: 1,
        now: () => nowValues.shift() ?? 20,
        sleepFor,
        getPackageInfo: async () => ({
          name: "@cyftec/maya",
          version: "1.2.3",
        }),
        getPublishedVersion: async () => "1.2.2",
        exit: exitWithThrow,
      }),
    ).rejects.toMatchObject({ code: 1 });
    expect(sleepFor).toHaveBeenCalledWith(1);
    error.mockRestore();
  });
});
