import { z } from "zod";

export const statusSchema = z.enum([
  "Não iniciado",
  "Em andamento",
  "Concluído",
  "Bloqueado",
]);

export const prioridadeSchema = z.enum(["Crítica", "Alta", "Média"]);
export const faseSchema = z.union([z.literal(1), z.literal(2), z.literal(3)]);
export const viewSchema = z.enum([
  "dashboard",
  "kanban",
  "table",
  "cronograma",
  "history",
]);

export const actionItemSchema = z.object({
  id: z.string().min(1).max(32),
  fase: faseSchema,
  prioridade: prioridadeSchema,
  acao: z.string().max(500),
  entregavel: z.string().max(500),
  responsavel: z.string().max(120),
  prazo: z.string().max(40),
  criterio: z.string().max(500),
  status: statusSchema,
  obs: z.string().max(4000).default(""),
  updatedAt: z.string().optional(),
  bloqueioMotivo: z.string().max(500).optional(),
});

/** Import aceita `fase` ou legado `onda`. */
export const importActionSchema = actionItemSchema.partial().extend({
  id: z.string().min(1),
  onda: faseSchema.optional(),
});

export const historyEntrySchema = z.object({
  id: z.string(),
  timestamp: z.string(),
  user: z.string().max(80),
  actionId: z.string().max(32),
  actionTitle: z.string().max(500),
  field: z.string().max(40),
  oldValue: z.string().max(4000),
  newValue: z.string().max(4000),
  type: z.enum(["alteracao", "importacao"]),
});

export const appStateSchema = z.object({
  theme: z.enum(["light", "dark"]).default("light"),
  view: viewSchema.default("dashboard"),
  user: z.string().max(80).default("Operador"),
  baseDate: z.string().default(() => new Date().toISOString().slice(0, 10)),
  updatedAt: z.string(),
  history: z.array(historyEntrySchema).max(200).default([]),
  actions: z.array(actionItemSchema).max(100),
});

export const importPayloadSchema = z.object({
  exportedAt: z.string().optional(),
  updatedAt: z.string().optional(),
  theme: z.enum(["light", "dark"]).optional(),
  view: viewSchema.optional(),
  user: z.string().max(80).optional(),
  baseDate: z.string().optional(),
  history: z.array(historyEntrySchema).max(200).optional(),
  actions: z.array(importActionSchema).max(100).optional(),
});

export type ImportPayload = z.infer<typeof importPayloadSchema>;
