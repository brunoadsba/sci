"use client";

import { NuqsAdapter } from "nuqs/adapters/next/app";
import type { ReactNode } from "react";
import { Toaster } from "@/components/ui/sonner";
import { ThemeProvider } from "@/components/theme-provider";
import { PlanProvider } from "@/features/plan/hooks/use-plan";

export function AppProviders({ children }: { children: ReactNode }) {
  return (
    <NuqsAdapter>
      <ThemeProvider>
        <PlanProvider>
          {children}
          <Toaster richColors position="bottom-right" />
        </PlanProvider>
      </ThemeProvider>
    </NuqsAdapter>
  );
}
