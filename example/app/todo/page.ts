import { Component, defaultHtmlPageNode, m } from "@maya/core";
import { Button, Header, TextBox } from "../@elements";
import { Todos } from "./_components";
import type { AppStoreAsProps } from "./types";
import { getTodoAppStore } from "./context";

const TodoApp = Component<AppStoreAsProps>(
  ({ searchText, tasks, setSearchText, addTodo, onDelete, onDoneChange }) => {
    const onTextChange = (e: KeyboardEvent) => {
      if (e.key === "Enter") {
        addTodo();
        return;
      }

      setSearchText(e.key);
    };

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
              onkeypress: onTextChange,
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

const app = () => TodoApp(getTodoAppStore());

export const page = () => defaultHtmlPageNode("Todo app", app);
