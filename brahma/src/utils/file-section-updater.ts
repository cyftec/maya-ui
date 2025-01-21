const SectionEnclosers = {
  object: { start: "{", end: "}" },
  array: { start: "[", end: "]" },
} as const;

export const updateFileSection = async (
  filePath: string,
  updatedSectionText: string,
  sectionSplitter: string,
  sectionType: keyof typeof SectionEnclosers = "object"
) => {
  const fileText = await Bun.file(filePath).text();
  const [preSectionText, restOfText] = fileText.split(sectionSplitter);

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
  const updatedFileText = `${preSectionText}${sectionSplitter}${updatedSectionText}${postSectionText}`;
  await Bun.write(filePath, updatedFileText);
};
