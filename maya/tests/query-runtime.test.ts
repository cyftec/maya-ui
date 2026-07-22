import { afterEach, describe, expect, mock, test } from "bun:test";
import { query } from "../src/toolkit/query.ts";

const originalFetch = globalThis.fetch;
const tick = () => new Promise((resolve) => setTimeout(resolve, 0));

afterEach(() => {
  globalThis.fetch = originalFetch;
});

describe("query", () => {
  test("tracks loading, parsed data, request options, and completion", async () => {
    let requestInit: RequestInit | undefined;
    let resolveFetch!: (response: Response) => void;
    globalThis.fetch = mock(async (_url: string | URL | Request, init?: RequestInit) => {
      requestInit = init;
      return await new Promise<Response>((resolve) => {
        resolveFetch = resolve;
      });
    }) as unknown as typeof fetch;
    const completed = mock(() => {});
    const state = query<{ answer: number }>(
      "/answer",
      { headers: { accept: "application/json" }, method: "post" },
      completed,
    );

    const running = state.runQuery();
    expect(state.isLoading.value).toBe(true);
    expect(requestInit?.method).toBe("get");
    expect(requestInit?.signal).toBeInstanceOf(AbortSignal);
    resolveFetch(Response.json({ answer: 42 }));
    await running;
    await tick();
    expect(state.isLoading.value).toBe(false);
    expect(state.data.value).toEqual({ answer: 42 });
    expect(state.error.value).toBeUndefined();
    expect(completed).toHaveBeenCalledTimes(1);
  });

  test("preserves previous data on fetch and JSON errors", async () => {
    const responses: Array<Response | Error | { json: () => Promise<never> }> = [
      Response.json({ value: "cached" }),
      new Error("offline"),
      { json: () => Promise.reject<never>(new Error("bad json")) },
    ];
    globalThis.fetch = mock(async () => {
      const next = responses.shift();
      if (next instanceof Error) throw next;
      return next as Response;
    }) as unknown as typeof fetch;
    const state = query<{ value: string }>("/data", undefined);

    await state.runQuery();
    await tick();
    expect(state.data.value).toEqual({ value: "cached" });

    await state.runQuery();
    expect(state.isLoading.value).toBe(false);
    expect(state.error.value?.message).toBe("offline");
    expect(state.data.value).toEqual({ value: "cached" });

    await state.runQuery();
    await tick();
    expect(state.error.value?.message).toBe("bad json");
    expect(state.data.value).toEqual({ value: "cached" });
  });

  test("aborts in-flight work and clears cached state", async () => {
    let requestSignal: AbortSignal | undefined;
    globalThis.fetch = mock(async (_url: string | URL | Request, init?: RequestInit) => {
      requestSignal = init?.signal as AbortSignal;
      return await new Promise<Response>(() => {});
    }) as unknown as typeof fetch;
    const state = query("/slow", undefined);
    void state.runQuery();
    expect(state.isLoading.value).toBe(true);
    state.abortQuery();
    expect(requestSignal?.aborted).toBe(true);
    expect(state.isLoading.value).toBe(false);
    expect(state.error.value).toBeUndefined();

    state.clearCache();
    expect(state.data.value).toBeUndefined();
    expect(state.isLoading.value).toBe(false);
  });
});
