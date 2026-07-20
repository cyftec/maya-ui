import { effect, promstates, signal } from "@cyftec/signal";

/**
 * TODO: Implement below modern querying features
 *
 * 1. Caching of fetched data
 *    - for instant data load
 *
 * 2. Retry logic
 *    - for an uninterrupted and more promising fetch
 *
 * 3. Request Deduplication
 *    - if multiple events of component loads triggers the same fetch
 *
 * 4. Automatic Background Refetching
 *    - when the user switches tabs back to your app, or
 *    - when they regain their internet connection
 *
 * 5. Optimistic or anticipatory fetching (Infinite Scrolling / Pagination State)
 *    - when an event confirms that the next fetch is required
 *
 * 6. Dependent Queries
 *    - where one API call requires a piece of data from a previous API call
 *
 * 7. Auto-Cancellation (Race Condition Prevention)
 *    - If a component unmounts mid-request, or
 *    - if a user triggers a new search before the first search finishes
 *
 * 8. Return-Stale-While-Revalidate
 *    - return data instantly from the cache so the user has something to look at,
 *    - silently fetch the fresh data and update the UI
 */

type QueryState<D> = {
  isLoading: boolean;
  data: D | undefined;
  error: Error | undefined;
};

export const query = <T>(
  url: string,
  options: RequestInit | undefined,
  onComplete?: () => void,
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
    onComplete,
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
    ...state.props(),
    runQuery,
    abortQuery,
    clearCache,
  };
};
