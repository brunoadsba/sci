import { Suspense } from "react";
import { PlanApp } from "@/features/plan/components/plan-app";

export default function HomePage() {
  return (
    <Suspense
      fallback={
        <div className="mx-auto max-w-6xl p-6 text-sm text-muted-foreground">
          Carregando plano...
        </div>
      }
    >
      <PlanApp />
    </Suspense>
  );
}
