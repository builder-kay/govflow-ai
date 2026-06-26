"use client";

import { useState } from "react";
import { Checkbox } from "@/components/ui/checkbox";
import { PriorityBadge } from "@/components/StatusBadge";
import { ChevronDown, ChevronUp } from "lucide-react";
import { cn } from "@/lib/utils";
import type { ChecklistItem as ChecklistItemType } from "@/types";

interface ChecklistItemProps {
  item: ChecklistItemType;
  onToggle: (id: string) => void;
}

export function ChecklistItem({ item, onToggle }: ChecklistItemProps) {
  const [expanded, setExpanded] = useState(false);

  return (
    <div
      className={cn(
        "rounded-xl border border-gray-100 bg-white p-4 transition-all",
        item.completed && "bg-emerald-50/50 border-emerald-100"
      )}
    >
      <div className="flex items-start gap-4">
        <Checkbox
          checked={item.completed}
          onCheckedChange={() => onToggle(item.id)}
          className="mt-1"
          aria-label={`Mark ${item.label} as complete`}
        />
        <div className="flex-1 min-w-0">
          <div className="flex flex-wrap items-center gap-2 mb-1">
            <p
              className={cn(
                "font-semibold text-foreground",
                item.completed && "line-through text-muted"
              )}
            >
              {item.label}
            </p>
            <PriorityBadge priority={item.priority} />
          </div>
          <p className="text-sm text-muted">{item.explanation}</p>
          <button
            type="button"
            onClick={() => setExpanded(!expanded)}
            className="mt-2 flex items-center gap-1 text-sm font-medium text-primary hover:underline"
          >
            Why this matters
            {expanded ? <ChevronUp className="h-4 w-4" /> : <ChevronDown className="h-4 w-4" />}
          </button>
          {expanded && (
            <p className="mt-2 rounded-lg bg-soft-blue/50 p-3 text-sm text-primary-dark">
              {item.whyItMatters}
            </p>
          )}
        </div>
      </div>
    </div>
  );
}
