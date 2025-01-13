import { exists } from "node:fs/promises";
import { nonCachedImport } from "./utils";
import type { KarmaConfig } from "../sample-app/karma-types";

export const syncPackageJsonToKarma = async (appRootPath: string) => {
  const packageJsonPath = `${appRootPath}/package.json`;
  const karmaPath = `${appRootPath}/karma.ts`;
  const { config } = await nonCachedImport(karmaPath);
  const pjText = (await exists(packageJsonPath))
    ? await Bun.file(packageJsonPath).text()
    : JSON.stringify((config as KarmaConfig).packageJson, null, 2);
  const packageJsonText = JSON.stringify(JSON.parse(pjText), null, 2);
  const karmaText = await Bun.file(karmaPath).text();
  const pjSplitter = "packageJson:";
  const [prePjKarmaText, nextText] = karmaText.split(pjSplitter);

  let bracketStarted = false;
  let bracesCount = 0;
  let postPjKarmaTextStartIndex = -1;
  for (const c of nextText) {
    postPjKarmaTextStartIndex++;
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

  const postPjKarmaText = nextText.slice(postPjKarmaTextStartIndex);
  const syncedKarmaText = `${prePjKarmaText}${pjSplitter}${packageJsonText}${postPjKarmaText}`;
  await Bun.write(karmaPath, syncedKarmaText);
};
