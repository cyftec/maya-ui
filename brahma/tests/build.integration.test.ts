import { afterEach, describe, expect, spyOn, test } from "bun:test";
import { exists, rm } from "node:fs/promises";
import path from "node:path";
import { buildApp } from "../src/builder/build.ts";
import {
  getBuildFileNames,
  getBuiltJsMethodName,
  isSrcPageFile,
  mountAndRunFnDef,
  zipAndDeleteDir,
} from "../src/builder/build-helpers.ts";
import { setupBuild } from "../src/builder/build-setup.ts";
import { ProcessExit, makeKarma, makeTempDir, writeText } from "./fixtures.ts";

const mayaCorePath = path.resolve(import.meta.dir, "../../maya/src/core/index.ts");
const roots: string[] = [];

const newRoot = async () => {
  const root = await makeTempDir();
  roots.push(root);
  return root;
};

const pageSource = (title: string, scriptName: string) => `
import { m } from ${JSON.stringify(mayaCorePath)};
export default m.Html({
  lang: "en",
  children: [
    m.Head([m.Title(${JSON.stringify(title)}), m.Meta({ charset: "UTF-8" })]),
    m.Body([m.H1(${JSON.stringify(title)}), m.Script({ src: ${JSON.stringify(scriptName)}, defer: true })]),
  ],
});
`;

const writeBuildFixture = async (root: string) => {
  const view = path.join(root, "dev/view");
  await writeText(path.join(view, "page.ts"), pageSource("Home", "main.js"));
  await writeText(
    path.join(view, "about.page.ts"),
    pageSource("About", "about.main.js"),
  );
  await writeText(path.join(view, "homepage.ts"), "export const value = 'asset';");
  await writeText(
    path.join(view, "manifest.ts"),
    "export default { name: 'Fixture', start_url: '/' };",
  );
  await writeText(path.join(view, "worker.ts"), "export const worker = true;");
  await writeText(path.join(view, "assets/styles.css"), "body { color: navy; }");
  await writeText(path.join(view, "assets/.DS_Store"), "ignored");
  await writeText(path.join(view, "@private/secret.txt"), "ignored");
  await writeText(path.join(view, "empty/.DS_Store"), "ignored");
};

afterEach(async () => {
  for (const root of roots.splice(0)) {
    if (await exists(root)) await rm(root, { recursive: true });
  }
});

describe("builder helpers", () => {
  test("recognizes only exact and dotted page filenames", () => {
    const karma = makeKarma();
    expect(isSrcPageFile("/app/page.ts", karma)).toBe(true);
    expect(isSrcPageFile("/app/about.page.ts", karma)).toBe(true);
    expect(isSrcPageFile("/app/homepage.ts", karma)).toBe(false);
    expect(isSrcPageFile("/app/page.ts.txt", karma)).toBe(false);
  });

  test("derives route output names and bundled default export identifiers", () => {
    const karma = makeKarma();
    expect(getBuildFileNames("/app/page.ts", karma)).toEqual({
      htmlFileName: "index.html",
      jsFileName: "main.js",
    });
    expect(getBuildFileNames("/app/about.page.ts", karma)).toEqual({
      htmlFileName: "about.html",
      jsFileName: "about.main.js",
    });
    expect(getBuiltJsMethodName("main.js", karma)).toBe("page_default");
    expect(getBuiltJsMethodName("about.main.js", karma)).toBe(
      "about_page_default",
    );
    expect(getBuiltJsMethodName("my-route.main.js", karma)).toBe(
      "my_route_page_default",
    );
    expect(mountAndRunFnDef("route_default")).toContain("route_default();");
  });

  test("initializes a DOM when either required global is absent and preserves a complete DOM", async () => {
    const originalWindow = globalThis.window;
    const originalDocument = globalThis.document;
    const originalObserver = globalThis.MutationObserver;
    try {
      Reflect.deleteProperty(globalThis, "document");
      Reflect.deleteProperty(globalThis, "MutationObserver");
      await setupBuild();
      expect(globalThis.document).toBeDefined();
      expect(globalThis.MutationObserver).toBeDefined();

      const stableDocument = globalThis.document;
      await setupBuild();
      expect(globalThis.document).toBe(stableDocument);

      Reflect.deleteProperty(globalThis, "MutationObserver");
      await setupBuild();
      expect(globalThis.MutationObserver).toBeDefined();
    } finally {
      globalThis.window = originalWindow;
      globalThis.document = originalDocument;
      globalThis.MutationObserver = originalObserver;
    }
  });

  test("archives a directory and removes its source", async () => {
    const root = await newRoot();
    const source = path.join(root, "bundle");
    const zipPath = `${source}.zip` as const;
    await writeText(path.join(source, "asset.txt"), "asset");
    await zipAndDeleteDir(source, zipPath);
    expect(await exists(source)).toBe(false);
    expect(await exists(zipPath)).toBe(true);
    expect(Bun.file(zipPath).size).toBeGreaterThan(20);
  });
});

describe("build integration", () => {
  test("builds a complete staging tree with HTML, hydrated JS, manifest, TS, and static assets", async () => {
    const root = await newRoot();
    await writeBuildFixture(root);
    await writeText(path.join(root, "stage/stale.txt"), "stale");
    const karma = makeKarma({ reloadPageOnFocus: true });
    await buildApp(root, karma, false);

    const stage = path.join(root, "stage");
    const indexHtml = await Bun.file(path.join(stage, "index.html")).text();
    const aboutHtml = await Bun.file(path.join(stage, "about.html")).text();
    const mainJs = await Bun.file(path.join(stage, "main.js")).text();
    expect(indexHtml).toStartWith("<!DOCTYPE html>\n<html");
    expect(indexHtml).toContain("<h1 data-elem-id=");
    expect(indexHtml).toContain("Home");
    expect(aboutHtml).toContain("About");
    expect(mainJs).toContain("const mountAndRun");
    expect(mainJs).toContain("window.onfocus = () => location.reload();");
    expect(mainJs).not.toContain("export {");
    expect(await Bun.file(path.join(stage, "manifest.json")).json()).toEqual({
      name: "Fixture",
      start_url: "/",
    });
    expect(await Bun.file(path.join(stage, "assets/styles.css")).text()).toBe(
      "body { color: navy; }",
    );
    expect(await exists(path.join(stage, "worker.js"))).toBe(true);
    expect(await exists(path.join(stage, "homepage.js"))).toBe(true);
    expect(await exists(path.join(stage, "@private"))).toBe(false);
    expect(await exists(path.join(stage, "assets/.DS_Store"))).toBe(false);
    expect(await exists(path.join(stage, "empty"))).toBe(false);
    expect(await exists(path.join(stage, "stale.txt"))).toBe(false);
  }, 20_000);

  test("minifies and zips extension production output", async () => {
    const root = await newRoot();
    await writeBuildFixture(root);
    const karma = makeKarma({ appType: "ext", reloadPageOnFocus: true });
    await buildApp(root, karma, true);
    expect(await exists(path.join(root, "prod"))).toBe(false);
    expect(await exists(path.join(root, "prod.zip"))).toBe(true);
    expect(Bun.file(path.join(root, "prod.zip")).size).toBeGreaterThan(100);
  }, 20_000);

  test("skips a page HTML error only when configured", async () => {
    const root = await newRoot();
    await writeText(path.join(root, "dev/view/page.ts"), "export default undefined;");
    const log = spyOn(console, "log").mockImplementation(() => {});
    await buildApp(root, makeKarma({ skipErrorAndBuildNext: true }), false);
    expect(await exists(path.join(root, "stage/index.html"))).toBe(false);
    expect(await exists(path.join(root, "stage/main.js"))).toBe(true);
    expect(log).toHaveBeenCalled();
    log.mockRestore();
  });

  test("exits on page HTML errors when skipping is disabled", async () => {
    const root = await newRoot();
    await writeText(path.join(root, "dev/view/page.ts"), "export default undefined;");
    const log = spyOn(console, "log").mockImplementation(() => {});
    const exit = spyOn(process, "exit").mockImplementation(
      ((code?: number | string | null): never => {
        throw new ProcessExit(Number(code || 0));
      }) as typeof process.exit,
    );
    await expect(buildApp(root, makeKarma(), false)).rejects.toMatchObject({
      code: 1,
    });
    exit.mockRestore();
    log.mockRestore();
  });
});
