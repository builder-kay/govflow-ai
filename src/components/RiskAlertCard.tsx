import { Card, CardContent } from "@/components/ui/card";
import { RiskBadge } from "@/components/StatusBadge";
import { AlertTriangle } from "lucide-react";
import type { RiskLevel } from "@/types";
import { cn } from "@/lib/utils";

interface RiskAlertCardProps {
  level: RiskLevel;
  title?: string;
  description?: string;
  className?: string;
}

export function RiskAlertCard({
  level,
  title = "Current Risk Level",
  description,
  className,
}: RiskAlertCardProps) {
  const styles: Record<RiskLevel, string> = {
    low: "border-emerald-200 bg-emerald-50",
    medium: "border-amber-200 bg-amber-50",
    high: "border-red-200 bg-red-50",
  };

  return (
    <Card className={cn("border-2", styles[level], className)}>
      <CardContent className="flex items-start gap-4 p-6">
        <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-xl bg-white/80">
          <AlertTriangle
            className={cn(
              "h-6 w-6",
              level === "low" && "text-success",
              level === "medium" && "text-warning",
              level === "high" && "text-danger"
            )}
          />
        </div>
        <div>
          <p className="text-sm font-medium text-muted">{title}</p>
          <div className="mt-1 flex items-center gap-2">
            <RiskBadge level={level} />
          </div>
          {description && <p className="mt-2 text-sm text-foreground">{description}</p>}
        </div>
      </CardContent>
    </Card>
  );
}
