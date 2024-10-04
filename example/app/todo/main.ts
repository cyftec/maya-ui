import { Component, defaultHtmlPageNode, defaultMetaTags, m } from "@maya/core";
import { Button, Header, TextBox } from "../@elements";
import { Todos } from "./@components";
import type { AppStoreAsProps } from "./types";
import { getTodoAppStore } from "./context";

const TodoApp = Component<AppStoreAsProps>(
  ({ searchText, tasks, setSearchText, addTodo, onDelete, onDoneChange }) => {
    const onTextChange = (e: KeyboardEvent) => {
      if (e.key === "Enter") {
        addTodo();
        return;
      }

      setSearchText(searchText.value + e.key);
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

export const page = () =>
  m.Html({
    lang: "en",
    children: [
      m.Head({
        children: [
          ...defaultMetaTags(),
          m.Title({
            children: m.Text("Todo app"),
          }),
          m.Link({
            rel: "stylesheet",
            href: "https://unpkg.com/tachyons@4.12.0/css/tachyons.min.css",
          }),
          m.Link({
            rel: "stylesheet",
            href: "./sample-assets/styles.css",
          }),
        ],
      }),
      m.Body({
        children: [
          m.Script({
            src: "main.js",
            defer: "true",
          }),
          TodoApp(getTodoAppStore()),
        ],
      }),
    ],
  });
