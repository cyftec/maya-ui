export const setupBuild = async () => {
  if (!globalThis.document || globalThis.MutationObserver) {
    const { JSDOM } = await import("jsdom");
    const jsdom = new JSDOM("", { url: "https://localhost/" });
    globalThis.window = jsdom.window as unknown as Window & typeof globalThis;
    globalThis.document = jsdom.window.document;
    globalThis.MutationObserver = jsdom.window.MutationObserver;
  }
};
