"use client";

import { useEffect, useRef, useState } from "react";
import { useTheme } from "next-themes";
import {
  ChevronDown,
  Download,
  MoreHorizontal,
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
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  Dialog,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
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
  const [operatorOpen, setOperatorOpen] = useState(false);
  const [operatorName, setOperatorName] = useState(state.user);
  const [restoreOpen, setRestoreOpen] = useState(false);

  useEffect(() => {
    setNextTheme(state.theme);
  }, [state.theme, setNextTheme]);

  useEffect(() => {
    setOperatorName(state.user);
  }, [state.user]);

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
    <>
      <div className="flex flex-wrap items-center gap-1.5" aria-label="Ações gerais">
        <Button
          type="button"
          variant="outline"
          size="icon-sm"
          className="hidden size-8 sm:inline-flex"
          disabled={!canUndo}
          onClick={undo}
          aria-label="Desfazer"
        >
          <Undo2 />
        </Button>
        <Button
          type="button"
          variant="outline"
          size="icon-sm"
          className="hidden size-8 sm:inline-flex"
          disabled={!canRedo}
          onClick={redo}
          aria-label="Refazer"
        >
          <Redo2 />
        </Button>

        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button
              type="button"
              variant="outline"
              size="sm"
              className="hidden h-8 sm:inline-flex"
            >
              <Download />
              Exportar
              <ChevronDown />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end">
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
          size="icon-sm"
          className="size-10 sm:size-8"
          onClick={toggleTheme}
          aria-label="Alternar tema"
        >
          {resolvedTheme === "dark" ? <Sun /> : <Moon />}
        </Button>

        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button
              type="button"
              variant="outline"
              size="icon-sm"
              className="size-10 sm:size-8"
              aria-label="Mais opções"
            >
              <MoreHorizontal />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end">
            <DropdownMenuItem
              className="sm:hidden"
              disabled={!canUndo}
              onClick={undo}
            >
              <Undo2 /> Desfazer
            </DropdownMenuItem>
            <DropdownMenuItem
              className="sm:hidden"
              disabled={!canRedo}
              onClick={redo}
            >
              <Redo2 /> Refazer
            </DropdownMenuItem>
            <DropdownMenuSeparator className="sm:hidden" />
            <DropdownMenuItem
              className="sm:hidden"
              onClick={() => {
                exportJson(state);
                toast.success("JSON exportado");
              }}
            >
              <Download /> Exportar JSON
            </DropdownMenuItem>
            <DropdownMenuItem
              className="sm:hidden"
              onClick={() => {
                exportCsv(state);
                toast.success("CSV exportado");
              }}
            >
              <Download /> Exportar CSV
            </DropdownMenuItem>
            <DropdownMenuItem
              className="sm:hidden"
              onClick={() => {
                exportHtmlSnapshot(state);
                toast.success("HTML exportado");
              }}
            >
              <Download /> Exportar HTML
            </DropdownMenuItem>
            <DropdownMenuSeparator className="sm:hidden" />
            <DropdownMenuItem onClick={() => setOperatorOpen(true)}>
              <UserRound /> Operador: {state.user}
            </DropdownMenuItem>
            <DropdownMenuItem onClick={() => fileRef.current?.click()}>
              <Upload /> Importar JSON
            </DropdownMenuItem>
            <DropdownMenuSeparator />
            <DropdownMenuItem
              variant="destructive"
              onClick={() => setRestoreOpen(true)}
            >
              Restaurar plano
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>

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

      <Dialog open={operatorOpen} onOpenChange={setOperatorOpen}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle>Operador</DialogTitle>
          </DialogHeader>
          <div className="grid gap-2">
            <Label htmlFor="operatorName">
              Nome usado no histórico de alterações
            </Label>
            <Input
              id="operatorName"
              value={operatorName}
              onChange={(e) => setOperatorName(e.target.value)}
              maxLength={80}
              autoFocus
            />
          </div>
          <DialogFooter>
            <Button
              type="button"
              variant="outline"
              onClick={() => setOperatorOpen(false)}
            >
              Cancelar
            </Button>
            <Button
              type="button"
              onClick={() => {
                const value = operatorName.trim();
                if (value) setUser(value);
                setOperatorOpen(false);
              }}
            >
              Salvar
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      <AlertDialog open={restoreOpen} onOpenChange={setRestoreOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Restaurar o plano?</AlertDialogTitle>
            <AlertDialogDescription>
              Status, observações e histórico editável serão perdidos. O
              operador e o tema serão mantidos.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancelar</AlertDialogCancel>
            <AlertDialogAction
              onClick={() => {
                restore();
                setRestoreOpen(false);
              }}
            >
              Restaurar
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </>
  );
}
