import type { LucideIcon } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { ActionButton } from "@/components/ActionButton";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

interface ServiceCardProps {
  icon: LucideIcon | React.ComponentType<{ className?: string }>;
  title: string;
  description: string;
  href?: string;
  onStart?: () => void;
  compact?: boolean;
  comingSoon?: boolean;
}

export function ServiceCard({
  icon: Icon,
  title,
  description,
  href = "/services",
  compact = false,
  comingSoon = false,
}: ServiceCardProps) {
  return (
    <Card
      className={cn(
        "group transition-all hover:shadow-md hover:border-primary/20",
        comingSoon && "opacity-80"
      )}
    >
      <CardContent className={cn("p-5", compact && "p-4")}>
        <div className="mb-4 flex h-12 w-12 items-center justify-center rounded-xl bg-soft-blue text-primary">
          <Icon className="h-6 w-6" />
        </div>
        <h3 className="mb-2 text-lg font-bold text-foreground">{title}</h3>
        <p className="mb-4 text-sm leading-relaxed text-muted">{description}</p>
        {comingSoon ? (
          <div className="flex items-center gap-2">
            <span className="rounded-full bg-amber-100 px-2 py-1 text-xs font-semibold text-amber-900">
              Coming soon
            </span>
            <Button size="sm" variant="outline" disabled>
              Start
            </Button>
          </div>
        ) : (
          <ActionButton href={href} size="sm" variant="outline">
            Start
          </ActionButton>
        )}
      </CardContent>
    </Card>
  );
}
