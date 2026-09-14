"use client";

import { ACRONYM_EOR, ACRONYM_SCI } from "../constants";

/** Legenda das siglas SCI/EOR — visível em mobile e desktop. */
export function AcronymLegend({ className }: { className?: string }) {
  return (
    <p
      className={
        className ??
        "text-[11px] leading-snug text-muted-foreground sm:text-xs"
      }
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
