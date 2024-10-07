import { Component, derived, dString, m, signal } from "@maya/core";

type TodoTileProps = {
  index: number;
  task: string;
  isDone: boolean;
  onDoneChange: (index: number) => void;
  onDelete: (index: number) => void;
  isLast: boolean;
};

let TodoTileRenderCount = 0;

export const TodoTile = Component<TodoTileProps>(
  ({ index, task, isDone, onDoneChange, onDelete, isLast }) => {
    console.log(`Todo Tile rendered ${++TodoTileRenderCount} times`);
    const bgColor = signal("bg-light-transparent");
    const textColor = derived(() => (!isDone.value ? `dark-green` : ""));

    const toggleBgColor = () =>
      (bgColor.value =
        bgColor.value === "bg-light-yellow"
          ? "bg-light-transparent"
          : "bg-light-yellow");

    return m.Div({
      children: [
        m.Div({
          class: dString`flex items-center mv1 ph1 pv1 pointer ${bgColor} ${textColor}`,
          onclick: () => onDoneChange(index.value),
          onunmount: () => console.log(`tile ${index.value + 1} unmounted`),
          children: [
            m.Span({
              class: dString`flex-grow-1 ${() =>
                isDone.value ? "strike" : ""}`,
              onunmount: () =>
                console.log(
                  `SPAN inside tile no. ${index.value + 1} with text "${
                    task.value
                  }" unmounted :(`
                ),
              children: m.Text(task.value),
            }),
            m.Div({
              class: "flex items-center",
              children: [
                m.Button({
                  class: `mr2`,
                  onclick: (e) => {
                    toggleBgColor();
                    e.stopPropagation();
                  },
                  children: m.Text("h"),
                }),
                m.Button({
                  onclick: (e) => {
                    onDelete(index.value);
                    e.stopPropagation();
                  },
                  children: m.Text("x"),
                }),
              ],
            }),
          ],
        }),
        m.Div({
          class: derived(() => (isLast.value ? "b--transparent" : "")),
        }),
      ],
    });
  }
);
