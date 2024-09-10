import { signal, type MaybeSignal, type Signal } from "./signal.ts";
import {
  getArrUpdateOperations,
  newVal,
  type IndexedArr,
  type IndexedArrItem,
  type IndexedArrItemWoIndex,
} from "@ckzero/value-utils";

export type IndexedArraySignal<T extends object> = {
  (): IndexedArr<T>;
  isIndexedArraySignal: boolean;
  add(newItem: T): void;
  remove(index: number): void;
  update(index: number, updatedItem: T): void;
  set: (newArray: T[]) => void;
  map<R>(mapFn: IndexedArrMapFn<T, R>): Signal<R[]>;
};
export type MaybeIndexedArraySignal<T extends object> =
  | T[]
  | IndexedArraySignal<T>;
export type IndexedArrMapFn<T extends object, R> = (
  arrItem: Signal<IndexedArrItemWoIndex<T>>,
  arrItemIndex: Signal<number>
) => R;
export type ArrSubscriberFn<T extends object> = (
  updatedArray: IndexedArr<T>
) => void;

export const valueIsArrSignal = (value: MaybeSignal<any>): boolean =>
  !!value?.isIndexedArraySignal;

export const indexedArraySignal = <T extends object>(
  objectArray: T[]
): IndexedArraySignal<T> => {
  const arrSig = signal(convertToIndexedArray(objectArray));
  const subscribers = new Set<ArrSubscriberFn<T>>();

  function convertToIndexedArray(array: T[]) {
    return array.map((item, index) => ({
      ...item,
      _index: index,
    }));
  }

  function getSortedIndicesArray(indexedArray: IndexedArr<T>) {
    return indexedArray.map((item, index) => ({
      ...item,
      _index: index,
    }));
  }

  function runSubscriptions(updatedArray: IndexedArr<T>) {
    subscribers.forEach((sub) => {
      sub(updatedArray);
    });
  }

  const getter = () => arrSig.value;

  getter.isIndexedArraySignal = true;

  getter.add = (newItem: T) => {
    const updatedArray: IndexedArr<T> = [
      ...arrSig.value,
      { ...newItem, _index: arrSig.value.length },
    ];
    runSubscriptions(updatedArray);
    arrSig.value = updatedArray;
  };

  getter.remove = (index: number) => {
    const updatedArray = arrSig.value.filter((item) => item._index !== index);
    runSubscriptions(updatedArray);
    arrSig.value = getSortedIndicesArray(updatedArray);
  };

  getter.update = (index: number, updatedItem: IndexedArrItem<T> | T) => {
    const updatedArray = arrSig.value.map((item) =>
      item._index === index ? { ...updatedItem, _index: index } : item
    );
    runSubscriptions(updatedArray);
    arrSig.value = getSortedIndicesArray(updatedArray);
  };

  getter.set = (newArray: T[]) => {
    const updatedArray = convertToIndexedArray(newArray);
    runSubscriptions(updatedArray);
    arrSig.value = getSortedIndicesArray(updatedArray);
  };

  getter.map = <R>(mapFn: IndexedArrMapFn<T, R>) => {
    let sigValue = newVal(arrSig.value);
    let itemAndIndexSignals = sigValue.map((item) => ({
      arrItem: signal({ ...item, _index: undefined }),
      arrItemIndex: signal(item._index),
    }));
    const mapSignal: Signal<R[]> = signal(
      sigValue.map((_, index) => {
        return mapFn(
          itemAndIndexSignals[index].arrItem,
          itemAndIndexSignals[index].arrItemIndex
        );
      })
    );
    let oldMapValue: R[] = mapSignal.value;

    subscribers.add((updatedArray) => {
      const diffs = getArrUpdateOperations(sigValue, updatedArray);
      const newMapValue = [] as R[];
      const newItemAndIndexSignals = [] as {
        arrItem: Signal<IndexedArrItemWoIndex<T>>;
        arrItemIndex: Signal<number>;
      }[];
      const oldIndicesToDelete = [] as number[];
      for (let i = 0; i < diffs.length; i++) {
        const diff = diffs[i];
        if (diff.type === "idle") {
          itemAndIndexSignals[diff.oldIndex as number].arrItemIndex.value =
            diff.value._index;
          newMapValue[diff.value._index] = oldMapValue[diff.oldIndex as number];
          newItemAndIndexSignals[diff.value._index] =
            itemAndIndexSignals[diff.oldIndex as number];
        } else if (diff.type === "update") {
          itemAndIndexSignals[diff.oldIndex as number].arrItemIndex.value =
            diff.value._index;
          itemAndIndexSignals[diff.oldIndex as number].arrItem.value =
            diff.value;
          newMapValue[diff.value._index] = oldMapValue[diff.oldIndex as number];
          newItemAndIndexSignals[diff.value._index] =
            itemAndIndexSignals[diff.oldIndex as number];
        } else if (diff.type === "delete") {
          oldIndicesToDelete.push(diff.oldIndex as number);
        } else {
          console.assert(diff.type === "add", `wrong diff type ${diff.type}`);
          newItemAndIndexSignals[diff.value._index] = {
            arrItem: signal(diff.value),
            arrItemIndex: signal(diff.value._index),
          };
          newMapValue[diff.value._index] = mapFn(
            newItemAndIndexSignals[diff.value._index].arrItem,
            newItemAndIndexSignals[diff.value._index].arrItemIndex
          );
        }
      }
      mapSignal.value = newMapValue;
      oldMapValue = newVal(newMapValue);
      itemAndIndexSignals = newItemAndIndexSignals;
      sigValue = newVal(
        updatedArray.map((item, i) => ({ ...item, _index: i }))
      );
    });

    return mapSignal;
  };

  return getter;
};
