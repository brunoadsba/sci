export type StatusAcao =
  | "Não iniciado"
  | "Em andamento"
  | "Concluído"
  | "Bloqueado";

export type Onda = 1 | 2 | 3;
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
  onda: Onda;
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

export interface WaveDef {
  id: Onda;
  label: string;
  prazo: string;
  startDay: number;
}

export interface WaveMilestone {
  onda: Onda;
  label: string;
  prazo: string;
}
