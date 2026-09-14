"use client";

import { useEffect, useRef } from "react";
import { useTheme } from "next-themes";
import {
  ChevronDown,
  Download,
  Moon,
  Redo2,
  Sun,
  Undo2,
  Upload,
  UserRound,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { usePlan } from "@/features/plan/hooks/use-plan";
import {
  exportCsv,
  exportHtmlSnapshot,
  exportJson,
} from "@/features/export/export-files";
import { toast } from "sonner";

export function PlanToolbar() {
  const {
    state,
    canUndo,
    canRedo,
    undo,
    redo,
    setUser,
    setTheme,
    restore,
    importState,
  } = usePlan();
  const { setTheme: setNextTheme, resolvedTheme } = useTheme();
  const fileRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    setNextTheme(state.theme);
  }, [state.theme, setNextTheme]);

  useEffect(() => {
    function onKey(event: KeyboardEvent) {
      const mod = event.metaKey || event.ctrlKey;
      if (!mod) return;
      if (event.key.toLowerCase() === "z" && !event.shiftKey) {
        event.preventDefault();
        undo();
      }
      if (
        event.key.toLowerCase() === "y" ||
        (event.key.toLowerCase() === "z" && event.shiftKey)
      ) {
        event.preventDefault();
        redo();
      }
    }
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [undo, redo]);

  function toggleTheme() {
    const next = state.theme === "dark" ? "light" : "dark";
    setTheme(next);
    setNextTheme(next);
  }

  function handleUser() {
    const value = window.prompt("Nome do usuário local", state.user);
    if (value && value.trim()) setUser(value.trim());
  }

  function handleRestore() {
    const ok = window.confirm(
      "Restaurar o plano ao estado inicial? Status, observações e histórico editável serão perdidos."
    );
    if (ok) restore();
  }

  async function onImportFile(file: File) {
    try {
      const text = await file.text();
      const raw = JSON.parse(text);
      importState(raw);
    } catch {
      toast.error("Falha ao ler o arquivo JSON");
    }
  }

  return (
    <div className="flex flex-wrap gap-2" aria-label="Ações gerais">
      <Button
        type="button"
        variant="outline"
        size="sm"
        disabled={!canUndo}
        onClick={undo}
      >
        <Undo2 /> Desfazer
      </Button>
      <Button
        type="button"
        variant="outline"
        size="sm"
        disabled={!canRedo}
        onClick={redo}
      >
        <Redo2 /> Refazer
      </Button>
      <Button type="button" variant="outline" size="sm" onClick={handleUser}>
        <UserRound /> {state.user}
      </Button>
      <Button type="button" variant="outline" size="sm" onClick={toggleTheme}>
        {resolvedTheme === "dark" ? <Sun /> : <Moon />}
        {state.theme === "dark" ? "Tema claro" : "Tema escuro"}
      </Button>

      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button type="button" variant="outline" size="sm">
            <Download /> Exportar <ChevronDown />
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent align="start">
          <DropdownMenuItem
            onClick={() => {
              exportJson(state);
              toast.success("JSON exportado");
            }}
          >
            JSON (backup)
          </DropdownMenuItem>
          <DropdownMenuItem
            onClick={() => {
              exportCsv(state);
              toast.success("CSV exportado");
            }}
          >
            CSV
          </DropdownMenuItem>
          <DropdownMenuItem
            onClick={() => {
              exportHtmlSnapshot(state);
              toast.success("HTML exportado");
            }}
          >
            HTML com status
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>

      <Button
        type="button"
        variant="outline"
        size="sm"
        onClick={() => fileRef.current?.click()}
      >
        <Upload /> Importar
      </Button>
      <Button type="button" variant="destructive" size="sm" onClick={handleRestore}>
        Restaurar
      </Button>

      <input
        ref={fileRef}
        type="file"
        accept=".json,application/json"
        className="hidden"
        onChange={(e) => {
          const file = e.target.files?.[0];
          if (file) void onImportFile(file);
          e.target.value = "";
        }}
      />
    </div>
  );
}
