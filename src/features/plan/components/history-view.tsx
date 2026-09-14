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
      <div className="flex justify-end">
        <Button type="button" variant="outline" onClick={clearHistory}>
          Limpar histórico
        </Button>
      </div>
      <ul className="divide-y rounded-xl border bg-card shadow-sm">
        {history.map((entry) => (
          <li key={entry.id} className="grid gap-1 p-4 text-sm">
            <div className="flex flex-wrap items-center gap-2">
              <Badge variant="secondary">
                {entry.type === "importacao" ? "Importação" : "Alteração"}
              </Badge>
              <span className="text-muted-foreground">
                {formatDateTime(entry.timestamp)}
              </span>
              <span className="text-muted-foreground">· {entry.user}</span>
            </div>
            <p>
              <span className="font-mono text-xs">{entry.actionId}</span>{" "}
              {entry.actionTitle}
            </p>
            <p className="text-muted-foreground">
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
