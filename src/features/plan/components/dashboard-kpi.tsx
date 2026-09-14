import { Card, CardContent } from "@/components/ui/card";
import { cn } from "@/lib/utils";

export function DashboardKpi({
  title,
  value,
  accent,
  warn,
  className,
}: {
  title: string;
  value: string;
  accent?: boolean;
  warn?: boolean;
  className?: string;
}) {
  return (
    <Card className={cn("shadow-none", className)}>
      <CardContent className="pt-4">
        <p className="text-xs text-muted-foreground">{title}</p>
        <p
          className={cn(
            "mt-1 text-2xl font-semibold tracking-tight tabular-nums",
            accent && "text-primary",
            warn && Number(value) > 0 && "text-destructive"
          )}
        >
          {value}
        </p>
      </CardContent>
    </Card>
  );
}
