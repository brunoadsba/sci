import type { ActionItem, Prioridade, StatusAcao } from "../types";

export interface PlanFilters {
  search: string;
  onda: string;
  status: string;
  responsavel: string;
  prioridade: string;
}

export function filterActions(
  actions: ActionItem[],
  filters: PlanFilters
): ActionItem[] {
  const q = filters.search.trim().toLowerCase();

  return actions.filter((action) => {
    if (filters.onda !== "all" && String(action.onda) !== filters.onda) {
      return false;
    }
    if (filters.status !== "all" && action.status !== filters.status) {
      return false;
    }
    if (
      filters.responsavel !== "all" &&
      action.responsavel !== filters.responsavel
    ) {
      return false;
    }
    if (
      filters.prioridade !== "all" &&
      action.prioridade !== (filters.prioridade as Prioridade)
    ) {
      return false;
    }
    if (!q) return true;

    const haystack = [
      action.id,
      action.acao,
      action.entregavel,
      action.responsavel,
      action.prazo,
      action.criterio,
      action.status,
      action.obs,
      action.bloqueioMotivo,
    ]
      .join(" ")
      .toLowerCase();

    return haystack.includes(q);
  });
}

export function uniqueResponsaveis(actions: ActionItem[]): string[] {
  return [...new Set(actions.map((a) => a.responsavel))].sort((a, b) =>
    a.localeCompare(b, "pt-BR")
  );
}

export function countByStatus(actions: ActionItem[]) {
  const counts: Record<StatusAcao, number> = {
    "Não iniciado": 0,
    "Em andamento": 0,
    Concluído: 0,
    Bloqueado: 0,
  };
  for (const action of actions) {
    counts[action.status] += 1;
  }
  return counts;
}
