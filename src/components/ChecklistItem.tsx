"use client";

import Link from "next/link";
import { ExternalLink, LifeBuoy } from "lucide-react";
import { useState } from "react";
import { Checkbox } from "@/components/ui/checkbox";
import { PriorityBadge } from "@/components/StatusBadge";
import { BusinessTypeExplainer } from "@/components/BusinessTypeExplainer";
import { getChecklistItemExtras } from "@/data/checklist-help";
import { ChevronDown, ChevronUp } from "lucide-react";
import { cn } from "@/lib/utils";
import type { ChecklistItem as ChecklistItemType } from "@/types";

interface ChecklistItemProps {
  item: ChecklistItemType;
  onToggle: (id: string) => void;
}

export function ChecklistItem({ item, onToggle }: ChecklistItemProps) {
  const [expanded, setExpanded] = useState(false);
  const extras = getChecklistItemExtras(item.id);
  const resourceLink = item.resourceLink ?? extras.resourceLink;
  const helpActions = item.helpActions ?? extras.helpActions;
  const showBusinessTypeHelp = item.showBusinessTypeHelp ?? extras.showBusinessTypeHelp;
  const hasHelp = Boolean(resourceLink || helpActions?.length || showBusinessTypeHelp);

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

          {showBusinessTypeHelp ? (
            <BusinessTypeExplainer className="mt-4" />
          ) : null}

          {hasHelp ? (
            <div className="mt-4 rounded-xl border border-primary/15 bg-soft-blue/20 p-3">
              <p className="mb-2 flex items-center gap-2 text-sm font-semibold text-primary-dark">
                <LifeBuoy className="h-4 w-4" />
                Need help to finish this step?
              </p>
              <div className="flex flex-col items-start gap-2">
                {resourceLink ? (
                  <a
                    href={resourceLink.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center gap-1 text-sm font-medium text-primary hover:underline"
                  >
                    {resourceLink.label}
                    <ExternalLink className="h-3.5 w-3.5" />
                  </a>
                ) : null}
                {helpActions?.map((action) =>
                  action.external ? (
                    <a
                      key={action.href}
                      href={action.href}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-flex items-center gap-1 text-sm font-medium text-primary hover:underline"
                    >
                      {action.label}
                      <ExternalLink className="h-3.5 w-3.5" />
                    </a>
                  ) : (
                    <Link
                      key={action.href}
                      href={action.href}
                      className="text-sm font-medium text-primary hover:underline"
                    >
                      {action.label}
                    </Link>
                  )
                )}
              </div>
            </div>
          ) : null}

          <button
            type="button"
            onClick={() => setExpanded(!expanded)}
            className="mt-3 flex items-center gap-1 text-sm font-medium text-primary hover:underline"
          >
            Why this matters
            {expanded ? <ChevronUp className="h-4 w-4" /> : <ChevronDown className="h-4 w-4" />}
          </button>
          {expanded ? (
            <p className="mt-2 rounded-lg bg-soft-blue/50 p-3 text-sm text-primary-dark">
              {item.whyItMatters}
            </p>
          ) : null}
        </div>
      </div>
    </div>
  );
}
