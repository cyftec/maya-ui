export type MutationType = "add" | "update" | "idle" | "shuffle";

export type ArrItemMutation<T> = {
  type: MutationType;
  oldIndex: number;
  value: T;
};

export const getArrayMutations: <T extends object>(
  oldDistinctItemsArray: T[],
  newDistinctItemsArray: T[],
  idKey?: string,
) => ArrItemMutation<T>[];
