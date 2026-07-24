export const debouncer = (
  callback: (...args: any[]) => Promise<void>,
  delayInMS: number,
  withPerf?: boolean,
) => {
  let lastTimestamp: number = 0;

  return (...args: any[]) => {
    lastTimestamp = new Date().getTime();
    setTimeout(async () => {
      const start = performance.now();
      const newTimestamp = new Date().getTime();
      if (newTimestamp - lastTimestamp < delayInMS) {
        return;
      }
      await callback(...args);

      if (withPerf) {
        const finish = performance.now();
        console.log(`Done in ${(finish - start).toFixed(0)} ms.\n`);
      }
    }, delayInMS);
  };
};
