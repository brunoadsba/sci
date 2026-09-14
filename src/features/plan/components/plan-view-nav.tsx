"use client";

import {
  CalendarRange,
  Columns3,
  History,
  LayoutDashboard,
  List,
} from "lucide-react";
import { VALID_VIEWS, VIEW_LABELS } from "../constants";
import type { ViewMode } from "../types";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

const VIEW_ICONS: Record<ViewMode, typeof LayoutDashboard> = {
  dashboard: LayoutDashboard,
  kanban: Columns3,
  table: List,
  cronograma: CalendarRange,
  history: History,
};

const VIEW_SHORT: Record<ViewMode, string> = {
  dashboard: "Visão",
  kanban: "Quadro",
  table: "Lista",
  cronograma: "Cron.",
  history: "Log",
};

interface PlanViewNavProps {
  view: ViewMode;
  onChange: (view: ViewMode) => void;
}

export function PlanViewNav({ view, onChange }: PlanViewNavProps) {
  return (
    <nav
      className="grid grid-cols-5 gap-0.5 rounded-xl border bg-card/90 p-1 shadow-sm print:hidden sm:flex sm:gap-1 sm:overflow-x-auto"
      aria-label="Modos de visualização"
    >
      {VALID_VIEWS.map((item) => {
        const Icon = VIEW_ICONS[item];
        const active = view === item;
        return (
          <Button
            key={item}
            type="button"
            size="sm"
            variant={active ? "default" : "ghost"}
            className={cn(
              "h-11 min-w-0 flex-col gap-0.5 px-1 text-[10px] leading-tight sm:h-9 sm:min-w-0 sm:flex-1 sm:flex-row sm:gap-1.5 sm:px-3 sm:text-sm",
              active && "pointer-events-none shadow-sm"
            )}
            aria-label={VIEW_LABELS[item]}
            aria-current={active ? "page" : undefined}
            aria-pressed={active}
            onClick={() => onChange(item)}
          >
            <Icon className="size-4 shrink-0" aria-hidden />
            <span className="truncate sm:hidden">{VIEW_SHORT[item]}</span>
            <span className="hidden truncate sm:inline">
              {VIEW_LABELS[item]}
            </span>
          </Button>
        );
      })}
    </nav>
  );
}
