import type { MayaNode, PropsForTag } from "../src/core/types.ts";

export const dialogReceivesDialogNode: PropsForTag<"dialog"> = {
  onmount: (node: MayaNode<HTMLDialogElement>) => node.showModal(),
};

export const dialogAcceptsGenericNodeHandler: PropsForTag<"dialog"> = {
  onunmount: (_node: MayaNode<HTMLElement>) => {},
};

export const dialogRejectsDivNodeHandler: PropsForTag<"dialog"> = {
  // @ts-expect-error A dialog lifecycle handler cannot require a div node.
  onmount: (_node: MayaNode<HTMLDivElement>) => {},
};
