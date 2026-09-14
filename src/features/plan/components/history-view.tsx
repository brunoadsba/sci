"use client";

import { Button } from "@/components/ui/button";
import { fieldLabel, usePlan } from "../hooks/use-plan";
import { formatDateTime } from "@/lib/dates";
import { EmptyPanel } from "./table-view";
import { Badge } from "@/components/ui/badge";

export function HistoryView() {
  const { state, clearHistory } = usePlan();
  const history = state.history.filter(
    (entry) => entry.type === "alteracao" || entry.type === "importacao"
  );

  if (!history.length) {
    return (
      <div className="grid gap-3">
        <EmptyPanel message="Nenhuma alteração registrada ainda." />
      </div>
    );
  }

  return (
    <div className="grid gap-3">
      <div className="flex sm:justify-end">
        <Button
          type="button"
          variant="outline"
          className="h-10 w-full sm:h-8 sm:w-auto"
          onClick={clearHistory}
        >
          Limpar histórico
        </Button>
      </div>
      <ul className="divide-y rounded-xl border bg-card shadow-sm">
        {history.map((entry) => (
          <li key={entry.id} className="grid gap-1 p-3 text-sm sm:p-4">
            <div className="flex flex-wrap items-center gap-2">
              <Badge variant="secondary">
                {entry.type === "importacao" ? "Importação" : "Alteração"}
              </Badge>
              <span className="text-muted-foreground">
                {formatDateTime(entry.timestamp)}
              </span>
              <span className="text-muted-foreground">· {entry.user}</span>
            </div>
            <p className="break-words">
              <span className="font-mono text-xs">{entry.actionId}</span>{" "}
              {entry.actionTitle}
            </p>
            <p className="break-words text-muted-foreground">
              {fieldLabel(entry.field)}:{" "}
              <span className="line-through">{entry.oldValue || "—"}</span>
              {" → "}
              <span className="text-foreground">{entry.newValue || "—"}</span>
            </p>
          </li>
        ))}
      </ul>
    </div>
  );
}
