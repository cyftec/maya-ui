import {
  derived,
  getArrayMutations,
  signal,
  type Signal,
} from "../../imported/index";
import type {
  ForCustomNode,
  ForProps,
  MutableMapFn,
  Node,
  SureObject,
} from "../../types";

type SignalledObject<T> = {
  indexSignal: Signal<number>;
  itemSignal: Signal<T>;
  mappedNode: Node;
};

const getSignalledObject = <T extends object>(
  item: T,
  i: number,
  map: MutableMapFn<T>
): SignalledObject<T> => {
  const indexSignal = signal(i);
  const itemSignal = signal(item);

  return {
    indexSignal,
    itemSignal,
    mappedNode: map(itemSignal, indexSignal),
  };
};

/**
 * For the case of 'mutableMap',
 * if 'itemIdKey' is provided, then only any update in item is checked during diff,
 * otherwise any mutation in the item is considered as new item
 * being created and old item being destroyed.
 * 
 * for example, consider this list of tasks and its corresponding list tiles
 * 
 * JS
 * const tasks = [
    { id: 0, text: "some task", isDone: false },
    { id: 1, text: "other task", isDone: true },
   ];
   
   UI
   |-------------------|
   |  some task        |
   |-------------------|
   |  other task ✓✓✓✓ |
   |-------------------|
 * 
 * 1. WHEN itemIdKey = undefined
   if tasks[1].text is changed from "other task" to "another task", it will result in
   new list tile element created and appended to the DOM. All previous
   UI mutations like change in CSS color property will be lost.
 * 
 * 2. WHEN itemIdKey = "id"
   if tasks[1].text is changed from "other task" to "another task", it will result in
   individual item signal being updated with new value. This item signal will
   ultimately trigger the UI mutation in existing list tile element in the DOM.
 */
/**
 *
 * @param param0 dfsgsdgfsfggs
 * @returns number
 */
export const forCustomNode: ForCustomNode = <T>({
  items,
  itemIdKey,
  map,
  mutableMap,
}: ForProps<T>) => {
  if (map) {
    if (itemIdKey || mutableMap)
      throw new Error(
        "if 'map' is provided, 'itemIdKey' and 'mutableMap' is uncessary."
      );
    return derived(() => items.value.map(map));
  }

  const itemsValue = items.value;
  if (!mutableMap) throw new Error("mutableMap is missing");
  if (itemsValue.length && typeof itemsValue[0] !== "object")
    throw new Error("for mutable map, item in the list must be an object");

  let oldList: SureObject<T>[] | null = null;
  const newList = derived((oldVal: SureObject<T>[] | null) => {
    oldList = oldVal || oldList;
    return (items as Signal<SureObject<T>[]>).value;
  });

  const signalledItemsMap = derived<SignalledObject<T>[]>((oldMap) => {
    if (oldMap === null || !oldList) {
      const initialItems = newList.value;
      return initialItems.map((item, i) =>
        getSignalledObject(item as SureObject<T>, i, mutableMap)
      );
    }

    const muts = getArrayMutations(oldList, newList.value, itemIdKey);

    return muts.map((mut, i) => {
      const oldObject = oldMap[mut.oldIndex];
      console.assert(
        (mut.type === "add" && mut.oldIndex === -1 && !oldObject) ||
          (mut.oldIndex > -1 && !!oldObject),
        "In case of mutation type 'add' oldIndex should be '-1', otherwise oldIndex should be non-negative integer."
      );

      if (oldObject) {
        if (mut.type === "shuffle") {
          oldObject.indexSignal.value = i;
        }

        if (mut.type === "update") {
          oldObject.indexSignal.value = i;
          oldObject.itemSignal.value = mut.value;
        }

        return oldObject;
      }

      return getSignalledObject(mut.value, i, mutableMap);
    });
  });

  const nodesSignal = derived(() => {
    return signalledItemsMap.value.map((ob) => ob.mappedNode);
  });

  return nodesSignal;
};
