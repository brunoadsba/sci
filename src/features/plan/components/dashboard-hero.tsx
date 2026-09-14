"use client";

import { AlertTriangle, Columns3, ListChecks } from "lucide-react";
import type { ViewMode } from "../types";
import { AcronymLegend } from "./acronym-legend";
import { Button } from "@/components/ui/button";

interface DashboardHeroProps {
  progress: number;
  done: number;
  total: number;
  criticasCount: number;
  onNavigate?: (view: ViewMode) => void;
  onScrollCriticas: () => void;
}

export function DashboardHero({
  progress,
  done,
  total,
  criticasCount,
  onNavigate,
  onScrollCriticas,
}: DashboardHeroProps) {
  return (
    <section
      className="relative overflow-hidden rounded-2xl border bg-card px-4 py-5 sm:px-6 sm:py-6"
      aria-label="Resumo do plano"
    >
      <div
        className="pointer-events-none absolute inset-0 bg-[radial-gradient(900px_circle_at_0%_0%,color-mix(in_oklab,var(--primary)_18%,transparent),transparent_55%)]"
        aria-hidden
      />
      <div className="relative grid gap-5 lg:grid-cols-[1fr_auto] lg:items-end">
        <div className="min-w-0 space-y-2">
          <p className="text-xs font-medium uppercase tracking-wide text-primary">
            NO.S8.8.DIP.01 · Rev. 0
          </p>
          <h2 className="text-xl font-semibold tracking-tight sm:text-2xl">
            Acompanhamento da revisão normativa SCI/EOR
          </h2>
          <AcronymLegend />
          <p className="max-w-2xl text-sm text-muted-foreground">
            Visão geral do plano: lacunas documentais, operacionalização e
            melhorias pós-baseline nos três portos da CODEBA.
          </p>
          <div className="flex flex-col gap-2 pt-2 sm:flex-row sm:flex-wrap">
            <Button
              type="button"
              className="h-11 w-full sm:h-10 sm:w-auto"
              onClick={() => onNavigate?.("kanban")}
            >
              <Columns3 className="size-4" />
              Abrir quadro
            </Button>
            <Button
              type="button"
              variant="outline"
              className="h-11 w-full sm:h-10 sm:w-auto"
              onClick={onScrollCriticas}
            >
              <AlertTriangle className="size-4" />
              Ver críticas ({criticasCount})
            </Button>
            <Button
              type="button"
              variant="ghost"
              className="h-11 w-full sm:h-10 sm:w-auto"
              onClick={() => onNavigate?.("table")}
            >
              <ListChecks className="size-4" />
              Ver lista
            </Button>
          </div>
        </div>

        <div className="w-full min-w-0 rounded-xl border bg-background/70 p-4 sm:max-w-[14rem] lg:w-56">
          <p className="text-xs text-muted-foreground">Progresso geral</p>
          <p className="mt-1 text-3xl font-semibold tabular-nums tracking-tight sm:text-4xl">
            {progress}%
          </p>
          <div className="mt-3 h-2 overflow-hidden rounded-full bg-muted">
            <div
              className="h-full rounded-full bg-primary transition-[width] duration-500 ease-out motion-reduce:transition-none"
              style={{ width: `${progress}%` }}
            />
          </div>
          <p className="mt-2 text-xs text-muted-foreground">
            {done} de {total} ações concluídas
          </p>
        </div>
      </div>
    </section>
  );
}
