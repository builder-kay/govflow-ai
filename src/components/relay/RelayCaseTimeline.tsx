"use client";

import { motion } from "framer-motion";
import { CheckCircle2, CircleDashed, UserRound, Users } from "lucide-react";
import type { RelayCase } from "@/types/relay";
import { cn } from "@/lib/utils";

interface RelayCaseTimelineProps {
  relayCase: RelayCase;
}

export function RelayCaseTimeline({ relayCase }: RelayCaseTimelineProps) {
  return (
    <div className="space-y-4">
      {relayCase.steps.map((step, index) => {
        const isDone = step.status === "completed";
        const isCurrent = !isDone && relayCase.steps.find((item) => item.status !== "completed")?.id === step.id;
        const AssigneeIcon =
          step.assignee === "user" ? UserRound : step.assignee === "field_runner" ? Users : CircleDashed;

        return (
          <motion.article
            key={step.id}
            initial={{ opacity: 0, y: 8 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: index * 0.03 }}
            className={cn(
              "rounded-2xl border p-4 shadow-sm",
              isDone ? "border-emerald-200 bg-emerald-50/50" : "border-gray-100 bg-white",
              isCurrent && "ring-2 ring-primary/20"
            )}
          >
            <div className="flex items-start justify-between gap-3">
              <div className="min-w-0">
                <p className="text-sm font-semibold text-foreground">{step.title}</p>
                <p className="mt-1 text-sm text-muted">{step.description}</p>
                <p className="mt-2 inline-flex items-center gap-1.5 text-xs text-muted">
                  <AssigneeIcon className="h-3.5 w-3.5 text-primary" />
                  {step.assignee === "user"
                    ? "Handled by you"
                    : step.assignee === "field_runner"
                      ? "Handled by field runner"
                      : "Handled by GovFlow coordinator"}
                </p>
              </div>
              {isDone ? (
                <CheckCircle2 className="h-5 w-5 shrink-0 text-emerald-600" />
              ) : (
                <CircleDashed className="h-5 w-5 shrink-0 text-primary" />
              )}
            </div>
            {step.requiresUserPresence ? (
              <p className="mt-3 rounded-xl border border-orange-200 bg-orange-50 px-3 py-2 text-xs font-medium text-orange-900">
                Presence required: GovFlow will alert you when this step is due.
              </p>
            ) : null}
          </motion.article>
        );
      })}
    </div>
  );
}
