"use client";

import {
  useCallback,
  useEffect,
  useMemo,
  useRef,
  useState,
  type ReactNode,
} from "react";
import { toast } from "sonner";
import { AUTOSAVE_MS } from "../constants";
import { createDefaultState, hydrate, parseImportPayload } from "../hydrate";
import type { ActionItem, AppState } from "../types";
import {
  persistDraftThenCommit,
  saveDraft,
} from "@/lib/storage/plan-storage";
import {
  PlanContext,
  type ActionPatch,
  type PlanContextValue,
} from "./plan-context";
import { applyActionPatch, buildImportHistory } from "./plan-mutations";
import { usePlanBoot } from "./use-plan-boot";

export function PlanProvider({ children }: { children: ReactNode }) {
  const [state, setState] = useState<AppState>(createDefaultState);
  const [ready, setReady] = useState(false);
  const [undoStack, setUndoStack] = useState<string[]>([]);
  const [redoStack, setRedoStack] = useState<string[]>([]);
  const stateRef = useRef(state);
  const saveTimer = useRef<ReturnType<typeof setTimeout> | null>(null);

  useEffect(() => {
    stateRef.current = state;
  }, [state]);

  usePlanBoot(setState, setReady, stateRef, saveTimer);

  const schedulePersist = useCallback((next: AppState) => {
    saveDraft(next);
    if (saveTimer.current) clearTimeout(saveTimer.current);
    saveTimer.current = setTimeout(() => {
      void persistDraftThenCommit(next);
    }, AUTOSAVE_MS);
  }, []);

  const commit = useCallback(
    (updater: (prev: AppState) => AppState) => {
      setState((prev) => {
        const next = {
          ...updater(prev),
          updatedAt: new Date().toISOString(),
        };
        stateRef.current = next;
        schedulePersist(next);
        return next;
      });
    },
    [schedulePersist]
  );

  const pushUndo = useCallback(() => {
    setUndoStack((stack) => {
      const next = [...stack, JSON.stringify(stateRef.current.actions)];
      return next.length > 100 ? next.slice(next.length - 100) : next;
    });
    setRedoStack([]);
  }, []);

  const updateAction = useCallback(
    (id: string, patch: ActionPatch) => {
      pushUndo();
      commit((prev) => applyActionPatch(prev, id, patch));
    },
    [commit, pushUndo]
  );

  const undo = useCallback(() => {
    setUndoStack((stack) => {
      if (!stack.length) return stack;
      const previous = stack[stack.length - 1];
      setRedoStack((redo) => [
        ...redo,
        JSON.stringify(stateRef.current.actions),
      ]);
      commit((prev) => ({
        ...prev,
        actions: JSON.parse(previous) as ActionItem[],
      }));
      return stack.slice(0, -1);
    });
  }, [commit]);

  const redo = useCallback(() => {
    setRedoStack((stack) => {
      if (!stack.length) return stack;
      const nextActions = stack[stack.length - 1];
      setUndoStack((items) => [
        ...items,
        JSON.stringify(stateRef.current.actions),
      ]);
      commit((prev) => ({
        ...prev,
        actions: JSON.parse(nextActions) as ActionItem[],
      }));
      return stack.slice(0, -1);
    });
  }, [commit]);

  const restore = useCallback(() => {
    pushUndo();
    commit((prev) => ({
      ...createDefaultState(),
      user: prev.user,
      theme: prev.theme,
      view: prev.view,
      baseDate: prev.baseDate,
    }));
    toast.message("Plano restaurado ao estado inicial");
  }, [commit, pushUndo]);

  const importState = useCallback(
    (raw: unknown) => {
      const parsed = parseImportPayload(raw);
      if (!parsed.success) {
        toast.error("JSON inválido");
        return false;
      }
      pushUndo();
      const next = hydrate({
        ...stateRef.current,
        ...parsed.data,
        updatedAt: parsed.data.updatedAt || new Date().toISOString(),
      });
      const withHistory = {
        ...next,
        history: [
          buildImportHistory(next, next.actions.length),
          ...next.history,
        ].slice(0, 200),
      };
      setState(withHistory);
      stateRef.current = withHistory;
      schedulePersist(withHistory);
      toast.success("Importação concluída");
      return true;
    },
    [pushUndo, schedulePersist]
  );

  const value = useMemo<PlanContextValue>(
    () => ({
      state,
      ready,
      canUndo: undoStack.length > 0,
      canRedo: redoStack.length > 0,
      updateAction,
      setUser: (user) => commit((prev) => ({ ...prev, user })),
      setView: (view) => commit((prev) => ({ ...prev, view })),
      setTheme: (theme) => commit((prev) => ({ ...prev, theme })),
      setBaseDate: (baseDate) => commit((prev) => ({ ...prev, baseDate })),
      undo,
      redo,
      restore,
      clearHistory: () => commit((prev) => ({ ...prev, history: [] })),
      importState,
      getSnapshot: () => stateRef.current,
    }),
    [
      state,
      ready,
      undoStack.length,
      redoStack.length,
      updateAction,
      commit,
      undo,
      redo,
      restore,
      importState,
    ]
  );

  return <PlanContext.Provider value={value}>{children}</PlanContext.Provider>;
}
