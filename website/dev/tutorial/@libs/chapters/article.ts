import { m, type Child } from "@cyftec/maya";
import { runHighlightJsScriptOnMount } from "../../../@libs/utils";

export const Code = (code: string) =>
  m.Div({
    class: "mv3 pa3 br4 hljs overflow-auto",
    children: m.Pre({ class: "ma0", children: m.Code(code) }),
  });

export const Note = (children: Child) =>
  m.Div({
    class: "list bg-near-white pa3 mv3 bl bw4 br4 b--theme-col",
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
