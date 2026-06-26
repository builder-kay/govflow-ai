"use client";

import { StatusBadge } from "@/components/StatusBadge";
import { ActionButton } from "@/components/ActionButton";
import { Building2, AlertTriangle, FileText, Lock } from "lucide-react";
import type { RoadmapStep } from "@/types";
import { cn } from "@/lib/utils";

interface RoadmapStepProps {
  step: RoadmapStep;
  index: number;
  isLast: boolean;
}

export function RoadmapStepCard({ step, index, isLast }: RoadmapStepProps) {
  const isLocked = step.status === "locked";

  return (
    <div className="relative flex gap-4">
      <div className="flex flex-col items-center">
        <div
          className={cn(
            "flex h-10 w-10 shrink-0 items-center justify-center rounded-full text-sm font-bold",
            isLocked
              ? "bg-gray-100 text-gray-400"
              : step.status === "completed"
                ? "bg-success text-white"
                : step.status === "needs_review"
                  ? "bg-warning text-white"
                  : "bg-primary text-white"
          )}
        >
          {isLocked ? <Lock className="h-4 w-4" /> : index + 1}
        </div>
        {!isLast && <div className="mt-2 w-0.5 flex-1 bg-gray-200 min-h-[40px]" />}
      </div>

      <div className={cn("flex-1 pb-8", isLast && "pb-0")}>
        <div className="rounded-2xl border border-gray-100 bg-white p-5 shadow-sm">
          <div className="mb-3 flex flex-wrap items-center gap-2">
            <StatusBadge status={step.status} />
            {step.risk && (
              <span className="flex items-center gap-1 text-xs text-amber-700">
                <AlertTriangle className="h-3.5 w-3.5" />
                Risk noted
              </span>
            )}
          </div>

          <h3 className="mb-1 text-lg font-bold text-foreground">{step.title}</h3>

          <p className="mb-3 flex items-center gap-1.5 text-sm text-muted">
            <Building2 className="h-4 w-4 shrink-0" />
            {step.agency}
          </p>

          {step.requiredAction && (
            <p className="mb-2 text-sm">
              <span className="font-semibold">Required action: </span>
              {step.requiredAction}
            </p>
          )}

          {step.note && (
            <p className="mb-2 rounded-lg bg-soft-blue/50 p-3 text-sm text-primary-dark">
              {step.note}
            </p>
          )}

          {step.condition && (
            <p className="mb-2 text-sm text-amber-800">
              <span className="font-semibold">Condition: </span>
              {step.condition}
            </p>
          )}

          {step.risk && (
            <p className="mb-2 text-sm text-amber-700">
              <span className="font-semibold">Risk: </span>
              {step.risk}
            </p>
          )}

          {step.documents && (
            <div className="mb-3">
              <p className="mb-1 flex items-center gap-1 text-sm font-semibold">
                <FileText className="h-4 w-4" />
                Documents
              </p>
              <ul className="ml-5 list-disc text-sm text-muted">
                {step.documents.map((doc) => (
                  <li key={doc}>{doc}</li>
                ))}
              </ul>
            </div>
          )}

          {step.checklist && (
            <ul className="mb-3 ml-4 list-disc text-sm text-muted">
              {step.checklist.map((item) => (
                <li key={item}>{item}</li>
              ))}
            </ul>
          )}

          {step.buttonHref && !isLocked && (
            <ActionButton href={step.buttonHref} size="sm" variant="outline">
              {step.buttonLabel}
            </ActionButton>
          )}
          {isLocked && (
            <p className="text-sm text-muted italic">Complete previous steps to unlock</p>
          )}
        </div>
      </div>
    </div>
  );
}

interface RoadmapTimelineProps {
  steps: RoadmapStep[];
}

export function RoadmapTimeline({ steps }: RoadmapTimelineProps) {
  return (
    <div className="space-y-0">
      {steps.map((step, index) => (
        <RoadmapStepCard
          key={step.id}
          step={step}
          index={index}
          isLast={index === steps.length - 1}
        />
      ))}
    </div>
  );
}
