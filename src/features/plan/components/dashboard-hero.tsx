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
      className="relative overflow-hidden rounded-2xl border bg-card px-3 py-4 sm:px-6 sm:py-6"
      aria-label="Resumo do plano"
    >
      <div
        className="pointer-events-none absolute inset-0 bg-[radial-gradient(900px_circle_at_0%_0%,color-mix(in_oklab,var(--primary)_18%,transparent),transparent_55%)]"
        aria-hidden
      />
      <div className="relative grid gap-4 sm:gap-5 lg:grid-cols-[1fr_auto] lg:items-end">
        <div className="min-w-0 space-y-2">
          <div className="flex flex-wrap items-center justify-between gap-2">
            <p className="text-[11px] font-medium uppercase tracking-wide text-primary sm:text-xs">
              NO.S8.8.DIP.01 · Rev. 0
            </p>
            <p className="tabular-nums text-sm font-semibold sm:hidden">
              {progress}%
              <span className="ml-1 text-xs font-normal text-muted-foreground">
                · {done}/{total}
              </span>
            </p>
          </div>
          <h2 className="text-lg font-semibold tracking-tight sm:text-2xl">
            <span className="sm:hidden">Revisão normativa SCI/EOR</span>
            <span className="hidden sm:inline">
              Acompanhamento da revisão normativa SCI/EOR
            </span>
          </h2>
          <AcronymLegend className="hidden sm:block" />
          <p className="max-w-2xl text-sm text-muted-foreground">
            <span className="sm:hidden">
              Lacunas, operacionalização e melhorias nos portos da CODEBA.
            </span>
            <span className="hidden sm:inline">
              Visão geral do plano: lacunas documentais, operacionalização e
              melhorias pós-baseline nos três portos da CODEBA.
            </span>
          </p>
          <div className="grid grid-cols-2 gap-2 pt-1 sm:flex sm:flex-wrap">
            <Button
              type="button"
              className="col-span-2 h-11 sm:col-auto sm:h-10 sm:w-auto"
              onClick={() => onNavigate?.("kanban")}
            >
              <Columns3 className="size-4" />
              Abrir quadro
            </Button>
            <Button
              type="button"
              variant="outline"
              className="h-11 sm:h-10 sm:w-auto"
              onClick={onScrollCriticas}
            >
              <AlertTriangle className="size-4" />
              <span className="sm:hidden">Críticas ({criticasCount})</span>
              <span className="hidden sm:inline">
                Ver críticas ({criticasCount})
              </span>
            </Button>
            <Button
              type="button"
              variant="ghost"
              className="h-11 sm:h-10 sm:w-auto"
              onClick={() => onNavigate?.("table")}
            >
              <ListChecks className="size-4" />
              Lista
            </Button>
          </div>
        </div>

        <div className="hidden w-full min-w-0 rounded-xl border bg-background/70 p-4 sm:block sm:max-w-[14rem] lg:w-56">
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
