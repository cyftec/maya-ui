type StdinControl = Pick<NodeJS.ReadStream, "resume" | "setEncoding" | "on">;

export const startStdinListener = async (
  onQuit: () => void,
  stdin: StdinControl = process.stdin,
) => {
  stdin.resume();
  stdin.setEncoding("utf8");

  stdin.on("data", (input: string) => {
    if (input.trim() === "q") {
      onQuit();
    }
  });
};
