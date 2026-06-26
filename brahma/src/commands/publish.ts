import { buildApp } from "../builder";
import { getKarma } from "../utils/common.ts";

export const publishApp = async () => {
  const cwd = process.cwd();
  console.log(`Building app for production deployment...\n`);
  const karma = await getKarma(cwd);
  const start = performance.now();
  await buildApp(cwd, karma, true);
  const finish = performance.now();
  console.log(`Build done in ${(finish - start).toFixed(0)} ms.\n`);
};
