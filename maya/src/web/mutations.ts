import type { MayaElement, MayaEventValue, UnmountListener } from "./types.ts";
import { valueIsMayaNode } from "./common.ts";

type ListenerData = { el: MayaElement; unmountListener: MayaEventValue };
const mountRecord: Record<number, string> = {};
const unmountRecord: Record<number, ListenerData> = {};

export const mountUnmountObserver: MutationObserver = new MutationObserver(
  (mutations) => {
    mutations.forEach((mutation) => {
      if (mutation.type === "childList") {
        mutation.addedNodes.forEach((node) => {
          if (valueIsMayaNode(node)) {
            const el = node as MayaElement;
            const elMayaId = el.mayaId;
            if (unmountRecord[elMayaId]) delete unmountRecord[elMayaId];
            else mountRecord[elMayaId] = el.tagName;
          }
        });

        mutation.removedNodes.forEach((node) => {
          if (valueIsMayaNode(node)) {
            const el = node as MayaElement;
            const elMayaId = el.mayaId;
            const unmountListener = el.unmountListener;
            if (unmountListener)
              unmountRecord[elMayaId] = {
                el,
                unmountListener: unmountListener as MayaEventValue,
              };
          }
        });
      }
    });
    Object.entries(unmountRecord).forEach(([_, listenerData]) => {
      const { el, unmountListener } = listenerData;
      execSubtreeUnmountListeners(el, unmountListener);
    });
  }
);

const execSubtreeUnmountListeners = (
  el: MayaElement,
  elUnmountListener: UnmountListener
) => {
  if (!valueIsMayaNode(el)) return;

  const elChildren = el.children;
  for (var i = 0; i < elChildren.length; i++) {
    var elChild = elChildren[i] as MayaElement;
    execSubtreeUnmountListeners(elChild, elChild.unmountListener);
  }
  elUnmountListener && elUnmountListener();
  if (unmountRecord[el.mayaId]) delete unmountRecord[el.mayaId];
};
