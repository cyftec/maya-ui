import {
  derived,
  getArrUpdateOps,
  signal,
  valueIsSignal,
  type Signal,
} from "../imported/index";
import type {
  ForCustomNode,
  ForProps,
  TextCustomNode,
  TextNode,
} from "../types";

export const textCustomNode: TextCustomNode = (text) => {
  const getTextNode = (textValue: string) => {
    const textNode = document.createTextNode(textValue) as TextNode;
    textNode.nodeId = 0;
    textNode.unmountListener = undefined;
    return textNode;
  };

  if (valueIsSignal(text)) {
    return derived(() => getTextNode((text as Signal<string>).value));
  } else {
    return getTextNode(text as string);
  }
};

export const forCustomNode: ForCustomNode = <T>({
  subject,
  map,
}: ForProps<T>) => {
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

      return map(itemSignal, indexSignal);
    })
  );

  return nodes;
};
