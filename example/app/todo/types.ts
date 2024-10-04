import type { Signal } from "@maya/core";

export type Task = {
  id: number;
  text: string;
  isDone: boolean;
};

export type AppStoreAsProps = {
  searchText: string;
  tasks: Task[];
  setSearchText: (value: string) => void;
  addTodo: () => void;
  onDelete: (tileIndex: number) => void;
  onDoneChange: (tileIndex: number) => void;
};
