import type { ActionItem, AppState, HistoryEntry } from "../types";
import { uid } from "@/lib/dates";
import type { ActionPatch } from "./plan-context";

export function appendHistoryChange(
  prev: AppState,
  action: ActionItem,
  field: string,
  oldValue: string,
  newValue: string
): HistoryEntry[] {
  if (oldValue === newValue) return prev.history;
  const entry: HistoryEntry = {
    id: uid(),
    timestamp: new Date().toISOString(),
    user: prev.user,
    actionId: action.id,
    actionTitle: action.acao,
    field,
    oldValue,
    newValue,
    type: "alteracao",
  };
  return [entry, ...prev.history].slice(0, 200);
}

export function applyActionPatch(
  prev: AppState,
  id: string,
  patch: ActionPatch
): AppState {
  let history = prev.history;
  const actions = prev.actions.map((action) => {
    if (action.id !== id) return action;
    const next = {
      ...action,
      ...patch,
      updatedAt: new Date().toISOString(),
    };
    (Object.keys(patch) as (keyof ActionPatch)[]).forEach((field) => {
      if (patch[field] === undefined) return;
      history = appendHistoryChange(
        { ...prev, history },
        action,
        field,
        String(action[field] ?? ""),
        String(patch[field] ?? "")
      );
    });
    if (next.status !== "Bloqueado") next.bloqueioMotivo = undefined;
    return next;
  });
  return { ...prev, actions, history };
}

export function buildImportHistory(
  state: AppState,
  actionCount: number
): HistoryEntry {
  return {
    id: uid(),
    timestamp: new Date().toISOString(),
    user: state.user,
    actionId: "-",
    actionTitle: "Importação JSON",
    field: "sistema",
    oldValue: "",
    newValue: `${actionCount} ações`,
    type: "importacao",
  };
}
