"use client";

import { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Input } from "@/components/ui/input";
import { PriorityBadge, StatusBadge } from "./status-badge";
import type { ActionItem } from "../types";
import { usePlan } from "../hooks/use-plan";

interface ActionDetailDialogProps {
  action: ActionItem | null;
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export function ActionDetailDialog({
  action,
  open,
  onOpenChange,
}: ActionDetailDialogProps) {
  const { updateAction } = usePlan();
  const [obs, setObs] = useState("");
  const [bloqueioMotivo, setBloqueioMotivo] = useState("");

  useEffect(() => {
    if (action) {
      setObs(action.obs);
      setBloqueioMotivo(action.bloqueioMotivo || "");
    }
  }, [action]);

  if (!action) return null;

  function handleSave() {
    if (!action) return;
    updateAction(action.id, {
      obs,
      bloqueioMotivo:
        action.status === "Bloqueado" ? bloqueioMotivo : undefined,
    });
    onOpenChange(false);
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent
        className="max-h-[90vh] overflow-y-auto sm:max-w-lg"
        aria-describedby="action-detail-desc"
      >
        <DialogHeader>
          <DialogTitle id="action-detail-title">
            {action.id} — Detalhes
          </DialogTitle>
          <DialogDescription id="action-detail-desc">
            Observações e critérios. Status, responsável e prazo editam-se na
            lista.
          </DialogDescription>
        </DialogHeader>

        <div className="grid gap-3 text-sm">
          <p className="font-medium leading-snug">{action.acao}</p>
          <div className="flex flex-wrap gap-2">
            <StatusBadge status={action.status} />
            <PriorityBadge prioridade={action.prioridade} />
            <span className="text-muted-foreground">Onda {action.onda}</span>
          </div>
          <div className="grid gap-1">
            <span className="text-muted-foreground">Entregável</span>
            <p>{action.entregavel}</p>
          </div>
          <div className="grid gap-1">
            <span className="text-muted-foreground">Critério de aceite</span>
            <p>{action.criterio}</p>
          </div>
          <div className="grid grid-cols-2 gap-3">
            <div>
              <span className="text-muted-foreground">Responsável</span>
              <p>{action.responsavel}</p>
            </div>
            <div>
              <span className="text-muted-foreground">Prazo</span>
              <p>{action.prazo}</p>
            </div>
          </div>

          {action.status === "Bloqueado" && (
            <div className="grid gap-2">
              <Label htmlFor="bloqueioMotivo">Motivo do bloqueio</Label>
              <Input
                id="bloqueioMotivo"
                value={bloqueioMotivo}
                onChange={(e) => setBloqueioMotivo(e.target.value)}
                maxLength={500}
                placeholder="Descreva o impedimento..."
              />
            </div>
          )}

          <div className="grid gap-2">
            <Label htmlFor="modalObs">Observações</Label>
            <Textarea
              id="modalObs"
              value={obs}
              onChange={(e) => setObs(e.target.value)}
              maxLength={4000}
              rows={5}
              placeholder="Comentários, evidências, pendências..."
              autoFocus
            />
          </div>
        </div>

        <DialogFooter>
          <Button type="button" variant="outline" onClick={() => onOpenChange(false)}>
            Fechar
          </Button>
          <Button type="button" onClick={handleSave}>
            Salvar observações
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
