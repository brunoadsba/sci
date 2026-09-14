"use client";

import Image from "next/image";
import { useDeferredValue, useMemo, useState } from "react";
import { parseAsStringEnum, useQueryState } from "nuqs";
import { VALID_VIEWS, VIEW_LABELS } from "../constants";
import { usePlan } from "../hooks/use-plan";
import { filterActions, uniqueResponsaveis, countByStatus } from "../lib/filters";
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
import { Badge } from "@/components/ui/badge";
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
      fase: filters.fase,
      status: filters.status,
      responsavel: filters.responsavel,
      prioridade: filters.prioridade,
    }),
    [
      deferredSearch,
      filters.fase,
      filters.status,
      filters.responsavel,
      filters.prioridade,
    ]
  );

  const filtered = useMemo(
    () => filterActions(state.actions, filterValues),
    [state.actions, filterValues]
  );

  const progress = useMemo(() => {
    const counts = countByStatus(state.actions);
    const total = state.actions.length;
    return total === 0 ? 0 : Math.round((counts.Concluído / total) * 100);
  }, [state.actions]);

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
      <header className="sticky top-0 z-40 border-b bg-card/95 backdrop-blur print:hidden">
        <div className="mx-auto flex max-w-[1820px] flex-col gap-3 px-3 py-3 sm:px-4">
          <div className="flex flex-wrap items-center justify-between gap-3">
            <div className="flex min-w-0 items-center gap-3">
              <div className="rounded-md bg-white px-2 py-1 shadow-sm ring-1 ring-border/60">
                <Image
                  src="/logo-codeba.png"
                  alt="Autoridade Portuária CODEBA"
                  width={160}
                  height={40}
                  className="h-7 w-auto sm:h-9"
                  priority
                />
              </div>
              <div className="min-w-0">
                <h1 className="truncate text-base font-semibold tracking-tight sm:text-lg">
                  Plano de Ação SCI/EOR — CODEBA
                </h1>
                <p className="truncate text-xs text-muted-foreground sm:text-sm">
                  NO.S8.8.DIP.01 · Acompanhamento da revisão normativa
                </p>
              </div>
            </div>

            <div className="flex flex-wrap items-center gap-2">
              <Badge variant="secondary" className="font-medium">
                Progresso {progress}%
              </Badge>
              <PlanToolbar />
            </div>
          </div>
        </div>
      </header>

      <main className="mx-auto grid max-w-[1820px] gap-4 px-3 py-4 sm:px-4">
        <nav
          className="flex gap-1 overflow-x-auto rounded-xl border bg-card p-1 print:hidden"
          aria-label="Modos de visualização"
        >
          {VALID_VIEWS.map((item) => (
            <Button
              key={item}
              type="button"
              size="sm"
              variant={view === item ? "default" : "ghost"}
              className={cn(
                "shrink-0",
                view === item && "pointer-events-none"
              )}
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
