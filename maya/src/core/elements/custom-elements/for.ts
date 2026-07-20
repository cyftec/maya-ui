import { getArrayMutations } from "@cyftec/immut";
import {
  derive,
  signal,
  value,
  valueIsSignal,
  type DerivedSignal,
  type MaybeSignal,
  type Signal,
  type SignalifiedObject,
  type SourceSignal,
} from "@cyftec/signal";
import type { Child, MHtmlElement, MHtmlElementGetter } from "../../types";

type PlainMapFn<Item> = (item: Item, index: number) => Child;

type MutableMapFn<Item extends Record<string, any>> = (
  item: DerivedSignal<Item>,
  index: DerivedSignal<number>,
) => Child;

type MappedChild<Item extends Record<string, any>> = {
  indexSignal: SourceSignal<number>;
  itemSignal: SourceSignal<Item>;
  mappedChild: Child;
};

type ForReturnType<Subject extends MaybeSignal<any[]>> = [any[]] extends [
  Subject,
]
  ? Child[]
  : DerivedSignal<Child[]>;

const getMappedChild = <Item extends Record<string, any>>(
  item: Item,
  i: number,
  mutableMap: MutableMapFn<Item>,
): MappedChild<Item> => {
  const indexSignal = signal(i);
  const itemSignal = signal(item) as SourceSignal<typeof item>;
  const child = mutableMap(
    derive(() => itemSignal.value as Item),
    derive(() => indexSignal.value),
  );
  let mappedChild: Child;
  let elem: MHtmlElement<HTMLElement>;
  let computedMHtmlElementGetterOnce = false;

  if ((child as MHtmlElementGetter)?.isElementGetter) {
    mappedChild = (() => {
      if (computedMHtmlElementGetterOnce && elem) return elem;

      elem = (child as MHtmlElementGetter)();
      computedMHtmlElementGetterOnce = true;
      return elem;
    }) as MHtmlElementGetter;
    mappedChild.isElementGetter = true;
  } else if (!child || typeof child === "string") {
    mappedChild = child || "";
  } else {
    throw `One of the child, ${child} passed in ForElement is invalid.`;
  }

  return { indexSignal, itemSignal, mappedChild };
};

const getChildrenAfterInjection = (
  children: Child[],
  n?: number,
  nthChild?: Child,
) => {
  if (n !== undefined && n >= 0 && nthChild) {
    const injectingIndex = n > children.length ? children.length : n;
    children.splice(injectingIndex, 0, nthChild);
  }
  return children;
};

/**
 * For is a maya-custom-element which takes 'subject' (a list) and a 'map' method
 * and returns a signal of list of maya-html-elements.
 * 
 * For mutable nodes list, 'itemKey' must be provided, for which item in 'itmes' must be
 * an object and 'itemKey' is the name of field in item whose value are unique among
 * all items. Similar to an id field in an SQL record (object).
 * 
 * Mutable nodes doesn't get recreated when input 'subject' value gets changed,
 * rather nodes remain the same and only individual item (as signal) value
 * changes and subsequently updates the nodes.
 * 
 * If 'itemKey' is provided, then only any update in item is checked during diff,
 * otherwise any mutation in the item is considered as new item
 * being created and old item being destroyed.
 * 
 * for example, consider this list of tasks and its corresponding list tiles
 * 
 * ```
 * //// JS
 * const tasks = [
    { id: 0, text: "some task", isDone: false },
    { id: 1, text: "other task", isDone: true },
   ];
   
   //// UI
   // |-------------------|
   // |  some task        |
   // |-------------------|
   // |  other task ✓✓✓✓ |
   // |-------------------|
 * ```
   
 * 1. WHEN `itemKey = undefined`
 * 
 * if `tasks[1].text` is changed from "other task" to "another task", it will
 * result in new list tile element created and appended to the DOM. All previous
 * UI mutations like change in CSS color property will be lost.
 * 
 * 2. WHEN `itemKey = "id"`
 * 
 * if `tasks[1].text` is changed from "other task" to "another task", it will result in
 * individual item (`tasks[1]`) signal being updated with new value. This item signal
 * will ultimately trigger the UI mutation in existing list tile element in the DOM.
 *
 * @param props
 * @returns a derived signal of a list of maya-html-elements
 * 
 */
export const forElement = <
  Subject extends MaybeSignal<any[]>,
  ItemKey extends Subject extends SignalifiedObject<(infer Item)[]>
    ? Item extends Record<string, any>
      ? keyof Item | undefined
      : undefined
    : undefined,
>({
  subject,
  itemKey,
  map,
  n,
  nthChild,
}: {
  subject: Subject;
  itemKey?: ItemKey;
  map: Subject extends (infer Item)[]
    ? PlainMapFn<Item>
    : Subject extends SignalifiedObject<(infer Item)[]>
      ? Item extends Record<string, any>
        ? [ItemKey] extends [keyof Item]
          ? MutableMapFn<Item>
          : PlainMapFn<Item>
        : PlainMapFn<Item>
      : never;
  n?: number;
  nthChild?: Child;
}): ForReturnType<typeof subject> => {
  if (
    (nthChild && n === undefined) ||
    (n !== undefined && n > -1 && !nthChild)
  ) {
    throw new Error(
      "Either both 'n' and 'nthChild' be passed or none of them.",
    );
  }
  let injectableChild: Child = nthChild;
  if (nthChild && typeof nthChild !== "string") {
    const element = nthChild();
    const injectable: MHtmlElementGetter = () => element;
    injectable.isElementGetter = true;
    injectableChild = injectable;
  }

  if (!itemKey) {
    const elementsGetter = () =>
      getChildrenAfterInjection(
        value(subject).map(map as PlainMapFn<any>),
        n,
        injectableChild,
      );

    return (
      valueIsSignal(subject) ? derive(elementsGetter) : elementsGetter()
    ) as ForReturnType<typeof subject>;
  }

  /**
   * Mutable nodes list logic below
   */

  const itemsValue = value(subject);
  if (itemsValue.length && typeof itemsValue[0] !== "object")
    throw new Error("for mutable map, item in the list must be an object");

  const list = derive(() => {
    const items = value(subject) as Record<string, any>[];
    if (!Array.isArray(items))
      throw `subject must be an array or signalified-object of array, found ${JSON.stringify(subject)}`;

    return items;
  });

  type SubjectItem = Record<string, any>;
  let previousItems: SubjectItem[] | null = null;
  const currentItems = derive((prevItems: SubjectItem[] | undefined) => {
    previousItems = prevItems || previousItems;
    return (list as Signal<SubjectItem[]>).value;
  });

  const mappedChildren = derive<MappedChild<SubjectItem>[]>(
    (prevMappedChildren) => {
      if (!prevMappedChildren || !previousItems) {
        const initialItems = currentItems.value;
        return initialItems.map((item, i) =>
          getMappedChild(
            item as SubjectItem,
            i,
            map as MutableMapFn<SubjectItem>,
          ),
        );
      }

      const muts = getArrayMutations(
        previousItems,
        currentItems.value,
        itemKey as string,
      );

      return muts.map((mut, i) => {
        const oldMappedChild = (prevMappedChildren || [])[mut.oldIndex];
        console.assert(
          (mut.type === "add" && mut.oldIndex === -1 && !oldMappedChild) ||
            (mut.oldIndex > -1 && !!oldMappedChild),
          "In case of mutation type 'add' oldIndex should be '-1', or else oldIndex should always be a non-negative integer.",
        );

        if (oldMappedChild) {
          if (mut.type === "shuffle") {
            oldMappedChild.indexSignal.value = i;
          }

          if (mut.type === "update") {
            oldMappedChild.indexSignal.value = i;
            oldMappedChild.itemSignal.value = { ...mut.value };
          }

          return oldMappedChild;
        }

        return getMappedChild(mut.value, i, map as MutableMapFn<SubjectItem>);
      });
    },
  );

  const mappedChildrenSignal = derive(() =>
    getChildrenAfterInjection(
      mappedChildren.value.map((item) => item.mappedChild),
      n,
      injectableChild,
    ),
  );

  return mappedChildrenSignal as ForReturnType<typeof subject>;
};
