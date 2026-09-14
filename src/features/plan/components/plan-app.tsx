"use client";

import { useDeferredValue, useEffect, useMemo, useState } from "react";
import { ArrowLeft } from "lucide-react";
import { parseAsStringEnum, useQueryState } from "nuqs";
import { VALID_VIEWS, VIEW_LABELS } from "../constants";
import { usePlan } from "../hooks/use-plan";
import { filterActions, uniqueResponsaveis, countByStatus } from "../lib/filters";
import type { ActionItem, ViewMode } from "../types";
import { PlanFiltersBar, usePlanFilters } from "./plan-filters";
import { PlanHeader } from "./plan-header";
import { PlanViewNav } from "./plan-view-nav";
import { DashboardView } from "./dashboard-view";
import { TableView } from "./table-view";
import { KanbanView } from "./kanban-view";
import { CronogramaView } from "./cronograma-view";
import { HistoryView } from "./history-view";
import { ActionDetailDialog } from "./action-detail-dialog";
import { Button } from "@/components/ui/button";

const viewParser = parseAsStringEnum<ViewMode>([...VALID_VIEWS]).withDefault(
  "dashboard"
);

export function PlanApp() {
  const { state, ready, setView } = usePlan();
  const [view, setViewQuery] = useQueryState("view", viewParser);
  const filters = usePlanFilters();
  const deferredSearch = useDeferredValue(filters.search);
  const [openId, setOpenId] = useState<string | null>(null);
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    function onScroll() {
      setScrolled(window.scrollY > 8);
    }
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

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

  function goHome() {
    void changeView("dashboard");
  }

  if (!ready) {
    return (
      <div className="mx-auto max-w-6xl p-6 text-sm text-muted-foreground">
        Carregando plano...
      </div>
    );
  }

  const isHome = view === "dashboard";
  const showFilters = view !== "history";

  return (
    <div className="min-h-dvh bg-background">
      <PlanHeader
        view={view}
        progress={progress}
        scrolled={scrolled}
        onHome={goHome}
      />

      <main className="mx-auto grid max-w-[1820px] gap-4 px-3 py-4 sm:px-4">
        <PlanViewNav view={view} onChange={(next) => void changeView(next)} />

        {!isHome && (
          <div className="flex items-center justify-between gap-2 print:hidden">
            <h2 className="truncate text-base font-semibold tracking-tight sm:text-lg">
              {VIEW_LABELS[view]}
            </h2>
            <Button
              type="button"
              variant="ghost"
              size="sm"
              className="h-10 shrink-0 gap-1.5 sm:h-8"
              onClick={goHome}
            >
              <ArrowLeft className="size-3.5" />
              <span className="sm:hidden">Início</span>
              <span className="hidden sm:inline">Visão geral</span>
            </Button>
          </div>
        )}

        {showFilters && !isHome && (
          <div className="print:hidden">
            <PlanFiltersBar />
          </div>
        )}

        <div
          key={view}
          className="animate-in fade-in-0 duration-200 motion-reduce:animate-none"
        >
          {view === "dashboard" && (
            <DashboardView
              actions={filtered}
              onOpen={setOpenId}
              onNavigate={(next) => void changeView(next)}
              filtersSlot={
                <div className="print:hidden">
                  <PlanFiltersBar />
                </div>
              }
            />
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
        </div>
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
