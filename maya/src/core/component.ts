import type { Child } from "./types";
import { fragment, type Fragment, type InnerFragment } from "./fragment";

type InnerComponent<P extends Record<string, any>> = InnerFragment<P, Child>;

export type Component<P extends Record<string, any>> = Fragment<P, Child>;

export const component = <P extends Record<string, any>>(
  innerComponent: InnerComponent<P>,
): Component<P> => fragment<P, Child>(innerComponent);
