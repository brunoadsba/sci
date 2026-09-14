"use client";

import { PHASE_MILESTONES, PHASES } from "../constants";
import { addDays, formatDate, parsePrazoDays } from "@/lib/dates";
import type { ActionItem } from "../types";
import { EmptyPanel } from "./table-view";
import { PriorityBadge, StatusBadge } from "./status-badge";
import { usePlan } from "../hooks/use-plan";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

interface CronogramaViewProps {
  actions: ActionItem[];
  onOpen: (id: string) => void;
}

export function CronogramaView({ actions, onOpen }: CronogramaViewProps) {
  const { state, setBaseDate } = usePlan();
  const base = state.baseDate;

  if (!actions.length) {
    return (
      <EmptyPanel message="Nenhuma ação encontrada com os filtros atuais." />
    );
  }

  return (
    <div className="grid gap-4">
      <div className="flex flex-wrap items-end gap-3 rounded-xl border bg-card p-4">
        <div className="grid gap-1.5">
          <Label htmlFor="baseDate">Data-base do cronograma</Label>
          <Input
            id="baseDate"
            type="date"
            value={base}
            onChange={(e) => setBaseDate(e.target.value)}
            className="h-9 w-auto"
          />
        </div>
        <p className="text-sm text-muted-foreground">
          Barras estimadas por fase e prazo D+N (não é Gantt de dependências).
        </p>
      </div>

      {PHASES.map((phase) => {
        const items = actions.filter((a) => a.fase === phase.id);
        if (!items.length) return null;
        const milestone = PHASE_MILESTONES.find((m) => m.fase === phase.id);

        return (
          <section
            key={phase.id}
            className="rounded-xl border bg-card p-4"
            aria-label={phase.label}
          >
            <header className="mb-3">
              <h2 className="text-sm font-semibold">{phase.label}</h2>
              <p className="text-xs text-muted-foreground">{phase.prazo}</p>
              {milestone && (
                <p className="mt-1 text-xs text-primary">
                  {milestone.label} — {milestone.prazo}
                </p>
              )}
            </header>
            <ul className="space-y-3">
              {items.map((action) => {
                const days = parsePrazoDays(action.prazo);
                const end =
                  days !== null
                    ? formatDate(addDays(base, days))
                    : action.prazo;
                const width =
                  days !== null
                    ? Math.min(100, Math.max(8, (days / 180) * 100))
                    : 20;

                return (
                  <li key={action.id} className="grid gap-1.5">
                    <div className="flex flex-wrap items-center gap-2 text-sm">
                      <button
                        type="button"
                        className="font-mono text-xs underline-offset-2 hover:underline"
                        onClick={() => onOpen(action.id)}
                      >
                        {action.id}
                      </button>
                      <PriorityBadge prioridade={action.prioridade} />
                      <StatusBadge status={action.status} />
                      <span className="text-muted-foreground">até {end}</span>
                    </div>
                    <p className="text-sm">{action.acao}</p>
                    <div className="h-2 overflow-hidden rounded-full bg-muted">
                      <div
                        className="h-full rounded-full bg-primary/70"
                        style={{
                          marginLeft: `${(phase.startDay / 180) * 100}%`,
                          width: `${width}%`,
                        }}
                      />
                    </div>
                  </li>
                );
              })}
            </ul>
          </section>
        );
      })}
    </div>
  );
}
