"use client";

import { useDeferredValue, useMemo, useState } from "react";
import { parseAsStringEnum, useQueryState } from "nuqs";
import { VALID_VIEWS, VIEW_LABELS } from "../constants";
import { usePlan } from "../hooks/use-plan";
import { filterActions, uniqueResponsaveis } from "../lib/filters";
import type { ActionItem, ViewMode } from "../types";
import { PlanFiltersBar, usePlanFilters } from "./plan-filters";
import { PlanToolbar } from "./plan-toolbar";
import { DashboardView } from "./dashboard-view";
import { TableView } from "./table-view";
import { KanbanView } from "./kanban-view";
import { CronogramaView } from "./cronograma-view";
import { HistoryView } from "./history-view";
import { ActionDetailDialog } from "./action-detail-dialog";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

const viewParser = parseAsStringEnum<ViewMode>([...VALID_VIEWS]).withDefault(
  "dashboard"
);

export function PlanApp() {
  const { state, ready, setView } = usePlan();
  const [view, setViewQuery] = useQueryState("view", viewParser);
  const filters = usePlanFilters();
  const deferredSearch = useDeferredValue(filters.search);
  const [openId, setOpenId] = useState<string | null>(null);

  const filterValues = useMemo(
    () => ({
      search: deferredSearch,
      onda: filters.onda,
      status: filters.status,
      responsavel: filters.responsavel,
      prioridade: filters.prioridade,
    }),
    [
      deferredSearch,
      filters.onda,
      filters.status,
      filters.responsavel,
      filters.prioridade,
    ]
  );

  const filtered = useMemo(
    () => filterActions(state.actions, filterValues),
    [state.actions, filterValues]
  );

  const activeAction: ActionItem | null = useMemo(
    () => state.actions.find((a) => a.id === openId) ?? null,
    [state.actions, openId]
  );

  const responsaveis = useMemo(
    () => uniqueResponsaveis(state.actions),
    [state.actions]
  );

  async function changeView(next: ViewMode) {
    setView(next);
    await setViewQuery(next);
  }

  if (!ready) {
    return (
      <div className="mx-auto max-w-6xl p-6 text-sm text-muted-foreground">
        Carregando plano...
      </div>
    );
  }

  return (
    <div className="min-h-dvh bg-background">
      <header className="sticky top-0 z-40 border-b bg-card/95 shadow-sm backdrop-blur print:hidden">
        <div className="mx-auto flex max-w-[1820px] flex-col gap-3 px-3 py-3 sm:px-4">
          <div>
            <h1 className="text-lg font-semibold tracking-tight sm:text-xl">
              Plano de Ação SCI/EOR — CODEBA
            </h1>
            <p className="text-sm text-muted-foreground">
              NO.S8.8.DIP.01 · Persistência local com autosave · Single-user
            </p>
          </div>
          <PlanToolbar />
        </div>
      </header>

      <main className="mx-auto grid max-w-[1820px] gap-4 px-3 py-4 sm:px-4">
        <nav
          className="flex gap-2 overflow-x-auto rounded-xl border bg-card p-2 shadow-sm print:hidden"
          aria-label="Modos de visualização"
        >
          {VALID_VIEWS.map((item) => (
            <Button
              key={item}
              type="button"
              size="sm"
              variant={view === item ? "default" : "ghost"}
              className={cn("shrink-0", view === item && "pointer-events-none")}
              aria-pressed={view === item}
              onClick={() => void changeView(item)}
            >
              {VIEW_LABELS[item]}
            </Button>
          ))}
        </nav>

        {view !== "history" && (
          <div className="print:hidden">
            <PlanFiltersBar />
          </div>
        )}

        {view === "dashboard" && (
          <DashboardView actions={filtered} onOpen={setOpenId} />
        )}
        {view === "table" && (
          <TableView actions={filtered} onOpen={setOpenId} />
        )}
        {view === "kanban" && (
          <KanbanView actions={filtered} onOpen={setOpenId} />
        )}
        {view === "cronograma" && (
          <CronogramaView actions={filtered} onOpen={setOpenId} />
        )}
        {view === "history" && <HistoryView />}
      </main>

      <datalist id="responsaveis-list">
        {responsaveis.map((resp) => (
          <option key={resp} value={resp} />
        ))}
      </datalist>

      <ActionDetailDialog
        action={activeAction}
        open={Boolean(openId)}
        onOpenChange={(open) => {
          if (!open) setOpenId(null);
        }}
      />
    </div>
  );
}
