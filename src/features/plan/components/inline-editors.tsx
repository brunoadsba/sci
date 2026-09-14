"use client";

import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { STATUS_OPTIONS } from "../constants";
import { usePlan } from "../hooks/use-plan";
import type { ActionItem, StatusAcao } from "../types";

export function StatusSelect({ action }: { action: ActionItem }) {
  const { updateAction } = usePlan();
  return (
    <Select
      value={action.status}
      onValueChange={(value) =>
        updateAction(action.id, { status: value as StatusAcao })
      }
    >
      <SelectTrigger
        className="h-8 min-w-[9.5rem]"
        onClick={(e) => e.stopPropagation()}
        aria-label={`Status de ${action.id}`}
      >
        <SelectValue />
      </SelectTrigger>
      <SelectContent>
        {STATUS_OPTIONS.map((status) => (
          <SelectItem key={status} value={status}>
            {status}
          </SelectItem>
        ))}
      </SelectContent>
    </Select>
  );
}

export function ResponsavelInput({ action }: { action: ActionItem }) {
  const { updateAction } = usePlan();
  return (
    <Input
      key={`${action.id}-resp-${action.responsavel}`}
      className="h-8 min-w-[8rem]"
      defaultValue={action.responsavel}
      list="responsaveis-list"
      aria-label={`Responsável de ${action.id}`}
      onClick={(e) => e.stopPropagation()}
      onBlur={(e) => {
        const value = e.target.value.trim();
        if (value && value !== action.responsavel) {
          updateAction(action.id, { responsavel: value });
        }
      }}
      onKeyDown={(e) => {
        if (e.key === "Enter") (e.target as HTMLInputElement).blur();
      }}
    />
  );
}

export function PrazoInput({ action }: { action: ActionItem }) {
  const { updateAction } = usePlan();
  return (
    <Input
      key={`${action.id}-prazo-${action.prazo}`}
      className="h-8 min-w-[5.5rem]"
      defaultValue={action.prazo}
      aria-label={`Prazo de ${action.id}`}
      onClick={(e) => e.stopPropagation()}
      onBlur={(e) => {
        const value = e.target.value.trim();
        if (value && value !== action.prazo) {
          updateAction(action.id, { prazo: value });
        }
      }}
      onKeyDown={(e) => {
        if (e.key === "Enter") (e.target as HTMLInputElement).blur();
      }}
    />
  );
}
