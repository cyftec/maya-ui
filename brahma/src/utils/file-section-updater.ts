import { splitText } from "./common";

const SectionEnclosers = {
  object: { start: "{", end: "}" },
  array: { start: "[", end: "]" },
} as const;

export const updateSectionInFile = async (
  filePath: string,
  sectionSplittersPath: string[],
  updatedSectionText: string,
  sectionType: keyof typeof SectionEnclosers = "object"
) => {
  const fileText = await Bun.file(filePath).text();
  const [preSectionText, restOfText] = splitText(
    fileText,
    sectionSplittersPath
  );

  let sectionStarted = false;
  let enclosersCount = 0;
  let postSectionTextStartIndex = -1;
  for (const c of restOfText) {
    postSectionTextStartIndex++;
    if (!sectionStarted) {
      if (c === SectionEnclosers[sectionType].start) {
        sectionStarted = true;
        enclosersCount = 1;
      }
      continue;
    }

    if (enclosersCount) {
      enclosersCount +=
        c === SectionEnclosers[sectionType].start
          ? 1
          : c === SectionEnclosers[sectionType].end
          ? -1
          : 0;
      continue;
    }
    break;
  }

  const postSectionText = restOfText.slice(postSectionTextStartIndex);
  const updatedFileText = `${preSectionText}${updatedSectionText}${postSectionText}`;
  await Bun.write(filePath, updatedFileText);
};

export const updateObjectPropInFile = async (
  filePath: string,
  splittersPath: string[],
  currentPropValue: string | number | boolean,
  updatedPropValue: string | number | boolean
) => {
  const fileText = await Bun.file(filePath).text();
  const [prePropValueText, restOfText] = splitText(fileText, splittersPath);
  const currentPropValueJSON = JSON.stringify(currentPropValue);
  const postPropValueText = restOfText.split(currentPropValueJSON)[1];
  const updatedPropValueText = JSON.stringify(updatedPropValue);
  const updatedFileText = `${prePropValueText}${updatedPropValueText}${postPropValueText}`;

  await Bun.write(filePath, updatedFileText);
};
