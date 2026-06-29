import { isDevMode } from "../src/common";

export const LOGS = {
  errorFor: (gitMethod: string) =>
    `❌ ERROR: Cannot ${gitMethod} while in dev-mode`,
  fixFor: (gitMethod: string) =>
    `Run 'bun run dev:exit' to exit dev-mode before ${gitMethod}ing`,
  PASS: "✓ Publish-mode check passed",
};

export const exitProcessIfDevMode = (
  pkg: any,
  gitMethod: "commit" | "push",
) => {
  if (isDevMode(pkg)) {
    console.error(LOGS.errorFor(gitMethod));
    console.error(LOGS.fixFor(gitMethod));
    process.exit(1);
  }

  console.log(LOGS.PASS);
};
