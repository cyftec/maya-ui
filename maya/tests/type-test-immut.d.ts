export const getArrayMutations: (...args: any[]) => Array<{
  type: string;
  oldIndex: number;
  newIndex: number;
  value: any;
}>;
