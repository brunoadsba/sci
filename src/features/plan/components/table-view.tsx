"use client";

import {
  PrazoInput,
  ResponsavelInput,
  StatusSelect,
} from "./inline-editors";
import { PriorityBadge } from "./status-badge";
import type { ActionItem } from "../types";
import { Label } from "@/components/ui/label";

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
    <>
      <ul className="grid gap-3 md:hidden" aria-label="Lista de ações">
        {actions.map((action) => (
          <li key={action.id}>
            <ActionListCard action={action} onOpen={onOpen} />
          </li>
        ))}
      </ul>

      <div className="hidden overflow-x-auto rounded-xl border bg-card md:block">
        <table className="w-full min-w-[960px] border-collapse text-sm">
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
    </>
  );
}

function ActionListCard({
  action,
  onOpen,
}: {
  action: ActionItem;
  onOpen: (id: string) => void;
}) {
  return (
    <article className="rounded-xl border bg-card p-3 shadow-sm">
      <div className="mb-2 flex flex-wrap items-center gap-2">
        <button
          type="button"
          className="font-mono text-xs underline-offset-2 hover:underline"
          onClick={() => onOpen(action.id)}
        >
          {action.id}
        </button>
        <span className="text-xs text-muted-foreground">Fase {action.fase}</span>
        <PriorityBadge prioridade={action.prioridade} />
      </div>
      <button
        type="button"
        className="mb-3 w-full text-left text-sm font-medium leading-snug"
        onClick={() => onOpen(action.id)}
      >
        {action.acao}
      </button>
      <div className="grid gap-2.5">
        <div className="grid gap-1">
          <Label className="text-xs text-muted-foreground">Status</Label>
          <StatusSelect action={action} className="h-10 w-full min-w-0" />
        </div>
        <div className="grid grid-cols-2 gap-2">
          <div className="grid min-w-0 gap-1">
            <Label className="text-xs text-muted-foreground">Responsável</Label>
            <ResponsavelInput
              action={action}
              className="h-10 w-full min-w-0"
            />
          </div>
          <div className="grid min-w-0 gap-1">
            <Label className="text-xs text-muted-foreground">Prazo</Label>
            <PrazoInput action={action} className="h-10 w-full min-w-0" />
          </div>
        </div>
      </div>
    </article>
  );
}

export function EmptyPanel({ message }: { message: string }) {
  return (
    <div className="rounded-xl border bg-card p-8 text-center text-sm text-muted-foreground">
      {message}
    </div>
  );
}
