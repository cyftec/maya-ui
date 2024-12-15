import { dpromstate, dprops, effect, source } from "../../signal";

type QueryState<D> = {
  isLoading: boolean;
  data: D | undefined;
  error: Error | undefined;
};

export const query = <T>(
  url: string,
  options: RequestInit | undefined,
  runImmediately: boolean = false
) => {
  const abortController = new AbortController();
  const state = source<QueryState<T>>({
    isLoading: runImmediately,
    data: undefined,
    error: undefined,
  });

  const runFetch = () => {
    const prevData = state.value.data;
    state.value = {
      isLoading: true,
      data: prevData,
      error: undefined,
    };
    return fetch(url, {
      signal: abortController.signal,
      ...options,
      method: "get",
    });
  };

  const [fResult, fError] = dpromstate(runFetch, runImmediately);

  effect(() => {
    if (fError.value) {
      state.value = {
        ...state.value,
        isLoading: false,
        error: fError.value,
      };
      return;
    }

    if (fResult.value) {
      (fResult.value as Response)
        .json()
        .then((data) => {
          state.value = {
            isLoading: false,
            error: undefined,
            data: data,
          };
        })
        .catch((e) => {
          state.value = {
            ...state.value,
            isLoading: false,
            error: e,
          };
        });
    }
  });

  const abortQuery = () => {
    if (abortController) {
      abortController.abort();
      state.value = {
        ...state.value,
        isLoading: false,
        error: undefined,
      };
    }
  };

  const clearCache = () => {
    abortQuery();
    state.value = {
      isLoading: false,
      data: undefined,
      error: undefined,
    };
  };

  return {
    ...dprops(state),
    abortQuery,
    clearCache,
  };
};
