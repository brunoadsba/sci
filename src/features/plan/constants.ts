import type {
  Prioridade,
  StatusAcao,
  ViewMode,
  PhaseDef,
  PhaseMilestone,
} from "./types";

export const STORAGE_KEY = "plano-sci-eor-codeba-v1";
export const DRAFT_KEY = "plano-sci-eor-codeba-v1-draft";
export const DB_NAME = "plano-sci-eor-codeba-db";
export const STORE_NAME = "app-state";
export const STATE_RECORD_ID = "main";
export const DEFAULT_OPERATOR = "Operador";

export const STATUS_OPTIONS: StatusAcao[] = [
  "Não iniciado",
  "Em andamento",
  "Concluído",
  "Bloqueado",
];

export const PRIORITIES: Prioridade[] = ["Crítica", "Alta", "Média"];

export const VALID_VIEWS: ViewMode[] = [
  "dashboard",
  "kanban",
  "table",
  "cronograma",
  "history",
];

export const VIEW_LABELS: Record<ViewMode, string> = {
  dashboard: "Visão geral",
  kanban: "Quadro",
  table: "Lista",
  cronograma: "Cronograma",
  history: "Auditoria",
};

export const PHASES: PhaseDef[] = [
  {
    id: 1,
    label: "Fase 1 — Ações críticas e impeditivas",
    prazo: "0 a 30 dias",
    startDay: 0,
  },
  {
    id: 2,
    label: "Fase 2 — Operacionalização da norma",
    prazo: "31 a 90 dias",
    startDay: 31,
  },
  {
    id: 3,
    label: "Fase 3 — Aperfeiçoamento e sustentabilidade",
    prazo: "91 a 180 dias",
    startDay: 91,
  },
];

export const PHASE_MILESTONES: PhaseMilestone[] = [
  {
    fase: 1,
    label: "Marco — Minuta v0.1 consolidada",
    prazo: "D+25",
  },
];

export const FIELD_LABELS: Record<string, string> = {
  status: "Status",
  responsavel: "Responsável",
  prazo: "Prazo",
  obs: "Observações",
  bloqueioMotivo: "Motivo do bloqueio",
};

export const OBS_MAX = 4000;
export const HISTORY_MAX = 200;
export const AUTOSAVE_MS = 300;
