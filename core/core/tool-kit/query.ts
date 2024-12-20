import { dpromise, dprops, effect, source } from "../../signal/index.ts";

type QueryState<D> = {
  isLoading: boolean;
  data: D | undefined;
  error: Error | undefined;
};

export const query = <T>(
  url: string,
  options: RequestInit | undefined,
  onComplete: () => void
) => {
  const abortController = new AbortController();
  const state = source<QueryState<T>>({
    isLoading: false,
    data: undefined,
    error: undefined,
  });

  const [runQuery, fResult, fError] = dpromise(() => {
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
  }, onComplete);

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
    runQuery,
    abortQuery,
    clearCache,
  };
};
