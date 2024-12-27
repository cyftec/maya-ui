import type { IDGen } from "../../index.types";

const idGenerator = () => {
  let nodeId = 0;
  return {
    getNewId: () => ++nodeId,
    resetIdCounter: () => (nodeId = 0),
  };
};

export const idGen: IDGen = idGenerator();
