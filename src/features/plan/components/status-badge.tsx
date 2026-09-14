import { Badge } from "@/components/ui/badge";
import type { Prioridade, StatusAcao } from "@/features/plan/types";
import { cn } from "@/lib/utils";

const statusClass: Record<StatusAcao, string> = {
  "Não iniciado": "bg-muted text-muted-foreground",
  "Em andamento": "bg-blue-500/15 text-blue-700 dark:text-blue-300",
  Concluído: "bg-emerald-500/15 text-emerald-700 dark:text-emerald-300",
  Bloqueado: "bg-destructive/15 text-destructive",
};

const prioClass: Record<Prioridade, string> = {
  Crítica: "bg-destructive/15 text-destructive",
  Alta: "bg-amber-500/15 text-amber-800 dark:text-amber-300",
  Média: "bg-muted text-muted-foreground",
};

export function StatusBadge({ status }: { status: StatusAcao }) {
  return (
    <Badge variant="secondary" className={cn("border-0", statusClass[status])}>
      {status}
    </Badge>
  );
}

export function PriorityBadge({ prioridade }: { prioridade: Prioridade }) {
  return (
    <Badge
      variant="secondary"
      className={cn("border-0", prioClass[prioridade])}
    >
      {prioridade}
    </Badge>
  );
}
