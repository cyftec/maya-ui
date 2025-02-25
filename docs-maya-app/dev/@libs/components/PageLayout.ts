import { dstring, effect, Signal } from "@cyftech/signal";
import { Child, Children, component, m, MHtmlElement } from "@mufw/maya";
import { Navbar } from "../elements";

type PageLayoutProps = {
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

export const PageLayout = component<PageLayoutProps>(
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

    return m.Div({
      children: [
        m.Div({
          class: dstring`mb3 flex-ns flex-wrap items-center ${headerClassNames}`,
          children: [
            m.H1({
              class: "mr3 mv2 mv3-ns",
              children: headerTitle,
            }),
            m.If({
              subject: headerComponent,
              isTruthy: headerComponent as Child,
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
              onmount: (elem) => (contentElement = elem),
              class: dstring`fg7 pb5 w-70-ns mw-100 w-auto-ns max-h-80 overflow-y-scroll
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
      ],
    });
  }
);
