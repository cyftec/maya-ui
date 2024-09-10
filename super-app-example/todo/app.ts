import { Component, m } from "@ckzero/maya/web";
import { Button, Header, TextBox } from "../_elements";
import { Todos } from "./_components";
import type { AppStoreAsProps } from "./types";
import { getTodoAppStore } from "./context";

const TodoApp = Component<AppStoreAsProps>(
  ({ searchText, tasks, setSearchText, addTodo, onDelete, onDoneChange }) => {
    return m.Div({
      class: "ph3",
      children: [
        Header({ title: "Todo App", variant: "large" }),
        m.Div({
          class: "mb3 flex items-center w-100",
          children: [
            TextBox({
              classNames: "mr3 pa3 flex-grow-1",
              value: searchText,
              onTextChange: (textBoxTex) => setSearchText(textBoxTex),
              onSubmit: addTodo,
            }),
            Button({
              classNames: "pa3",
              onTap: addTodo,
              label: "add",
            }),
          ],
        }),
        Todos({
          classNames: "mb3",
          tasks: tasks,
          onDelete,
          onDoneChange,
        }),
      ],
    });
  }
);

export const app = () => TodoApp(getTodoAppStore());
