export type StatusAcao =
  | "Não iniciado"
  | "Em andamento"
  | "Concluído"
  | "Bloqueado";

export type Fase = 1 | 2 | 3;
export type Prioridade = "Crítica" | "Alta" | "Média";
export type ViewMode =
  | "dashboard"
  | "kanban"
  | "table"
  | "cronograma"
  | "history";
export type ThemeMode = "light" | "dark";
export type HistoryType = "alteracao" | "importacao";

export interface ActionSeed {
  id: string;
  fase: Fase;
  prioridade: Prioridade;
  acao: string;
  entregavel: string;
  responsavel: string;
  prazo: string;
  criterio: string;
}

export interface ActionItem extends ActionSeed {
  status: StatusAcao;
  obs: string;
  updatedAt?: string;
  bloqueioMotivo?: string;
}

export interface HistoryEntry {
  id: string;
  timestamp: string;
  user: string;
  actionId: string;
  actionTitle: string;
  field: string;
  oldValue: string;
  newValue: string;
  type: HistoryType;
}

export interface AppState {
  theme: ThemeMode;
  view: ViewMode;
  user: string;
  baseDate: string;
  updatedAt: string;
  history: HistoryEntry[];
  actions: ActionItem[];
}

export interface PhaseDef {
  id: Fase;
  label: string;
  prazo: string;
  startDay: number;
}

export interface PhaseMilestone {
  fase: Fase;
  label: string;
  prazo: string;
}
