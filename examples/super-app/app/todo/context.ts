import { indexedArraySignal, signal } from "@ckzero/maya/signal";
import type { SureSignalProps } from "@maya/core";
import type { AppStoreAsProps, Task } from "./types";

export const getTodoAppStore = (): SureSignalProps<AppStoreAsProps> => {
  const searchText = signal("");
  const tasks = indexedArraySignal<Task>([
    { text: "woke up @7am already", isDone: false },
    { text: "was about to bathe, but skipped it", isDone: false },
    { text: "devoured a lot of food", isDone: false },
    { text: "I swear, won't eat that much again", isDone: false },
  ]);

  const setSearchText = (value: string) => {
    searchText.value = value;
  };

  const addTodo = () => {
    if (searchText.value) tasks.add({ text: searchText.value, isDone: false });
    setSearchText("");
  };

  const onDelete = (tileIndex: number) => {
    tasks.remove(tileIndex);
  };

  const onDoneChange = (tileIndex: number) => {
    const taskToUpdate = tasks().find((task) => task._index === tileIndex);
    if (!taskToUpdate) {
      console.error("task not found");
      return;
    }

    tasks.update(tileIndex, {
      ...taskToUpdate,
      isDone: !taskToUpdate.isDone,
    });
  };

  return {
    searchText,
    tasks,
    setSearchText,
    addTodo,
    onDelete,
    onDoneChange,
  };
};
