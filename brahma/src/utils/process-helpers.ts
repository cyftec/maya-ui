export const onProcessSigInt = () => {
  process.on("SIGINT", () => {
    console.log("");
    process.exit();
  });
};
