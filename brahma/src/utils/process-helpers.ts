type ProcessControl = Pick<NodeJS.Process, "on" | "exit">;

export const onProcessSigInt = (controlledProcess: ProcessControl = process) => {
  controlledProcess.on("SIGINT", () => {
    console.log("");
    controlledProcess.exit();
  });
};
