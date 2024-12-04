import { valueIsHtmlNode } from "../utils/index";
import type { CustomEventValue, HtmlNode, UnmountListener } from "../types";

type ListenerData = { node: HtmlNode; unmountListener: CustomEventValue };

const mountRecord: Record<number, string> = {};
const unmountRecord: Record<number, ListenerData> = {};

export const mountUnmountObserver: MutationObserver = new MutationObserver(
  (mutations) => {
    mutations.forEach((mutation) => {
      if (mutation.type === "childList") {
        mutation.addedNodes.forEach((n) => {
          if (valueIsHtmlNode(n)) {
            const node = n as HtmlNode;
            const nodeId = node.nodeId;
            if (unmountRecord[nodeId]) delete unmountRecord[nodeId];
            else mountRecord[nodeId] = node.tagName;
          }
        });

        mutation.removedNodes.forEach((n) => {
          if (valueIsHtmlNode(n)) {
            const node = n as HtmlNode;
            const nodeId = node.nodeId;
            const unmountListener = node.unmountListener;
            if (unmountListener)
              unmountRecord[nodeId] = {
                node,
                unmountListener: unmountListener as CustomEventValue,
              };
          }
        });
      }
    });
    Object.entries(unmountRecord).forEach(([_, listenerData]) => {
      const { node, unmountListener } = listenerData;
      execSubtreeUnmountListeners(node, unmountListener);
    });
  }
);

const execSubtreeUnmountListeners = (
  node: HtmlNode,
  elUnmountListener: UnmountListener
) => {
  if (!valueIsHtmlNode(node)) return;

  const elChildren = node.children;
  for (var i = 0; i < elChildren.length; i++) {
    var elChild = elChildren[i] as HtmlNode;
    execSubtreeUnmountListeners(elChild, elChild.unmountListener);
  }
  elUnmountListener && elUnmountListener();
  if (unmountRecord[node.nodeId]) delete unmountRecord[node.nodeId];
};
