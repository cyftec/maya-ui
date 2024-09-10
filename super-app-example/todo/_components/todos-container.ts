import { Header } from "../../_elements";
import type { Task } from "../types";
import { TodoTile } from "./todo-tile";
import { derived, type IndexedArraySignal } from "@ckzero/maya/signal";
import { Component, m } from "@ckzero/maya/web";

type TodosProps = {
  classNames?: string;
  tasks: IndexedArraySignal<Task>;
  onDelete: (tileIndex: number) => void;
  onDoneChange: (tileIndex: number) => void;
};
let TodoContainerRenderCount = 0;

export const Todos = Component<TodosProps>(
  ({ classNames, tasks, onDelete, onDoneChange }) => {
    console.log(`Todo Container rendered ${++TodoContainerRenderCount} times`);
    const totalTasksTitle = derived(() => `total task: ${tasks().length}`);
    const doneTasksTitle = derived(
      () => `done: ${tasks().filter((t) => t.isDone).length}`
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
              children: tasks.map((task, i) => {
                const textSig = derived(() => task.value.text);
                const isDoneSig = derived(() => task.value.isDone);
                const isLastSig = derived(() => i.value === tasks().length - 1);
                return TodoTile({
                  task: textSig,
                  index: i,
                  isDone: isDoneSig,
                  onDoneChange,
                  onDelete,
                  isLast: isLastSig,
                });
              }),
            }),
            m.P({
              class: "pr3 flex items-center justify-center",
              innerText: "----- end of tasks -----",
            }),
          ],
        }),
      ],
    });
  }
);
