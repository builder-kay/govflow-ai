import { Card, CardContent } from "@/components/ui/card";
import { ProgressBar } from "@/components/ui/progress";
import { RiskBadge } from "@/components/StatusBadge";
import { ActionButton } from "@/components/ActionButton";
import type { RiskLevel } from "@/types";
import { MapPin, ChevronRight } from "lucide-react";

interface RoadmapCardProps {
  title: string;
  location: string;
  progress: number;
  riskLevel: RiskLevel;
  nextStep: string;
  continueHref?: string;
  checklistHref?: string;
  riskHref?: string;
  documentsHref?: string;
  showDocuments?: boolean;
}

export function RoadmapCard({
  title,
  location,
  progress,
  riskLevel,
  nextStep,
  continueHref = "/roadmap",
  checklistHref = "/checklist",
  riskHref = "/risk",
  documentsHref = "/documents",
  showDocuments = false,
}: RoadmapCardProps) {
  return (
    <Card className="overflow-hidden">
      <CardContent className="p-6">
        <div className="mb-4 flex items-start justify-between gap-4">
          <div>
            <h3 className="text-xl font-bold text-foreground">{title}</h3>
            <p className="mt-1 flex items-center gap-1 text-sm text-muted">
              <MapPin className="h-4 w-4" />
              {location}
            </p>
          </div>
          <RiskBadge level={riskLevel} />
        </div>

        <ProgressBar value={progress} showLabel className="mb-4" />

        <div className="mb-5 rounded-xl bg-soft-blue/50 p-4">
          <p className="text-sm font-medium text-muted">Next step</p>
          <p className="mt-1 font-semibold text-foreground">{nextStep}</p>
        </div>

        <div className="flex flex-wrap gap-2">
          <ActionButton href={continueHref} size="sm">
            Continue
            <ChevronRight className="h-4 w-4" />
          </ActionButton>
          <ActionButton href={checklistHref} size="sm" variant="outline">
            Checklist
          </ActionButton>
          {showDocuments ? (
            <ActionButton href={documentsHref} size="sm" variant="ghost">
              Documents
            </ActionButton>
          ) : (
            <ActionButton href={riskHref} size="sm" variant="ghost">
              Risk Check
            </ActionButton>
          )}
        </div>
      </CardContent>
    </Card>
  );
}
