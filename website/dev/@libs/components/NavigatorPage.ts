import { Child, Children, m, MHtmlElement } from "@cyftec/maya";
import { effect, Signal, tmpl } from "@cyftec/maya/signal";
import { fragment } from "../../../../maya/core/fragment";
import { Navbar } from "../elements";

type NavigatorPageProps = {
  headerClassNames?: string;
  headerTitle: string;
  headerComponent?: Child;
  navbarClassNames?: string;
  navbarComponent: Children;
  contentClassNames?: string;
  contentTitle: string;
  contentComponent: Children;
  scrollToTopCounterSignal?: Signal<number>;
};

export const NavigatorPage = fragment<NavigatorPageProps, Child[]>(
  ({
    headerClassNames,
    headerTitle,
    headerComponent,
    navbarClassNames,
    navbarComponent,
    contentClassNames,
    contentTitle,
    contentComponent,
    scrollToTopCounterSignal,
  }) => {
    let contentElement: MHtmlElement;
    effect(() => {
      if (scrollToTopCounterSignal?.value) {
        contentElement.scrollTo({ top: 0 });
      }
    });

    return [
      m.Div({
        class: tmpl`mt3 mb5 flex-ns flex-wrap items-end ${headerClassNames}`,
        children: [
          m.H1({
            class: "mr3 mv2 mv1-ns",
            children: headerTitle,
          }),
          m.If({
            subject: headerComponent,
            isTruthy: () => headerComponent as Child,
          }),
        ],
      }),
      m.Div({
        class: "flex w-100 w-auto-ns",
        children: [
          Navbar({
            classNames: navbarClassNames,
            children: navbarComponent,
          }),
          m.Div({
            onmount: (elem: MHtmlElement) => (contentElement = elem),
            class: tmpl`fg7 pb5 w-70-ns mw-100 w-auto-ns max-h-80 overflow-y-scroll
              dark-gray gray-ns lh-copy-ns lh-title ${contentClassNames}`,
            children: [
              m.H2({
                class: "mt0 lh-solid black mid-gray-ns",
                children: contentTitle,
              }),
              m.Div({
                class: "",
                children: contentComponent,
              }),
            ],
          }),
        ],
      }),
    ];
  },
);
