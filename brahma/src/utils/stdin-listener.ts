export const startStdinListener = async (onQuit: () => void) => {
  process.stdin.resume();
  process.stdin.setEncoding("utf8");

  process.stdin.on("data", (input: string) => {
    if (input.trim() === "q") {
      onQuit();
    }
  });
};
