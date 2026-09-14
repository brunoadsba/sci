"use client";

import {
  PrazoInput,
  ResponsavelInput,
  StatusSelect,
} from "./inline-editors";
import { PriorityBadge } from "./status-badge";
import type { ActionItem } from "../types";

interface TableViewProps {
  actions: ActionItem[];
  onOpen: (id: string) => void;
}

export function TableView({ actions, onOpen }: TableViewProps) {
  if (!actions.length) {
    return (
      <EmptyPanel message="Nenhuma ação encontrada com os filtros atuais." />
    );
  }

  return (
    <div className="overflow-x-auto rounded-xl border bg-card">
      <table className="w-full min-w-[1100px] border-collapse text-sm">
        <thead className="sticky top-0 z-10 bg-muted/90 text-left backdrop-blur">
          <tr>
            <th className="px-3 py-2.5 font-medium">ID</th>
            <th className="px-3 py-2.5 font-medium">Fase</th>
            <th className="px-3 py-2.5 font-medium">Prioridade</th>
            <th className="px-3 py-2.5 font-medium">Ação</th>
            <th className="px-3 py-2.5 font-medium">Status</th>
            <th className="px-3 py-2.5 font-medium">Responsável</th>
            <th className="px-3 py-2.5 font-medium">Prazo</th>
          </tr>
        </thead>
        <tbody>
          {actions.map((action) => (
            <tr key={action.id} className="border-t hover:bg-muted/30">
              <td className="px-3 py-2 font-mono text-xs">
                <button
                  type="button"
                  className="underline-offset-2 hover:underline"
                  onClick={() => onOpen(action.id)}
                >
                  {action.id}
                </button>
              </td>
              <td className="px-3 py-2">{action.fase}</td>
              <td className="px-3 py-2">
                <PriorityBadge prioridade={action.prioridade} />
              </td>
              <td className="max-w-[28rem] px-3 py-2">
                <button
                  type="button"
                  className="text-left hover:underline"
                  onClick={() => onOpen(action.id)}
                >
                  {action.acao}
                </button>
              </td>
              <td className="px-3 py-2">
                <StatusSelect action={action} />
              </td>
              <td className="px-3 py-2">
                <ResponsavelInput action={action} />
              </td>
              <td className="px-3 py-2">
                <PrazoInput action={action} />
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

export function EmptyPanel({ message }: { message: string }) {
  return (
    <div className="rounded-xl border bg-card p-8 text-center text-sm text-muted-foreground">
      {message}
    </div>
  );
}
