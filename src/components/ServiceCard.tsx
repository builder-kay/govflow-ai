import type { LucideIcon } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { ActionButton } from "@/components/ActionButton";
import { cn } from "@/lib/utils";

interface ServiceCardProps {
  icon: LucideIcon | React.ComponentType<{ className?: string }>;
  title: string;
  description: string;
  href?: string;
  onStart?: () => void;
  compact?: boolean;
}

export function ServiceCard({
  icon: Icon,
  title,
  description,
  href = "/questions",
  compact = false,
}: ServiceCardProps) {
  return (
    <Card className="group transition-all hover:shadow-md hover:border-primary/20">
      <CardContent className={cn("p-5", compact && "p-4")}>
        <div className="mb-4 flex h-12 w-12 items-center justify-center rounded-xl bg-soft-blue text-primary">
          <Icon className="h-6 w-6" />
        </div>
        <h3 className="mb-2 text-lg font-bold text-foreground">{title}</h3>
        <p className="mb-4 text-sm leading-relaxed text-muted">{description}</p>
        <ActionButton href={href} size="sm" variant="outline">
          Start
        </ActionButton>
      </CardContent>
    </Card>
  );
}
