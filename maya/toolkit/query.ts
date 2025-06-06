import { effect, promstates, signal, trap } from "@cyftech/signal";

type QueryState<D> = {
  isLoading: boolean;
  data: D | undefined;
  error: Error | undefined;
};

export const query = <T>(
  url: string,
  options: RequestInit | undefined,
  onComplete?: () => void
) => {
  const abortController = new AbortController();
  const state = signal<QueryState<T>>({
    isLoading: false,
    data: undefined,
    error: undefined,
  });

  const [runQuery, fResult, fError] = promstates(
    () => {
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
    },
    undefined,
    onComplete
  );

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
            data: data as T,
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
    ...trap(state).props,
    runQuery,
    abortQuery,
    clearCache,
  };
};
