"use client";

import Image from "next/image";
import { ArrowLeft, ChevronRight } from "lucide-react";
import { VIEW_LABELS } from "../constants";
import type { ViewMode } from "../types";
import { PlanToolbar } from "./plan-toolbar";
import { AcronymInfoButton, AcronymLegend } from "./acronym-legend";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

interface PlanHeaderProps {
  view: ViewMode;
  progress: number;
  scrolled: boolean;
  onHome: () => void;
}

export function PlanHeader({
  view,
  progress,
  scrolled,
  onHome,
}: PlanHeaderProps) {
  const isHome = view === "dashboard";

  return (
    <header
      className={cn(
        "sticky top-0 z-40 border-b backdrop-blur-md print:hidden transition-shadow duration-200",
        "bg-[linear-gradient(180deg,color-mix(in_oklab,var(--primary)_8%,var(--card))_0%,color-mix(in_oklab,var(--card)_92%,transparent)_100%)]",
        scrolled && "shadow-md"
      )}
    >
      <div className="mx-auto max-w-[1820px] px-3 py-2.5 sm:px-4 sm:py-3">
        <div className="flex items-center gap-2 sm:gap-3">
          {!isHome && (
            <Button
              type="button"
              variant="outline"
              size="icon"
              className="size-9 shrink-0 sm:size-9"
              onClick={onHome}
              aria-label="Voltar para Visão geral"
            >
              <ArrowLeft className="size-4" />
            </Button>
          )}

          <button
            type="button"
            onClick={onHome}
            className="shrink-0 rounded-md bg-card px-1.5 py-1 shadow-sm ring-1 ring-border/60 transition-opacity hover:opacity-90 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring dark:bg-muted sm:px-2 sm:py-1.5"
            aria-label="Ir para Visão geral"
          >
            <Image
              src="/logo-codeba.png"
              alt=""
              width={160}
              height={40}
              className="h-6 w-auto sm:h-9"
              priority
            />
          </button>

          <div className="min-w-0 flex-1">
            <div className="flex min-w-0 items-center gap-0.5">
              <h1 className="truncate text-sm font-semibold tracking-tight sm:text-lg">
                <span className="sm:hidden">SCI/EOR · CODEBA</span>
                <span className="hidden sm:inline">
                  Plano de Ação SCI/EOR — CODEBA
                </span>
              </h1>
              <AcronymInfoButton className="md:hidden" />
            </div>
            <AcronymLegend className="mt-0.5 hidden md:block" />
            <nav
              className="mt-0.5 flex min-w-0 items-center gap-1 text-[11px] text-muted-foreground sm:text-xs"
              aria-label="Localização"
            >
              <button
                type="button"
                onClick={onHome}
                className="shrink-0 rounded-sm font-medium text-foreground/80 underline-offset-2 hover:underline focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
              >
                Plano
              </button>
              <ChevronRight
                className="size-3 shrink-0 opacity-60"
                aria-hidden
              />
              <span className="truncate" aria-current="page">
                {VIEW_LABELS[view]}
              </span>
            </nav>
          </div>

          <div className="flex shrink-0 items-center gap-1.5 sm:gap-2">
            <div
              className="hidden w-28 sm:block"
              aria-label={`Progresso ${progress}%`}
            >
              <div className="mb-1 flex items-center justify-between gap-2 text-[11px] font-medium text-muted-foreground">
                <span>Progresso</span>
                <span className="tabular-nums text-foreground">{progress}%</span>
              </div>
              <div className="h-1.5 overflow-hidden rounded-full bg-muted">
                <div
                  className="h-full rounded-full bg-primary transition-[width] duration-500 ease-out motion-reduce:transition-none"
                  style={{ width: `${progress}%` }}
                />
              </div>
            </div>
            {!isHome && (
              <span
                className="tabular-nums text-xs font-medium text-muted-foreground sm:hidden"
                aria-label={`Progresso ${progress}%`}
              >
                {progress}%
              </span>
            )}
            <PlanToolbar />
          </div>
        </div>
      </div>
    </header>
  );
}
