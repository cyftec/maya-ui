const SectionEnclosers = {
  object: { start: "{", end: "}" },
  array: { start: "[", end: "]" },
} as const;

export const splitText = (
  text: string,
  splittersPathArray: string[],
): [preTextIncludingSplitter: string, postSplitterText: string] =>
  splittersPathArray.reduce(
    ([preSplitter, postSplitter], splitterMilestone) => {
      if (!postSplitter.includes(splitterMilestone))
        throw `splitter path milestone '${splitterMilestone}' does not exist in the text.`;
      const [preText, postText] = postSplitter.split(splitterMilestone);
      return [preSplitter + preText + splitterMilestone, postText];
    },
    ["", text],
  );

export const updateSectionInFile = async (
  filePath: string,
  sectionSplittersPathArray: string[],
  updatedSectionText: string,
  sectionType: keyof typeof SectionEnclosers = "object",
) => {
  const fileText = await Bun.file(filePath).text();
  const [preSectionText, restOfText] = splitText(
    fileText,
    sectionSplittersPathArray,
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
