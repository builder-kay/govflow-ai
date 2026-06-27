import { cn } from "@/lib/utils";
import type { ChecklistPriority, RiskLevel, StepStatus } from "@/types";

export function StatusBadge({ status }: { status: StepStatus }) {
  const config: Record<StepStatus, { label: string; variant: string }> = {
    not_started: { label: "Not started", variant: "bg-gray-100 text-gray-700" },
    in_progress: { label: "In progress", variant: "bg-blue-100 text-blue-800" },
    completed: { label: "Completed", variant: "bg-emerald-100 text-emerald-800" },
    locked: { label: "Locked", variant: "bg-gray-100 text-gray-500" },
    needs_review: { label: "Needs review", variant: "bg-amber-100 text-amber-800" },
  };
  const { label, variant } = config[status];
  return (
    <span className={cn("inline-flex rounded-full px-3 py-1 text-sm font-medium", variant)}>
      {label}
    </span>
  );
}

export function PriorityBadge({ priority }: { priority: ChecklistPriority }) {
  const config: Record<ChecklistPriority, { label: string; variant: string }> = {
    required: { label: "Required", variant: "bg-red-50 text-red-700 border border-red-200" },
    optional: { label: "Optional", variant: "bg-gray-50 text-gray-600 border border-gray-200" },
    depends: { label: "Depends", variant: "bg-amber-50 text-amber-700 border border-amber-200" },
  };
  const { label, variant } = config[priority];
  return (
    <span className={cn("inline-flex rounded-full px-2.5 py-0.5 text-xs font-semibold", variant)}>
      {label}
    </span>
  );
}

export function RiskBadge({ level }: { level: RiskLevel }) {
  const config: Record<RiskLevel, { label: string; variant: string }> = {
    low: { label: "Low Risk", variant: "bg-emerald-100 text-emerald-800" },
    medium: { label: "Medium Risk", variant: "bg-amber-100 text-amber-800" },
    high: { label: "High Risk", variant: "bg-red-100 text-red-800" },
  };
  const { label, variant } = config[level];
  return (
    <span className={cn("inline-flex rounded-full px-3 py-1 text-sm font-semibold", variant)}>
      {label}
    </span>
  );
}

export function OfficialSourceBadge() {
  return (
    <span className="inline-flex items-center gap-1 rounded-lg bg-soft-blue px-3 py-1.5 text-xs font-medium text-primary-dark">
      Official source
    </span>
  );
}
