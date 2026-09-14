import { HISTORY_MAX, STATUS_OPTIONS, VALID_VIEWS } from "./constants";
import { INITIAL_ACTIONS } from "./data/seed";
import { importPayloadSchema } from "./schemas";
import type {
  ActionItem,
  AppState,
  HistoryEntry,
  HistoryType,
  StatusAcao,
} from "./types";
import { uid } from "@/lib/dates";

function sanitizeStatus(value: unknown): StatusAcao {
  return STATUS_OPTIONS.includes(value as StatusAcao)
    ? (value as StatusAcao)
    : "Não iniciado";
}

function sanitizeHistory(history: unknown): HistoryEntry[] {
  if (!Array.isArray(history)) return [];

  return history
    .filter(Boolean)
    .slice(0, HISTORY_MAX)
    .map((entry) => {
      const item = entry as Partial<HistoryEntry>;
      const type: HistoryType =
        item.type === "importacao" ? "importacao" : "alteracao";
      return {
        id: item.id || uid(),
        timestamp: item.timestamp || new Date().toISOString(),
        user: item.user || "Usuário local",
        actionId: item.actionId || "-",
        actionTitle: item.actionTitle || "",
        field: item.field || "obs",
        oldValue: String(item.oldValue ?? "").slice(0, 4000),
        newValue: String(item.newValue ?? "").slice(0, 4000),
        type,
      };
    })
    .filter((entry) => entry.type === "alteracao" || entry.type === "importacao");
}

export function createDefaultState(): AppState {
  const now = new Date().toISOString();
  return {
    theme: "light",
    view: "dashboard",
    user: "Usuário local",
    baseDate: now.slice(0, 10),
    updatedAt: now,
    history: [],
    actions: INITIAL_ACTIONS.map((action) => ({
      ...action,
      status: "Não iniciado" as const,
      obs: "",
    })),
  };
}

export function hydrate(rawState: unknown): AppState {
  const source =
    rawState && typeof rawState === "object"
      ? (rawState as Partial<AppState>)
      : null;
  const savedMap = new Map(
    (source?.actions || []).map((item) => [item.id, item])
  );

  return {
    theme: source?.theme === "dark" ? "dark" : "light",
    view: VALID_VIEWS.includes(source?.view as AppState["view"])
      ? (source!.view as AppState["view"])
      : "dashboard",
    user: source?.user || "Usuário local",
    baseDate: source?.baseDate || new Date().toISOString().slice(0, 10),
    updatedAt: source?.updatedAt || new Date().toISOString(),
    history: sanitizeHistory(source?.history),
    actions: INITIAL_ACTIONS.map((action) => {
      const saved = savedMap.get(action.id) || ({} as Partial<ActionItem>);
      return {
        ...action,
        responsavel: saved.responsavel || action.responsavel,
        prazo: saved.prazo || action.prazo,
        status: sanitizeStatus(saved.status),
        obs: String(saved.obs ?? "").slice(0, 4000),
        updatedAt: saved.updatedAt,
        bloqueioMotivo: saved.bloqueioMotivo
          ? String(saved.bloqueioMotivo).slice(0, 500)
          : undefined,
      };
    }),
  };
}

export function parseImportPayload(raw: unknown) {
  return importPayloadSchema.safeParse(raw);
}
