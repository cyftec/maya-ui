type IDGen = {
  getNewId: () => number;
  resetIdCounter: () => number;
};

const idGenerator = () => {
  let _id = 0;
  return {
    getNewId: () => ++_id,
    resetIdCounter: () => (_id = 0),
  };
};

export const idGen: IDGen = idGenerator();
