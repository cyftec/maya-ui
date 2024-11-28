import {
  drpromstate,
  effect,
  signal,
  transmit,
  type Signal,
} from "@cyftec/signal";

export const query = <T>(
  url: string,
  options: RequestInit | undefined,
  runQueryImmediately: boolean = false
) => {
  const abortController = new AbortController();
  const isLoading: Signal<boolean> = signal(runQueryImmediately);
  const data: Signal<T | undefined> = signal(undefined);
  const error: Signal<Error | undefined> = signal(undefined);

  const runFetch = () => {
    isLoading.value = true;

    return fetch(url, {
      signal: abortController.signal,
      ...options,
      method: "get",
    });
  };

  const {
    result: fResult,
    error: fError,
    runPromise: runQuery,
  } = drpromstate(runFetch, runQueryImmediately);
  transmit(fError, error);

  effect(() => {
    if (fResult.value) {
      const {
        isBusy: jIsBusy,
        result: jResult,
        error: jError,
      } = drpromstate<T>(() => (fResult.value as Response).json(), true);
      transmit(jIsBusy, isLoading);
      transmit(jResult, data);
      transmit(jError, error);
    }
  });

  const abortQuery = () => {
    if (abortController) {
      abortController.abort();
    }
  };

  const clearCache = () => {
    abortQuery();
    isLoading.value = false;
    data.value = undefined;
    error.value = undefined;
  };

  return {
    isLoading,
    data,
    error,
    runQuery,
    abortQuery,
    clearCache,
  };
};
