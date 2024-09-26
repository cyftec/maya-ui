import type { IndexedArraySignal } from "@ckzero/maya/signal";

export type Task = {
  text: string;
  isDone: boolean;
};

export type AppStoreAsProps = {
  searchText: string;
  tasks: IndexedArraySignal<Task>;
  setSearchText: (value: string) => void;
  addTodo: () => void;
  onDelete: (tileIndex: number) => void;
  onDoneChange: (tileIndex: number) => void;
};
