"use client";

import { createContext } from "react";
import type { ActionItem, AppState } from "../types";

export type ActionPatch = Partial<
  Pick<
    ActionItem,
    "status" | "responsavel" | "prazo" | "obs" | "bloqueioMotivo"
  >
>;

export interface PlanContextValue {
  state: AppState;
  ready: boolean;
  canUndo: boolean;
  canRedo: boolean;
  updateAction: (id: string, patch: ActionPatch) => void;
  setUser: (user: string) => void;
  setView: (view: AppState["view"]) => void;
  setTheme: (theme: AppState["theme"]) => void;
  setBaseDate: (baseDate: string) => void;
  undo: () => void;
  redo: () => void;
  restore: () => void;
  clearHistory: () => void;
  importState: (raw: unknown) => boolean;
  getSnapshot: () => AppState;
}

export const PlanContext = createContext<PlanContextValue | null>(null);
