import { Component, derived, m } from "@maya/core";
import { Header } from "../../@elements";
import type { AppStoreAsProps } from "../types";
import { TodoTile } from "./todo-tile";

type TodosProps = {
  classNames?: string;
  tasks: AppStoreAsProps["tasks"];
  onDelete: (tileIndex: number) => void;
  onDoneChange: (tileIndex: number) => void;
};
let TodoContainerRenderCount = 0;

export const Todos = Component<TodosProps>(
  ({ classNames, tasks, onDelete, onDoneChange }) => {
    console.log(`Todo Container rendered ${++TodoContainerRenderCount} times`);
    const totalTasksTitle = derived(() => `total task: ${tasks.value.length}`);
    const doneTasksTitle = derived(
      () => `done: ${tasks.value.filter((t) => t.isDone).length}`
    );

    return m.Div({
      class: `pa3 bg-near-white br4 ${classNames}`,
      children: [
        m.Div({
          class: "flex items-center justify-between",
          children: [
            Header({ classNames: "mv3", title: totalTasksTitle }),
            Header({ classNames: "mv3", title: doneTasksTitle }),
          ],
        }),
        m.Div({
          class: ``,
          onunmount: () =>
            console.log(`Div containing all Todo-Tiles unmounted`),
          children: [
            m.Div({
              children: m.For({
                items: tasks,
                itemIdKey: "id",
                mutableMap: (task, i) => {
                  const textSig = derived(() => task.value.text);
                  const isDoneSig = derived(() => task.value.isDone);
                  const isLastSig = derived(
                    () => i.value === tasks.value.length - 1
                  );
                  return TodoTile({
                    task: textSig,
                    index: i,
                    isDone: isDoneSig,
                    onDoneChange,
                    onDelete,
                    isLast: isLastSig,
                  });
                },
              }),
            }),
            m.P({
              class: "pr3 flex items-center justify-center",
              children: m.Text("----- end of tasks -----"),
            }),
          ],
        }),
      ],
    });
  }
);
