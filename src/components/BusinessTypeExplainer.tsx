"use client";

import { useState } from "react";
import { Info } from "lucide-react";
import { BUSINESS_TYPES } from "@/data/business-types";
import { cn } from "@/lib/utils";

interface BusinessTypeExplainerProps {
  selectedId?: string;
  onSelect?: (id: string) => void;
  selectable?: boolean;
  className?: string;
}

export function BusinessTypeExplainer({
  selectedId,
  onSelect,
  selectable = false,
  className,
}: BusinessTypeExplainerProps) {
  const [explainedId, setExplainedId] = useState<string | null>(null);
  const activeId = explainedId ?? selectedId ?? null;

  const handleClick = (id: string) => {
    setExplainedId(id);
    onSelect?.(id);
  };

  return (
    <div className={className}>
      <p className="mb-3 flex items-center gap-2 text-sm font-medium text-primary">
        <Info className="h-4 w-4" />
        Tap a type below to see what it means
      </p>
      <div className="space-y-3">
        {BUSINESS_TYPES.map((type) => {
          const isSelected = selectable && selectedId === type.id;
          const isExplained = activeId === type.id;

          return (
            <button
              key={type.id}
              type="button"
              onClick={() => handleClick(type.id)}
              className={cn(
                "w-full rounded-2xl border-2 p-4 text-left transition-all",
                isSelected || isExplained
                  ? "border-primary bg-soft-blue shadow-sm ring-2 ring-primary/20"
                  : "border-gray-100 bg-white hover:border-primary/40 hover:bg-soft-blue/30"
              )}
            >
              <div className="flex items-center justify-between gap-2">
                <span className="font-semibold text-foreground">{type.label}</span>
                <span className="text-xs font-medium text-primary">Tap to learn</span>
              </div>
              {isExplained ? (
                <div className="mt-3 space-y-2 border-t border-primary/10 pt-3 text-sm text-primary-dark">
                  <p>{type.summary}</p>
                  <p>
                    <span className="font-semibold">Good for: </span>
                    {type.bestFor}
                  </p>
                </div>
              ) : null}
            </button>
          );
        })}
      </div>
    </div>
  );
}
