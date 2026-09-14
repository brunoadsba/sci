"use client";

import { useState } from "react";
import { Info } from "lucide-react";
import { ACRONYM_EOR, ACRONYM_SCI } from "../constants";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { cn } from "@/lib/utils";

/** Legenda completa — preferir desktop / hero. */
export function AcronymLegend({ className }: { className?: string }) {
  return (
    <p
      className={cn(
        "text-[11px] leading-snug text-muted-foreground sm:text-xs",
        className
      )}
      title={`${ACRONYM_SCI.short}: ${ACRONYM_SCI.long}. ${ACRONYM_EOR.short}: ${ACRONYM_EOR.long}.`}
    >
      <span className="font-medium text-foreground/80">{ACRONYM_SCI.short}</span>
      <span className="mx-1">—</span>
      <span>{ACRONYM_SCI.long}</span>
      <span className="mx-1.5 text-border" aria-hidden>
        ·
      </span>
      <span className="font-medium text-foreground/80">{ACRONYM_EOR.short}</span>
      <span className="mx-1">—</span>
      <span>{ACRONYM_EOR.long}</span>
    </p>
  );
}

/** Botão compacto (mobile) que abre o significado das siglas. */
export function AcronymInfoButton({ className }: { className?: string }) {
  const [open, setOpen] = useState(false);

  return (
    <>
      <Button
        type="button"
        variant="ghost"
        size="icon-sm"
        className={cn("size-8 shrink-0 text-muted-foreground", className)}
        aria-label="O que significam SCI e EOR"
        onClick={() => setOpen(true)}
      >
        <Info className="size-4" />
      </Button>
      <Dialog open={open} onOpenChange={setOpen}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle>Siglas SCI e EOR</DialogTitle>
          </DialogHeader>
          <dl className="grid gap-3 text-sm">
            <div>
              <dt className="font-semibold text-foreground">
                {ACRONYM_SCI.short}
              </dt>
              <dd className="text-muted-foreground">{ACRONYM_SCI.long}</dd>
            </div>
            <div>
              <dt className="font-semibold text-foreground">
                {ACRONYM_EOR.short}
              </dt>
              <dd className="text-muted-foreground">{ACRONYM_EOR.long}</dd>
            </div>
          </dl>
        </DialogContent>
      </Dialog>
    </>
  );
}
