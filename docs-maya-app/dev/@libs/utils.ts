import { m } from "@mufw/maya";

export const runHighlightJsScriptOnMount = () => {
  const hightlightJsScriptElemId = "hightlight-js-script";
  const hightlightJsScriptElem = document.getElementById(
    hightlightJsScriptElemId
  );
  if (hightlightJsScriptElem) {
    hightlightJsScriptElem.parentElement?.removeChild(hightlightJsScriptElem);
  }

  document.body.appendChild(
    m.Script({
      id: hightlightJsScriptElemId,
      defer: true,
      children: `hljs.highlightAll();`,
    })()
  );
};

export const scrollToPageTop = () => {
  document.body.scrollTop = document.documentElement.scrollTop = 0;
};
