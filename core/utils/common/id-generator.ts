import type { IDGen } from "../../index-types.ts";

const idGenerator = () => {
  let nodeId = 0;
  return {
    getNewId: () => ++nodeId,
    resetIdCounter: () => (nodeId = 0),
  };
};

export const idGen: IDGen = idGenerator();
