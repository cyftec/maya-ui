import { derive, signal } from "@cyftech/signal";
import { m } from "@mufw/maya";
import { ATTENTION, SELECTOR, UI_ELEM_ID } from "./@libs/constants";
import { getNumberFromElement } from "./@libs/utils";

/**
 * This extension uses the data coming in aria-label and/or tooltips for a more
 * correct and unabbreviated number (e.g. 2M for 2,000,000);
 *
 * KNOWN ISSUE
 * Sometimes the locale number format in aria-label mismatches that with
 * the locale set for the document. That results in an incorrect score.
 *
 * For example, in case of 'bosanski' language, the 'lang' attribute of the document
 * is set to 'bs-Latn-BA' (check html[lang="bs-Latn-BA"] for same), in which the
 * decimal in a number is representated with a comma (','). While the formatted
 * number string coming from backend for like button's aria-label has the
 * opposite, i.e. number with point (.) decimal.
 */

const videoUpdatedCount = signal(0);

const attentionScore = derive(() => {
  if (!videoUpdatedCount.value) return "0";

  const lang = document.documentElement.lang;
  const viewsCount = getNumberFromElement(SELECTOR.VIEWS_ELEM, lang);
  const likesCount = getNumberFromElement(SELECTOR.LIKES_ELEM, lang, true);

  const score = (1000 * likesCount) / viewsCount;
  const scoreString = score.toFixed(0);
  console.log(`Attention score for current video is ${scoreString}`);

  return scoreString;
});

const attentionEmoji = derive(() => {
  const attentionScoreNum = parseFloat(attentionScore.value);
  if (attentionScoreNum < 10) return ATTENTION.OKAY;
  if (attentionScoreNum < 25) return ATTENTION.GOOD;
  if (attentionScoreNum < 50) return ATTENTION.AWESOME;
  if (attentionScoreNum < 100) return ATTENTION.FABULOUS;
  return ATTENTION.UNEXPECTED;
});

const attentionScoreUI = m.Div({
  id: UI_ELEM_ID,
  children: [
    m.Style(`
      .atscore-container {
        display: flex;
        align-items: center;
        justify-content: center;
        border-radius: 50px;
        background-color: #f2f2f2;
        color: #666;
        padding: 1px 10px;
        margin-right: 10px;
        font-weight: bold;
      }

      .atscore-icon {
        font-size: 16px;
        padding: 4px;
      }
        
      .atscore-text {
        font-size: 15px;
        padding: 4px;
      }
    `),
    m.Div({
      class: "atscore-container",
      children: [
        m.Span({ class: "atscore-icon", children: attentionEmoji }),
        m.Span({ class: "atscore-text", children: attentionScore }),
      ],
    }),
  ],
})();

const updateUI = () => {
  videoUpdatedCount.value++;
  const container = document.querySelector<HTMLElement>(
    SELECTOR.CONTAINER_ELEM
  );
  if (!container) return;

  container.setAttribute(
    "style",
    "display: flex; align-items: center; padding-bottom: 10px;"
  );

  if (container.firstElementChild?.id === UI_ELEM_ID) {
    container.replaceChild(attentionScoreUI, container.firstElementChild);
  } else {
    container.prepend(attentionScoreUI);
  }
};

const runExtension = () => {
  chrome.runtime.onMessage.addListener((message) => {
    if (message.videoLoaded) {
      updateUI();
    }
  });
  updateUI();
};

runExtension();
