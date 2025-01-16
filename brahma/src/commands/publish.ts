import { buildApp } from "../builder";
import { runLocalServer } from "../utils/local-server.ts";
import { getKarma } from "../utils/common.ts";

export const publishApp = async () => {
  const cwd = process.cwd();
  console.log(`Building app for production deployment...\n`);
  const karma = await getKarma(cwd);
  if (!karma) return false;

  const start = performance.now();
  await buildApp(cwd, karma.config, true);
  const finish = performance.now();
  console.log(`Build done in ${(finish - start).toFixed(0)} ms.\n`);
  runLocalServer(5000, `${cwd}/prod`, true);
};
