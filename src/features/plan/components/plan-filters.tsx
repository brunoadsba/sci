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
import { PRIORITIES, STATUS_OPTIONS, WAVES } from "../constants";
import { usePlan } from "../hooks/use-plan";
import { uniqueResponsaveis, type PlanFilters } from "../lib/filters";

export function usePlanFilters(): PlanFilters & {
  setSearch: (v: string) => void;
  setOnda: (v: string) => void;
  setStatus: (v: string) => void;
  setResponsavel: (v: string) => void;
  setPrioridade: (v: string) => void;
  clear: () => void;
} {
  const [search, setSearch] = useQueryState(
    "q",
    parseAsString.withDefault("").withOptions({ shallow: true })
  );
  const [onda, setOnda] = useQueryState(
    "onda",
    parseAsString.withDefault("all").withOptions({ shallow: true })
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

  return {
    search,
    onda,
    status,
    responsavel,
    prioridade,
    setSearch,
    setOnda,
    setStatus,
    setResponsavel,
    setPrioridade,
    clear: () => {
      void setSearch("");
      void setOnda("all");
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
      className="grid gap-3 rounded-xl border bg-card p-4 shadow-sm md:grid-cols-2 lg:grid-cols-6"
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
        />
      </div>

      <div className="grid gap-1.5">
        <Label>Onda</Label>
        <Select
          value={filters.onda}
          onValueChange={(v) => void filters.setOnda(v)}
        >
          <SelectTrigger className="w-full">
            <SelectValue placeholder="Todas" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">Todas</SelectItem>
            {WAVES.map((wave) => (
              <SelectItem key={wave.id} value={String(wave.id)}>
                Onda {wave.id}
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
          <SelectTrigger className="w-full">
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
          <SelectTrigger className="w-full">
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
          <SelectTrigger className="w-full">
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
        <Button type="button" variant="outline" onClick={filters.clear}>
          Limpar filtros
        </Button>
      </div>
    </section>
  );
}
