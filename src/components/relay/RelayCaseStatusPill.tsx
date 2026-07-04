"use client";

import type { RelayCaseStatus } from "@/types/relay";
import { cn } from "@/lib/utils";

const statusLabels: Record<RelayCaseStatus, string> = {
  intake_received: "Submitted for admin review",
  payment_pending: "Approved - waiting payment",
  ops_triage: "Preparing your workflow",
  in_progress: "In progress",
  awaiting_user: "Awaiting you",
  completed: "Completed",
  cancelled: "Cancelled",
};

const statusClasses: Record<RelayCaseStatus, string> = {
  intake_received: "bg-soft-blue text-primary-dark",
  payment_pending: "bg-amber-100 text-amber-900",
  ops_triage: "bg-indigo-100 text-indigo-800",
  in_progress: "bg-primary/15 text-primary-dark",
  awaiting_user: "bg-orange-100 text-orange-900",
  completed: "bg-emerald-100 text-emerald-800",
  cancelled: "bg-gray-200 text-gray-700",
};

interface RelayCaseStatusPillProps {
  status: RelayCaseStatus;
}

export function RelayCaseStatusPill({ status }: RelayCaseStatusPillProps) {
  return (
    <span
      className={cn(
        "inline-flex items-center rounded-full px-3 py-1 text-xs font-semibold",
        statusClasses[status]
      )}
    >
      {statusLabels[status]}
    </span>
  );
}
