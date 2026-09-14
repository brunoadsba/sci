"use client";

import { useRef, useState, type PointerEvent } from "react";
import { GripVertical } from "lucide-react";
import { STATUS_OPTIONS } from "../constants";
import { usePlan } from "../hooks/use-plan";
import type { ActionItem, StatusAcao } from "../types";
import { EmptyPanel } from "./table-view";
import { PriorityBadge } from "./status-badge";
import { StatusSelect } from "./inline-editors";
import { cn } from "@/lib/utils";

interface KanbanViewProps {
  actions: ActionItem[];
  onOpen: (id: string) => void;
}

interface DragState {
  id: string;
  offsetX: number;
  offsetY: number;
}

export function KanbanView({ actions, onOpen }: KanbanViewProps) {
  const { updateAction } = usePlan();
  const [drag, setDrag] = useState<DragState | null>(null);
  const [ghostPos, setGhostPos] = useState({ x: 0, y: 0 });
  const [overStatus, setOverStatus] = useState<StatusAcao | null>(null);
  const moved = useRef(false);
  const ghostLabel = useRef("");

  if (!actions.length) {
    return (
      <EmptyPanel message="Nenhuma ação encontrada com os filtros atuais." />
    );
  }

  function columnAt(x: number, y: number): StatusAcao | null {
    const el = document.elementFromPoint(x, y);
    const col = el?.closest<HTMLElement>("[data-status]");
    const status = col?.dataset.status as StatusAcao | undefined;
    return status && STATUS_OPTIONS.includes(status) ? status : null;
  }

  function onPointerDown(event: PointerEvent<HTMLElement>, action: ActionItem) {
    const handle = (event.target as HTMLElement).closest(".drag-handle");
    if (!handle) return;
    event.preventDefault();
    event.stopPropagation();
    moved.current = false;
    ghostLabel.current = `${action.id} — ${action.acao}`;
    const rect = event.currentTarget.getBoundingClientRect();
    setDrag({
      id: action.id,
      offsetX: event.clientX - rect.left,
      offsetY: event.clientY - rect.top,
    });
    setGhostPos({ x: event.clientX, y: event.clientY });
    event.currentTarget.setPointerCapture(event.pointerId);
  }

  function onPointerMove(event: PointerEvent<HTMLElement>) {
    if (!drag) return;
    moved.current = true;
    setGhostPos({ x: event.clientX, y: event.clientY });
    setOverStatus(columnAt(event.clientX, event.clientY));
  }

  function onPointerUp(event: PointerEvent<HTMLElement>) {
    if (!drag) return;
    const status = columnAt(event.clientX, event.clientY);
    const id = drag.id;
    setDrag(null);
    setOverStatus(null);
    if (moved.current && status) {
      const current = actions.find((a) => a.id === id);
      if (current && current.status !== status) {
        updateAction(id, { status });
      }
    }
  }

  return (
    <>
      <div className="flex gap-3 overflow-x-auto pb-2">
        {STATUS_OPTIONS.map((status) => {
          const items = actions.filter((a) => a.status === status);
          return (
            <section
              key={status}
              data-status={status}
              aria-label={`Coluna ${status}`}
              className={cn(
                "flex w-[min(100%,20rem)] shrink-0 flex-col gap-2 rounded-xl border bg-muted/30 p-3",
                overStatus === status && "ring-2 ring-primary"
              )}
            >
              <header className="flex items-center justify-between gap-2 px-1">
                <h2 className="text-sm font-semibold">{status}</h2>
                <span className="text-xs text-muted-foreground">
                  {items.length}
                </span>
              </header>
              <div className="flex min-h-[8rem] flex-col gap-2">
                {items.map((action) => (
                  <article
                    key={action.id}
                    className={cn(
                      "rounded-lg border bg-card p-3 shadow-sm",
                      drag?.id === action.id && "opacity-50"
                    )}
                    onPointerDown={(e) => onPointerDown(e, action)}
                    onPointerMove={onPointerMove}
                    onPointerUp={onPointerUp}
                    onPointerCancel={() => {
                      setDrag(null);
                      setOverStatus(null);
                    }}
                  >
                    <div className="mb-2 flex items-start gap-2">
                      <button
                        type="button"
                        className="drag-handle mt-0.5 touch-none text-muted-foreground"
                        aria-label={`Arrastar ${action.id}`}
                      >
                        <GripVertical className="size-4" />
                      </button>
                      <button
                        type="button"
                        className="flex-1 text-left text-sm font-medium leading-snug"
                        onClick={() => {
                          if (!moved.current) onOpen(action.id);
                        }}
                      >
                        <span className="font-mono text-xs text-muted-foreground">
                          {action.id}
                        </span>
                        <span className="mt-1 block">{action.acao}</span>
                      </button>
                    </div>
                    <div className="mb-2">
                      <PriorityBadge prioridade={action.prioridade} />
                    </div>
                    <StatusSelect action={action} />
                  </article>
                ))}
              </div>
            </section>
          );
        })}
      </div>

      {drag && (
        <div
          className="pointer-events-none fixed z-50 max-w-xs rounded-lg border bg-card px-3 py-2 text-sm shadow-lg"
          style={{
            left: ghostPos.x - drag.offsetX,
            top: ghostPos.y - drag.offsetY,
          }}
        >
          {ghostLabel.current}
        </div>
      )}
    </>
  );
}
