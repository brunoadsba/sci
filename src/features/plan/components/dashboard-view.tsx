"use client";

import { useRef, type ReactNode } from "react";
import { PHASE_MILESTONES, PHASES } from "../constants";
import type { ActionItem, ViewMode } from "../types";
import { countByStatus } from "../lib/filters";
import { PriorityBadge, StatusBadge } from "./status-badge";
import { DashboardHero } from "./dashboard-hero";
import { DashboardKpi } from "./dashboard-kpi";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

interface DashboardViewProps {
  actions: ActionItem[];
  onOpen: (id: string) => void;
  onNavigate?: (view: ViewMode) => void;
  filtersSlot?: ReactNode;
}

export function DashboardView({
  actions,
  onOpen,
  onNavigate,
  filtersSlot,
}: DashboardViewProps) {
  const criticasRef = useRef<HTMLDivElement>(null);
  const counts = countByStatus(actions);
  const total = actions.length;
  const progress =
    total === 0 ? 0 : Math.round((counts.Concluído / total) * 100);
  const criticas = actions.filter(
    (a) => a.prioridade === "Crítica" && a.status !== "Concluído"
  );

  const byPhase = PHASES.map((phase) => {
    const items = actions.filter((a) => a.fase === phase.id);
    const done = items.filter((a) => a.status === "Concluído").length;
    return { phase, total: items.length, done };
  });

  return (
    <div className="grid gap-4">
      <DashboardHero
        progress={progress}
        done={counts.Concluído}
        total={total}
        criticasCount={criticas.length}
        onNavigate={onNavigate}
        onScrollCriticas={() =>
          criticasRef.current?.scrollIntoView({
            behavior: "smooth",
            block: "start",
          })
        }
      />

      <section
        className="grid grid-cols-2 gap-3 sm:grid-cols-3 lg:grid-cols-5"
        aria-label="Indicadores"
      >
        <DashboardKpi title="Total" value={String(total)} />
        <DashboardKpi title="Concluídas" value={String(counts.Concluído)} accent />
        <DashboardKpi title="Bloqueadas" value={String(counts.Bloqueado)} />
        <DashboardKpi title="Críticas abertas" value={String(criticas.length)} warn />
        <DashboardKpi
          title="Em andamento"
          value={String(counts["Em andamento"])}
          className="col-span-2 sm:col-span-1"
        />
      </section>

      {filtersSlot}

      <div className="grid gap-4 lg:grid-cols-2">
        <Card className="shadow-none">
          <CardHeader className="pb-3">
            <CardTitle className="text-base">Status</CardTitle>
          </CardHeader>
          <CardContent className="grid gap-3">
            {(Object.keys(counts) as (keyof typeof counts)[]).map((status) => {
              const pct = total ? Math.round((counts[status] / total) * 100) : 0;
              return (
                <div key={status} className="grid gap-1">
                  <div className="flex justify-between text-sm">
                    <span>{status}</span>
                    <span className="text-muted-foreground">
                      {counts[status]} ({pct}%)
                    </span>
                  </div>
                  <div className="h-2 overflow-hidden rounded-full bg-muted">
                    <div
                      className="h-full rounded-full bg-primary transition-[width] duration-500 ease-out motion-reduce:transition-none"
                      style={{ width: `${pct}%` }}
                    />
                  </div>
                </div>
              );
            })}
          </CardContent>
        </Card>

        <Card className="shadow-none">
          <CardHeader className="pb-3">
            <CardTitle className="text-base">Progresso por fase</CardTitle>
          </CardHeader>
          <CardContent className="grid gap-3">
            {byPhase.map(({ phase, total: t, done }) => {
              const pct = t ? Math.round((done / t) * 100) : 0;
              return (
                <div key={phase.id} className="grid gap-1">
                  <div className="flex justify-between gap-2 text-sm">
                    <span className="font-medium">Fase {phase.id}</span>
                    <span className="text-muted-foreground">
                      {done}/{t} ({pct}%)
                    </span>
                  </div>
                  <p className="text-xs text-muted-foreground">{phase.prazo}</p>
                  <div className="h-2 overflow-hidden rounded-full bg-muted">
                    <div
                      className="h-full rounded-full bg-primary/80 transition-[width] duration-500 ease-out motion-reduce:transition-none"
                      style={{ width: `${pct}%` }}
                    />
                  </div>
                </div>
              );
            })}
            <ul className="mt-2 space-y-1 border-t pt-3 text-sm text-muted-foreground">
              {PHASE_MILESTONES.map((m) => (
                <li key={`${m.fase}-${m.label}`}>
                  {m.label} ({m.prazo})
                </li>
              ))}
            </ul>
          </CardContent>
        </Card>
      </div>

      <div ref={criticasRef}>
        <Card className="shadow-none">
          <CardHeader className="pb-3">
            <CardTitle className="text-base">Críticas em aberto</CardTitle>
          </CardHeader>
          <CardContent>
            {criticas.length === 0 ? (
              <p className="text-sm text-muted-foreground">
                Nenhuma ação crítica pendente nos filtros atuais.
              </p>
            ) : (
              <ul className="divide-y">
                {criticas.map((action) => (
                  <li key={action.id}>
                    <button
                      type="button"
                      className="-mx-1 flex w-full flex-col gap-1 rounded-md px-1 py-3.5 text-left transition-colors hover:bg-muted/40 active:bg-muted/60 focus-visible:bg-muted/40 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
                      onClick={() => onOpen(action.id)}
                    >
                      <div className="flex flex-wrap items-center gap-2">
                        <span className="font-mono text-xs">{action.id}</span>
                        <PriorityBadge prioridade={action.prioridade} />
                        <StatusBadge status={action.status} />
                      </div>
                      <span className="text-sm">{action.acao}</span>
                    </button>
                  </li>
                ))}
              </ul>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
