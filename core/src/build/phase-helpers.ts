import { mountUnmountObserver } from "../dom/index";
import type { HtmlNode } from "../types";
import { idGen } from "../utils/index";

export const buildStaticHtml = (page: () => HtmlNode): string => {
  if (window) window.isBuildHtmlPhase = true;
  idGen.resetIdCounter();
  const htmlPageNode = page();
  idGen.resetIdCounter();
  if (window) window.isBuildHtmlPhase = false;
  return htmlPageNode?.outerHTML;
};

/**
 * in brahma-cli build step, below code is not being used
 * in fact, a brute-force copy of below code is used in build process
 * TODO: make use of below code in build process
 */
export const runScript = (page: () => HtmlNode): void => {
  mountUnmountObserver.observe(document.body, {
    childList: true,
    subtree: true,
  });
  setTimeout(() => {
    if (window) window.isDomAccessPhase = true;
    idGen.resetIdCounter();
    page();
    idGen.resetIdCounter();
    if (window) window.isDomAccessPhase = false;
  });
};
