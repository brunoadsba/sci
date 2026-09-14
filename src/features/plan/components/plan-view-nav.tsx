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
  dashboard: "Início",
  kanban: "Quadro",
  table: "Lista",
  cronograma: "Agenda",
  history: "Log",
};

interface PlanViewNavProps {
  view: ViewMode;
  onChange: (view: ViewMode) => void;
}

export function PlanViewNav({ view, onChange }: PlanViewNavProps) {
  return (
    <nav
      className="flex gap-1 overflow-x-auto overscroll-x-contain rounded-xl border bg-card/90 p-1 shadow-sm snap-x snap-mandatory print:hidden"
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
              "h-10 min-h-10 shrink-0 snap-start gap-1.5 px-3 sm:h-9",
              active && "pointer-events-none shadow-sm"
            )}
            aria-current={active ? "page" : undefined}
            aria-pressed={active}
            onClick={() => onChange(item)}
          >
            <Icon className="size-4 shrink-0" aria-hidden />
            <span className="sm:hidden">{VIEW_SHORT[item]}</span>
            <span className="hidden sm:inline">{VIEW_LABELS[item]}</span>
          </Button>
        );
      })}
    </nav>
  );
}
