import type {
  HtmlNode,
  RunScriptFunctionDefinition,
  StaticHtmlBuilder,
} from "../../index-types.ts";
import { idGen } from "./index.ts";
import { startPhase } from "./phase-helpers.ts";

export const buildStaticHtml: StaticHtmlBuilder = (page: () => HtmlNode) => {
  startPhase("build");
  idGen.resetIdCounter();
  const htmlPageNode = page();
  idGen.resetIdCounter();
  return htmlPageNode?.outerHTML;
};

/**
 * in brahma-cli build step, below code is not being used
 * in fact, a brute-force copy of below code is used in build process
 * TODO: make use of below code in build process
 */

export const runScriptText: RunScriptFunctionDefinition = (
  appMethodName: string
) => `
const runScript = () => {
  setTimeout(() => {
    startPhase("mount");
    idGen.resetIdCounter();
    ${appMethodName}();
    idGen.resetIdCounter();
    startPhase("run")
  });
};
runScript();
`;
