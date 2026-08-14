import { Child, component, m } from "@cyftec/maya/core";
import { derive, signal } from "@cyftec/maya/signals";
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

type TopicPath = [chapterIndex: number, topicIndex: number];

type ChaptersPageProps = {
  htmlTitle: string;
  pageTitle: string;
  chapters: Chapter[];
  headElements?: Child[];
};

export const ChaptersPage = component<ChaptersPageProps>(
  ({ htmlTitle, pageTitle, headElements, chapters }) => {
    const selectedTopicPathIndeces = signal<TopicPath>([0, 0]);
    const scrollToTopTrigger = signal(0);

    const getTopicAtPath = ([chapterIndex, topicIndex]: TopicPath) => {
      const chapter = chapters.value[chapterIndex];
      const topic = chapter?.topics[topicIndex];
      if (!chapter || !topic) {
        throw new Error(
          `No topic exists at chapter ${chapterIndex}, topic ${topicIndex}.`,
        );
      }
      return { chapter, topic };
    };

    const selectedTopic = derive(() => {
      return getTopicAtPath(selectedTopicPathIndeces.value).topic;
    });
    const { title: topicTitle, article: TopicArticle } = selectedTopic.props();

    const selectedTopicPathNames = derive(() => {
      const { chapter, topic } = getTopicAtPath(
        selectedTopicPathIndeces.value,
      );
      return [chapter.title, topic.title];
    });

    const adjacentTopicsPathIndices = derive(() => {
      const [chapterIndex, topicIndex] = selectedTopicPathIndeces.value;

      let prevChapterIndex = chapterIndex;
      let prevTopicIndex = topicIndex - 1;
      if (!chapters.value[prevChapterIndex]?.topics[prevTopicIndex]) {
        prevChapterIndex = chapterIndex - 1;
        const previousTopicCount =
          chapters.value[prevChapterIndex]?.topics.length ?? 0;
        prevTopicIndex = previousTopicCount - 1;
      }

      let nextChapterIndex = chapterIndex;
      let nextTopicIndex = topicIndex + 1;
      if (!chapters.value[nextChapterIndex]?.topics[nextTopicIndex]) {
        nextChapterIndex = chapterIndex + 1;
        nextTopicIndex = 0;
      }

      return {
        previous: [prevChapterIndex, prevTopicIndex] as TopicPath,
        next: [nextChapterIndex, nextTopicIndex] as TopicPath,
      };
    });

    const adjacentTopics = derive(() => {
      const { previous, next } = adjacentTopicsPathIndices.value;
      const candidates: Array<[isNext: boolean, path: TopicPath]> = [
        [false, previous],
        [true, next],
      ];

      return candidates.flatMap(([isNext, pathIndices]) => {
        const [chapterIndex, topicIndex] = pathIndices;
        const chapter = chapters.value[chapterIndex];
        const topic = chapter?.topics[topicIndex];
        return chapter && topic
          ? [
              {
                isNext,
                pathIndices,
                chapterTitle: chapter.title,
                title: topic.title,
              },
            ]
          : [];
      });
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
