import { getArrayMutations } from "../../../utils/immutjs";
import {
  source,
  derived,
  valueIsSignal,
  type Signal,
  type SourceSignal,
} from "../../../utils/signal";
import type {
  CustomNodeFor,
  ForProps,
  MutableMapFn,
  Child,
  Object,
} from "../../../index-types.ts";

type SignalledObject<T> = {
  indexSignal: SourceSignal<number>;
  itemSignal: SourceSignal<T>;
  mappedChild: Child;
};

const getSignalledObject = <T extends object>(
  item: T,
  i: number,
  map: MutableMapFn<T>
): SignalledObject<T> => {
  const indexSignal = source(i);
  const itemSignal = source(item);

  return {
    indexSignal,
    itemSignal,
    mappedChild: map(itemSignal, indexSignal),
  };
};

const getChildrenAfterInjection = (
  children: Child[],
  n?: number,
  nthChild?: () => Child
) => {
  if (n !== undefined && n >= 0 && nthChild) {
    const injectingIndex = n > children.length ? children.length : n;
    children.splice(injectingIndex, 0, nthChild());
  }
  return children;
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
export const customeNodeFor: CustomNodeFor = <T>({
  items,
  itemIdKey,
  map,
  mutableMap,
  n,
  nthChild,
}: ForProps<T>) => {
  if ((nthChild && n === undefined) || (n !== undefined && !nthChild)) {
    throw new Error(
      "Either both 'n' and 'nthChild' be passed or none of them."
    );
  }

  const list = valueIsSignal(items)
    ? (items as Signal<T[]>)
    : source(items as T[]);

  if (map) {
    if (itemIdKey || mutableMap) {
      throw new Error(
        "if 'map' is provided, 'itemIdKey' and 'mutableMap' is uncessary."
      );
    }
    return derived(() =>
      getChildrenAfterInjection(list.value.map(map), n, nthChild)
    );
  }

  const itemsValue = list.value;
  if (!mutableMap) throw new Error("mutableMap is missing");
  if (itemsValue.length && typeof itemsValue[0] !== "object")
    throw new Error("for mutable map, item in the list must be an object");

  let oldList: Object<T>[] | null = null;
  const newList = derived((oldVal: Object<T>[] | undefined) => {
    oldList = oldVal || oldList;
    return (list as Signal<Object<T>[]>).value;
  });

  const signalledItemsMap = derived<SignalledObject<T>[]>((oldMap) => {
    if (!oldMap || !oldList) {
      const initialItems = newList.value;
      return initialItems.map((item, i) =>
        getSignalledObject(item as Object<T>, i, mutableMap)
      );
    }

    const muts = getArrayMutations(oldList, newList.value, itemIdKey);

    return muts.map((mut, i) => {
      const oldObject = oldMap[mut.oldIndex];
      console.assert(
        (mut.type === "add" && mut.oldIndex === -1 && !oldObject) ||
          (mut.oldIndex > -1 && !!oldObject),
        "In case of mutation type 'add' oldIndex should be '-1', or else oldIndex should always be a non-negative integer."
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

  const nodesSignal = derived(() =>
    getChildrenAfterInjection(
      signalledItemsMap.value.map((ob) => ob.mappedChild),
      n,
      nthChild
    )
  );

  return nodesSignal;
};
