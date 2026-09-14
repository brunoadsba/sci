"use client";

import { useMemo } from "react";
import { useQueryState, parseAsString } from "nuqs";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { PHASES, PRIORITIES, STATUS_OPTIONS } from "../constants";
import { usePlan } from "../hooks/use-plan";
import { uniqueResponsaveis, type PlanFilters } from "../lib/filters";

export function usePlanFilters(): PlanFilters & {
  setSearch: (v: string) => void;
  setFase: (v: string) => void;
  setStatus: (v: string) => void;
  setResponsavel: (v: string) => void;
  setPrioridade: (v: string) => void;
  clear: () => void;
} {
  const [search, setSearch] = useQueryState(
    "q",
    parseAsString.withDefault("").withOptions({ shallow: true })
  );
  const [fase, setFase] = useQueryState(
    "fase",
    parseAsString.withDefault("all").withOptions({ shallow: true })
  );
  const [legacyOnda] = useQueryState(
    "onda",
    parseAsString.withDefault("").withOptions({ shallow: true })
  );
  const [status, setStatus] = useQueryState(
    "status",
    parseAsString.withDefault("all").withOptions({ shallow: true })
  );
  const [responsavel, setResponsavel] = useQueryState(
    "resp",
    parseAsString.withDefault("all").withOptions({ shallow: true })
  );
  const [prioridade, setPrioridade] = useQueryState(
    "prio",
    parseAsString.withDefault("all").withOptions({ shallow: true })
  );

  const resolvedFase =
    fase !== "all" ? fase : legacyOnda && legacyOnda !== "all" ? legacyOnda : "all";

  return {
    search,
    fase: resolvedFase,
    status,
    responsavel,
    prioridade,
    setSearch,
    setFase,
    setStatus,
    setResponsavel,
    setPrioridade,
    clear: () => {
      void setSearch("");
      void setFase("all");
      void setStatus("all");
      void setResponsavel("all");
      void setPrioridade("all");
    },
  };
}

export function PlanFiltersBar() {
  const { state } = usePlan();
  const filters = usePlanFilters();
  const responsaveis = useMemo(
    () => uniqueResponsaveis(state.actions),
    [state.actions]
  );

  return (
    <section
      className="grid gap-3 rounded-xl border bg-card p-3 md:grid-cols-2 lg:grid-cols-6"
      aria-label="Filtros"
    >
      <div className="grid gap-1.5 lg:col-span-2">
        <Label htmlFor="search">Busca</Label>
        <Input
          id="search"
          type="search"
          value={filters.search}
          onChange={(e) => void filters.setSearch(e.target.value)}
          placeholder="ID, ação, responsável, prazo..."
          className="h-9"
        />
      </div>

      <div className="grid gap-1.5">
        <Label>Fase</Label>
        <Select
          value={filters.fase}
          onValueChange={(v) => void filters.setFase(v)}
        >
          <SelectTrigger className="h-9 w-full">
            <SelectValue placeholder="Todas" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">Todas</SelectItem>
            {PHASES.map((phase) => (
              <SelectItem key={phase.id} value={String(phase.id)}>
                Fase {phase.id}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      <div className="grid gap-1.5">
        <Label>Status</Label>
        <Select
          value={filters.status}
          onValueChange={(v) => void filters.setStatus(v)}
        >
          <SelectTrigger className="h-9 w-full">
            <SelectValue placeholder="Todos" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">Todos</SelectItem>
            {STATUS_OPTIONS.map((status) => (
              <SelectItem key={status} value={status}>
                {status}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      <div className="grid gap-1.5">
        <Label>Responsável</Label>
        <Select
          value={filters.responsavel}
          onValueChange={(v) => void filters.setResponsavel(v)}
        >
          <SelectTrigger className="h-9 w-full">
            <SelectValue placeholder="Todos" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">Todos</SelectItem>
            {responsaveis.map((resp) => (
              <SelectItem key={resp} value={resp}>
                {resp}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      <div className="grid gap-1.5">
        <Label>Prioridade</Label>
        <Select
          value={filters.prioridade}
          onValueChange={(v) => void filters.setPrioridade(v)}
        >
          <SelectTrigger className="h-9 w-full">
            <SelectValue placeholder="Todas" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">Todas</SelectItem>
            {PRIORITIES.map((prio) => (
              <SelectItem key={prio} value={prio}>
                {prio}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      <div className="flex items-end lg:col-span-6">
        <Button type="button" variant="outline" size="sm" onClick={filters.clear}>
          Limpar filtros
        </Button>
      </div>
    </section>
  );
}
