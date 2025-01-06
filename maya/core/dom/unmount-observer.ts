import { currentPhaseIs, valueIsMHtmlElement } from "../../utils/index.ts";
import type { CustomEventValue, MHtmlElement } from "../../index.types.ts";

type ListenerData = {
  element: MHtmlElement;
  unmountListener: CustomEventValue;
};

let _observingDocument = false;
const addedNodesRecord: Record<number, string> = {};
const removedNodesRecord: Record<number, ListenerData> = {};
const MutationObserver = globalThis.MutationObserver;

const unmountObserver: MutationObserver = new MutationObserver((mutations) => {
  mutations.forEach((mutation) => {
    if (mutation.type === "childList") {
      mutation.addedNodes.forEach((node) => {
        if (valueIsMHtmlElement(node)) {
          const element = node as MHtmlElement;
          const elementId = element.elementId;
          if (removedNodesRecord[elementId])
            delete removedNodesRecord[elementId];
          else addedNodesRecord[elementId] = element.tagName;
        }
      });

      mutation.removedNodes.forEach((node) => {
        if (valueIsMHtmlElement(node)) {
          const element = node as MHtmlElement;
          const elementId = element.elementId;
          const unmountListener = element.unmountListener;
          if (unmountListener)
            removedNodesRecord[elementId] = {
              element,
              unmountListener: unmountListener as CustomEventValue,
            };
        }
      });
    }
  });
  Object.entries(removedNodesRecord).forEach(([_, listenerData]) => {
    const { element, unmountListener } = listenerData;
    execSubtreeUnmountListeners(element, unmountListener);
  });
});

const execSubtreeUnmountListeners = (
  element: MHtmlElement,
  elUnmountListener: CustomEventValue | undefined
): void => {
  if (!valueIsMHtmlElement(element)) return;

  const elChildren = element.children;
  for (let i = 0; i < elChildren.length; i++) {
    const elChild = elChildren[i] as MHtmlElement;
    execSubtreeUnmountListeners(elChild, elChild.unmountListener);
  }
  elUnmountListener && elUnmountListener();
  if (removedNodesRecord[element.elementId])
    delete removedNodesRecord[element.elementId];
};

export const startUnmountObserver = (): void => {
  if (!_observingDocument && !currentPhaseIs("build")) {
    unmountObserver.observe(document.body, {
      childList: true,
      subtree: true,
    });
    _observingDocument = true;
  }
};
