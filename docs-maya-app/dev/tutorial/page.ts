import { derived, dprops, signal } from "@cyftech/signal";
import { m } from "@mufw/maya";
import { Page } from "../@libs/components/Page";
import { Button, Navbar, TitledList } from "../@libs/elements";
import { chapters } from "./@libs/constants";
import { PageLayout } from "../@libs/components/PageLayout";

const selectedTopicPathIndeces = signal([0, 0]);
const scrollToTopTrigger = signal(0);

const selectedTopic = derived(() => {
  const [chapterIndex, topicIndex] = selectedTopicPathIndeces.value;
  return chapters[chapterIndex].topics[topicIndex];
});
const { title: topicTitle, article: TopicArticle } = dprops(selectedTopic);

const selectedTopicPathNames = derived(() => {
  const [chapterIndex, topicIndex] = selectedTopicPathIndeces.value;
  return [
    chapters[chapterIndex].title,
    chapters[chapterIndex].topics[topicIndex].title,
  ];
});

const adjacentTopicsPathIndices = derived(() => {
  const [chapterIndex, topicIndex] = selectedTopicPathIndeces.value;

  let prevChapterIndex = chapterIndex;
  let prevTopicIndex = topicIndex - 1;
  if (!chapters[prevChapterIndex]?.topics[prevTopicIndex]) {
    prevChapterIndex = chapterIndex - 1;
    prevTopicIndex = chapters[prevChapterIndex]?.topics.length - 1 || -1;
  }

  let nextChapterIndex = chapterIndex;
  let nextTopicIndex = topicIndex + 1;
  if (!chapters[nextChapterIndex]?.topics[nextTopicIndex]) {
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

const adjacentTopics = derived(() => {
  const { prevChapterIndex, prevTopicIndex, nextChapterIndex, nextTopicIndex } =
    adjacentTopicsPathIndices.value;

  const prevTopic = chapters[prevChapterIndex]?.topics[prevTopicIndex]
    ? {
        isNext: false,
        pathIndices: [prevChapterIndex, prevTopicIndex],
        chapterTitle: chapters[prevChapterIndex].title,
        title: chapters[prevChapterIndex].topics[prevTopicIndex].title,
      }
    : undefined;

  const nextTopic = chapters[nextChapterIndex]?.topics[nextTopicIndex]
    ? {
        isNext: true,
        pathIndices: [nextChapterIndex, nextTopicIndex],
        chapterTitle: chapters[nextChapterIndex].title,
        title: chapters[nextChapterIndex].topics[nextTopicIndex].title,
      }
    : undefined;

  return [prevTopic, nextTopic].filter((topic) => !!topic);
});

export default Page({
  title: "Tutorial - Maya",
  headElements: [
    m.Link({
      rel: "stylesheet",
      href: "https://cdn.jsdelivr.net/gh/highlightjs/cdn-release@11.9.0/build/styles/night-owl.css",
    }),
    m.Script({
      src: "https://cdn.jsdelivr.net/gh/highlightjs/cdn-release@11.9.0/build/highlight.min.js",
    }),
  ],
  app: PageLayout({
    headerTitle: "Tutorial",
    headerComponent: m.Div({
      class:
        "flex flex-wrap items-center ml3 ml0-ns f7 b silver light-silver-ns",
      children: m.For({
        subject: selectedTopicPathNames,
        map: (pathName) =>
          m.Div({
            class: `mb2 mb0-ns pointer`,
            children: [
              "/",
              m.Span({
                class: "pa1 ph2-ns mh1 br3",
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
          classNames: "mb4 pb3",
          titleClassNames: "f4",
          itemClassNames: "mb2 pb1 f6",
          linkColorCss: "purple",
          title: `${chapterIndex + 1}. ${title}`,
          onLinkClick: (linkIndex) =>
            (selectedTopicPathIndeces.value = [chapterIndex, linkIndex]),
          links: derived(() =>
            topics.map((topic, topicIndex) => {
              const [selectedChapter, selectedTopic] =
                selectedTopicPathIndeces.value;
              return {
                title: topic.title,
                isSelected:
                  selectedChapter === chapterIndex &&
                  selectedTopic === topicIndex,
              };
            })
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
            class: derived(() =>
              adjacentTopics.value.length > 1 ? "mh3" : ""
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
                  topic.isNext ? "Next Topic &rarr;" : "&larr; Previous Topic",
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
