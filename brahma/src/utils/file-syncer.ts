import { exists } from "node:fs/promises";
import type { KarmaConfig } from "../sample-app/karma-types";

export const syncPackageJsonToKarma = async (appRootPath: string) => {
  const pjPath = `${appRootPath}/package.json`;
  const karmaPath = `${appRootPath}/karma.ts`;
  const { config } = await import(karmaPath);
  const pjText = (await exists(pjPath))
    ? await Bun.file(pjPath).text()
    : JSON.stringify((config as KarmaConfig).packageJson, null, 2);
  const formattedPjText = JSON.stringify(JSON.parse(pjText), null, 2);
  const karmaText = await Bun.file(karmaPath).text();
  const karmaPjSplitter = "packageJson:";
  const [karmaPrePjText, restOfText] = karmaText.split(karmaPjSplitter);

  let bracketStarted = false;
  let bracesCount = 0;
  let karmaPostPjTextStartIndex = -1;
  for (const c of restOfText) {
    karmaPostPjTextStartIndex++;
    if (!bracketStarted) {
      if (c === "{") {
        bracketStarted = true;
        bracesCount = 1;
      }
      continue;
    }

    if (bracesCount) {
      bracesCount += c === "{" ? 1 : c === "}" ? -1 : 0;
      continue;
    }
    break;
  }

  const karmaPostPjText = restOfText.slice(karmaPostPjTextStartIndex);
  const syncedKarmaText = `${karmaPrePjText}${karmaPjSplitter}${formattedPjText}${karmaPostPjText}`;
  await Bun.write(karmaPath, syncedKarmaText);
};
