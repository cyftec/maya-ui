import type { CustomEventValue, MayaNode } from "../types.ts";
import { phase } from "./phase-helpers.ts";
import { valueIsMayaNode } from "./type-checkers.ts";

type ListenerData = {
  mayaNode: MayaNode;
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
        if (valueIsMayaNode(node)) {
          const mayaNode = node as MayaNode;
          const nodeID = mayaNode.nodeID;
          if (removedNodesRecord[nodeID]) delete removedNodesRecord[nodeID];
          else addedNodesRecord[nodeID] = mayaNode.tagName;
        }
      });

      mutation.removedNodes.forEach((node) => {
        if (valueIsMayaNode(node)) {
          const mayaNode = node as MayaNode;
          const nodeID = mayaNode.nodeID;
          const unmountListener = mayaNode.unmountListener;
          if (unmountListener)
            removedNodesRecord[nodeID] = {
              mayaNode,
              unmountListener: unmountListener as CustomEventValue,
            };
        }
      });
    }
  });
  Object.entries(removedNodesRecord).forEach(([_, listenerData]) => {
    const { mayaNode, unmountListener } = listenerData;
    execSubtreeUnmountListeners(mayaNode, unmountListener);
  });
});

const execSubtreeUnmountListeners = (
  mayaNode: MayaNode,
  elUnmountListener: CustomEventValue | undefined,
): void => {
  if (!valueIsMayaNode(mayaNode)) return;

  const elChildren = mayaNode.children;
  for (let i = 0; i < elChildren.length; i++) {
    const elChild = elChildren[i] as MayaNode;
    execSubtreeUnmountListeners(elChild, elChild.unmountListener);
  }
  elUnmountListener && elUnmountListener(mayaNode);
  if (removedNodesRecord[mayaNode.nodeID])
    delete removedNodesRecord[mayaNode.nodeID];
};

export const startUnmountObserver = (): void => {
  if (!_observingDocument && !phase.currentIs("build")) {
    unmountObserver.observe(document.body, {
      childList: true,
      subtree: true,
    });
    _observingDocument = true;
  }
};
