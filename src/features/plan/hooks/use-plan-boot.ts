"use client";

import { useEffect, type MutableRefObject } from "react";
import { hydrate } from "../hydrate";
import type { AppState } from "../types";
import {
  chooseInitialState,
  clearDraft,
  idbGetState,
  loadDraft,
  loadLocalStorage,
  persistState,
  readEmbeddedState,
} from "@/lib/storage/plan-storage";

export function usePlanBoot(
  setState: (state: AppState) => void,
  setReady: (ready: boolean) => void,
  stateRef: MutableRefObject<AppState>,
  saveTimer: MutableRefObject<ReturnType<typeof setTimeout> | null>
) {
  useEffect(() => {
    let cancelled = false;

    async function boot() {
      const chosen = chooseInitialState(
        readEmbeddedState(),
        await idbGetState(),
        loadLocalStorage(),
        loadDraft()
      );
      const next = hydrate(chosen);
      if (!cancelled) {
        setState(next);
        stateRef.current = next;
        setReady(true);
        await persistState(next);
        clearDraft();
      }
    }

    void boot();

    const flush = () => {
      if (saveTimer.current) {
        clearTimeout(saveTimer.current);
        saveTimer.current = null;
      }
      void persistState(stateRef.current);
    };

    const onVisibility = () => {
      if (document.visibilityState === "hidden") flush();
    };

    window.addEventListener("beforeunload", flush);
    document.addEventListener("visibilitychange", onVisibility);

    return () => {
      cancelled = true;
      window.removeEventListener("beforeunload", flush);
      document.removeEventListener("visibilitychange", onVisibility);
      if (saveTimer.current) clearTimeout(saveTimer.current);
    };
  }, [saveTimer, setReady, setState, stateRef]);
}
