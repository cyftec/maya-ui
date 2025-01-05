import { currentPhaseIs, valueIsHtmlNode } from "../../utils/index.ts";
import type {
  CustomEventValue,
  HtmlNode,
  UnmountListener,
} from "../../index.types.ts";

type ListenerData = { node: HtmlNode; unmountListener: CustomEventValue };

let _observingDocument = false;
const addedNodesRecord: Record<number, string> = {};
const removedNodesRecord: Record<number, ListenerData> = {};
const MutationObserver = globalThis.MutationObserver;

const unmountObserver: MutationObserver = new MutationObserver((mutations) => {
  mutations.forEach((mutation) => {
    if (mutation.type === "childList") {
      mutation.addedNodes.forEach((n) => {
        if (valueIsHtmlNode(n)) {
          const node = n as HtmlNode;
          const nodeId = node.nodeId;
          if (removedNodesRecord[nodeId]) delete removedNodesRecord[nodeId];
          else addedNodesRecord[nodeId] = node.tagName;
        }
      });

      mutation.removedNodes.forEach((n) => {
        if (valueIsHtmlNode(n)) {
          const node = n as HtmlNode;
          const nodeId = node.nodeId;
          const unmountListener = node.unmountListener;
          if (unmountListener)
            removedNodesRecord[nodeId] = {
              node,
              unmountListener: unmountListener as CustomEventValue,
            };
        }
      });
    }
  });
  Object.entries(removedNodesRecord).forEach(([_, listenerData]) => {
    const { node, unmountListener } = listenerData;
    execSubtreeUnmountListeners(node, unmountListener);
  });
});

const execSubtreeUnmountListeners = (
  node: HtmlNode,
  elUnmountListener: UnmountListener
): void => {
  if (!valueIsHtmlNode(node)) return;

  const elChildren = node.children;
  for (let i = 0; i < elChildren.length; i++) {
    const elChild = elChildren[i] as HtmlNode;
    execSubtreeUnmountListeners(elChild, elChild.unmountListener);
  }
  elUnmountListener && elUnmountListener();
  if (removedNodesRecord[node.nodeId]) delete removedNodesRecord[node.nodeId];
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
