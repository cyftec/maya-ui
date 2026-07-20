import { Child, component, m } from "@cyftec/maya/core";
import { derive, signal } from "@cyftec/maya/signal";
import { Button, TitledList } from "../elements";
import { NavigatorPage } from "./NavigatorPage";
import { Page } from "./Page";
type Chapter = {
  title: string;
  topics: {
    title: string;
    article: Child;
  }[];
};

type ChaptersPageProps = {
  htmlTitle: string;
  pageTitle: string;
  chapters: Chapter[];
  headElements?: Child[];
};

export const ChaptersPage = component<ChaptersPageProps>(
  ({ htmlTitle, pageTitle, headElements, chapters }) => {
    const selectedTopicPathIndeces = signal([0, 0]);
    const scrollToTopTrigger = signal(0);

    const selectedTopic = derive(() => {
      const [chapterIndex, topicIndex] = selectedTopicPathIndeces.value;
      return chapters.value[chapterIndex].topics[topicIndex];
    });
    const { title: topicTitle, article: TopicArticle } = selectedTopic.props();

    const selectedTopicPathNames = derive(() => {
      const [chapterIndex, topicIndex] = selectedTopicPathIndeces.value;
      return [
        chapters.value[chapterIndex].title,
        chapters.value[chapterIndex].topics[topicIndex].title,
      ];
    });

    const adjacentTopicsPathIndices = derive(() => {
      const [chapterIndex, topicIndex] = selectedTopicPathIndeces.value;

      let prevChapterIndex = chapterIndex;
      let prevTopicIndex = topicIndex - 1;
      if (!chapters.value[prevChapterIndex]?.topics[prevTopicIndex]) {
        prevChapterIndex = chapterIndex - 1;
        prevTopicIndex =
          chapters.value[prevChapterIndex]?.topics.length - 1 || -1;
      }

      let nextChapterIndex = chapterIndex;
      let nextTopicIndex = topicIndex + 1;
      if (!chapters.value[nextChapterIndex]?.topics[nextTopicIndex]) {
        nextChapterIndex = chapterIndex + 1;
        nextTopicIndex = 0;
      }

      return {
        prevChapterIndex,
        prevTopicIndex,
        nextChapterIndex,
        nextTopicIndex,
      };
    });

    const adjacentTopics = derive(() => {
      const {
        prevChapterIndex,
        prevTopicIndex,
        nextChapterIndex,
        nextTopicIndex,
      } = adjacentTopicsPathIndices.value;

      const prevTopic = chapters.value[prevChapterIndex]?.topics[prevTopicIndex]
        ? {
            isNext: false,
            pathIndices: [prevChapterIndex, prevTopicIndex],
            chapterTitle: chapters.value[prevChapterIndex].title,
            title:
              chapters.value[prevChapterIndex].topics[prevTopicIndex].title,
          }
        : undefined;

      const nextTopic = chapters.value[nextChapterIndex]?.topics[nextTopicIndex]
        ? {
            isNext: true,
            pathIndices: [nextChapterIndex, nextTopicIndex],
            chapterTitle: chapters.value[nextChapterIndex].title,
            title:
              chapters.value[nextChapterIndex].topics[nextTopicIndex].title,
          }
        : undefined;

      return [prevTopic, nextTopic].filter((topic) => !!topic);
    });

    return Page({
      title: htmlTitle,
      headElements: headElements,
      app: NavigatorPage({
        headerTitle: pageTitle,
        headerComponent: m.Div({
          class: "flex flex-wrap items-end f7 b silver light-silver-ns",
          children: m.For({
            subject: selectedTopicPathNames,
            map: (pathName) =>
              m.Div({
                class: `mb2 mb0-ns`,
                children: [
                  m.Span({ class: "mh1 mh2-ns", children: "/" }),
                  m.Span({
                    class: "pa1 ph2-ns mh1 br3 pointer",
                    children: pathName,
                  }),
                ],
              }),
          }),
        }),
        navbarComponent: m.For({
          subject: chapters,
          map: ({ title, topics }, chapterIndex) =>
            TitledList({
              classNames: "mb0 mb4-ns pb3",
              titleClassNames: "f4",
              itemClassNames: "mb3 f6 lh-title",
              linkColorCss: "theme-col",
              title: `${chapterIndex + 1}. ${title}`,
              onLinkClick: (linkIndex) =>
                (selectedTopicPathIndeces.value = [chapterIndex, linkIndex]),
              links: derive(() =>
                topics.map((topic, topicIndex) => {
                  const [selectedChapter, selectedTopic] =
                    selectedTopicPathIndeces.value;
                  return {
                    title: topic.title,
                    isSelected:
                      selectedChapter === chapterIndex &&
                      selectedTopic === topicIndex,
                  };
                }),
              ),
            }),
          n: Infinity,
          nthChild: m.P({
            class: "gray f6",
            children: "** end of list **",
          }),
        }),
        contentTitle: topicTitle,
        scrollToTopCounterSignal: scrollToTopTrigger,
        contentComponent: [
          TopicArticle,
          m.Div({
            class: "flex-ns justify-stretch mv4 w-100",
            children: m.For({
              subject: adjacentTopics,
              n: 1,
              nthChild: m.Div({
                class: derive(() =>
                  adjacentTopics.value.length > 1 ? "mh3" : "",
                ),
              }),
              map: (topic) =>
                Button({
                  classNames: "w-100 mt3",
                  onClick: () => {
                    selectedTopicPathIndeces.value = topic.pathIndices;
                    scrollToTopTrigger.value++;
                  },
                  label: m.Div({
                    class: "tc",
                    children: [
                      topic.isNext
                        ? "Next Topic &rarr;"
                        : "&larr; Previous Topic",
                      m.Div({
                        class: "f7 mt1",
                        children: [
                          m.Span({
                            class: "silver",
                            children: topic.chapterTitle + ": ",
                          }),
                          m.Span({
                            class: "black",
                            children: topic.title,
                          }),
                        ],
                      }),
                    ],
                  }),
                }),
            }),
          }),
        ],
      }),
    });
  },
);
