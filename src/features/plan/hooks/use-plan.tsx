"use client";

import { useContext } from "react";
import { FIELD_LABELS } from "../constants";
import { PlanContext } from "./plan-context";

export { PlanProvider } from "./plan-provider";

export function usePlan() {
  const ctx = useContext(PlanContext);
  if (!ctx) throw new Error("usePlan must be used within PlanProvider");
  return ctx;
}

export function fieldLabel(field: string) {
  return FIELD_LABELS[field] || field;
}
