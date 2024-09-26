import { getArrUpdateOps, derived, signal } from "../imported/index";
import { createTextNode } from "../dom/index";
import type { ForProps } from "../types";

export const TextNode = createTextNode;

export const ForNode = <T>({ subject, map }: ForProps<T>) => {
  let oldList: T[] = subject.value;
  const list = derived((oldVal: T[] | null) => {
    oldList = oldVal || oldList;
    return subject.value;
  });
  const oldArr = oldList.map((item, i) => ({
    index: i,
    value: item,
  }));
  const newArr = list.value.map((item, i) => ({
    index: i,
    value: item,
  }));
  const diffs = getArrUpdateOps(oldArr, newArr);

  const nodes = derived(() =>
    subject.value.map((item, index) => {
      const itemSignal = signal(item);
      const indexSignal = signal(index);
      const node = map(itemSignal, indexSignal);
      return node;
    })
  );

  return nodes;
};
