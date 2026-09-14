"use client";

import { WAVE_MILESTONES, WAVES } from "../constants";
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
      <div className="flex flex-wrap items-end gap-3 rounded-xl border bg-card p-4 shadow-sm">
        <div className="grid gap-1.5">
          <Label htmlFor="baseDate">Data-base do cronograma</Label>
          <Input
            id="baseDate"
            type="date"
            value={base}
            onChange={(e) => setBaseDate(e.target.value)}
            className="w-auto"
          />
        </div>
        <p className="text-sm text-muted-foreground">
          Barras estimadas por onda e prazo D+N (não é Gantt de dependências).
        </p>
      </div>

      {WAVES.map((wave) => {
        const items = actions.filter((a) => a.onda === wave.id);
        if (!items.length) return null;
        const milestone = WAVE_MILESTONES.find((m) => m.onda === wave.id);

        return (
          <section
            key={wave.id}
            className="rounded-xl border bg-card p-4 shadow-sm"
            aria-label={wave.label}
          >
            <header className="mb-3">
              <h2 className="text-sm font-semibold">{wave.label}</h2>
              <p className="text-xs text-muted-foreground">{wave.prazo}</p>
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
                      <span className="text-muted-foreground">
                        até {end}
                      </span>
                    </div>
                    <p className="text-sm">{action.acao}</p>
                    <div className="h-2 overflow-hidden rounded-full bg-muted">
                      <div
                        className="h-full rounded-full bg-primary/70"
                        style={{
                          marginLeft: `${(wave.startDay / 180) * 100}%`,
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
