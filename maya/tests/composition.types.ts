import { signal, type Signal } from "@cyftec/signals";
import { component } from "../src/core/component.ts";
import { m } from "../src/core/elements/m.ts";
import type { InnerFragment } from "../src/core/fragment.ts";
import type { Children } from "../src/core/types.ts";

type Equal<Left, Right> =
  (<T>() => T extends Left ? 1 : 2) extends <T>() => T extends Right ? 1 : 2
    ? true
    : false;
type Assert<T extends true> = T;

type RowProps = { children: string[] };

export type RowInnerChildrenAreSignal = Assert<
  Equal<
    Parameters<InnerFragment<RowProps, any>>[0]["children"],
    Signal<string[]>
  >
>;

type ChildrenProps = { children: Children };

export type ChildrenInnerChildrenRemainChildren = Assert<
  Equal<
    Parameters<InnerFragment<ChildrenProps, any>>[0]["children"],
    Children
  >
>;

export const Row = component<RowProps>((props) =>
  m.Div({ children: props.children }),
);

Row({ children: ["plain"] });
Row({ children: signal(["reactive"]) });
