import { idGen } from "../utils/index";
import { mountUnmountObserver } from "../dom/index";
import type { HtmlNode } from "../types";

export const buildStaticHtml = (page: () => HtmlNode): string => {
  if (window) window.isBuildHtmlPhase = true;
  idGen.resetIdCounter();
  const htmlPageNode = page();
  idGen.resetIdCounter();
  if (window) window.isBuildHtmlPhase = false;
  return htmlPageNode?.outerHTML;
};

const accessStaticHtmlDom = (page: () => HtmlNode) => {
  if (window) window.isDomAccessPhase = true;
  idGen.resetIdCounter();
  page();
  idGen.resetIdCounter();
  if (window) window.isDomAccessPhase = false;
};

export const runScript = (page: () => HtmlNode): void => {
  mountUnmountObserver.observe(document.body, {
    childList: true,
    subtree: true,
  });
  setTimeout(() => accessStaticHtmlDom(page));
};
