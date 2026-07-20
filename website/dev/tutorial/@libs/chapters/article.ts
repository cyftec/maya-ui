import { m, type Child } from "@cyftec/maya/core";
import { runHighlightJsScriptOnMount } from "../../../@libs/utils";
import { Icon } from "../../../@libs/elements";
import { signal } from "@cyftec/maya/signal";

export const Code = (code: string) => {
  const iconName = signal("content_copy");
  const hint = signal("copy");

  const onCopy = () => {
    iconName.value = "done_all";
    hint.value = "copied";
    navigator.clipboard.writeText(code || "");
    setTimeout(() => {
      iconName.value = "content_copy";
      hint.value = "copy";
    }, 2000);
  };

  return m.Div({
    class: "mv3 pa3 br4 hljs overflow-auto",
    children: m.Pre({
      class: "ma0 relative",
      children: [
        m.Code(code),
        Icon({
          classNames: "absolute top-0 right-0 bg-white-30 br-100 pa1",
          hoverTitle: hint,
          name: iconName,
          onClick: onCopy,
        }),
      ],
    }),
  });
};

export const Note = (children: Child) =>
  m.Div({
    class: "list bg-white pa3 mv3 bl bw4 br4 b--theme-col",
    children,
  });

export const Article = (...children: any[]) =>
  m.Div({
    onmount: runHighlightJsScriptOnMount,
    children: children.flat(),
  });

export const Section = (title: string, ...children: Child[]) =>
  m.Div({
    class: "mt5 mb4",
    children: [m.H3({ class: "black", children: title }), ...children],
  });

export const Paragraphs = (...paragraphs: string[]) =>
  m.For({
    subject: paragraphs,
    map: (paragraph) => m.P({ class: "mt0 mb3", children: paragraph }),
  });

export const Bullets = (...items: Child[]) =>
  m.Ul({
    class: "mb4",
    children: m.For({
      subject: items,
      map: (item) => m.Li({ class: "mb2", children: item }),
    }),
  });
