import { derived, signal, type SureSignalProps } from "@maya/core";
import type { AppStoreAsProps } from "./types";

export const getTodoAppStore = (): SureSignalProps<AppStoreAsProps> => {
  const searchText = signal("");
  const tasks = signal([
    { id: 0, text: "woke up @7am already", isDone: false },
    { id: 1, text: "was about to bathe, but skipped it", isDone: false },
    { id: 2, text: "devoured a lot of food", isDone: false },
    { id: 3, text: "I swear, won't eat that much again", isDone: false },
  ]);
  const newId = derived(() => tasks.value.length);

  const setSearchText = (value: string) => {
    searchText.value = value;
  };

  const addTodo = () => {
    if (searchText.value) {
      tasks.value = [
        ...tasks.value,
        { id: newId.value, text: searchText.value, isDone: false },
      ];
    }
    setSearchText("");
  };

  const onDelete = (tileIndex: number) => {
    console.log(`deleting tile no ${tileIndex}`);
    tasks.value = tasks.value.filter((_, i) => i !== tileIndex);
  };

  const onDoneChange = (tileIndex: number) => {
    const updatedTasks = tasks.value.slice();
    const taskToUpdate = updatedTasks[tileIndex];
    updatedTasks[tileIndex].isDone = !taskToUpdate.isDone;

    tasks.value = updatedTasks;
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
