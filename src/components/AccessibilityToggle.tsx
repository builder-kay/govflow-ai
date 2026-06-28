"use client";

import { Switch } from "@/components/ui/switch";
import { useAppStore } from "@/store/useAppStore";
import { cn } from "@/lib/utils";
import type { LucideIcon } from "lucide-react";

interface AccessibilityToggleProps {
  label: string;
  description?: string;
  settingKey: "biggerText" | "voiceReading" | "highContrast" | "reduceAnimations";
  icon?: LucideIcon;
}

export function AccessibilityToggle({
  label,
  description,
  settingKey,
  icon: Icon,
}: AccessibilityToggleProps) {
  const { accessibility, setAccessibility } = useAppStore();
  const enabled = accessibility[settingKey];

  return (
    <div
      className={cn(
        "flex items-center justify-between gap-4 rounded-2xl border p-4 transition-colors",
        enabled
          ? "border-primary/25 bg-soft-blue/30"
          : "border-gray-100 bg-background/60 hover:border-primary/15"
      )}
    >
      <div className="flex min-w-0 items-start gap-3">
        {Icon ? (
          <div
            className={cn(
              "flex h-9 w-9 shrink-0 items-center justify-center rounded-xl",
              enabled ? "bg-primary/15 text-primary" : "bg-gray-100 text-muted"
            )}
          >
            <Icon className="h-4 w-4" />
          </div>
        ) : null}
        <div className="min-w-0">
          <p className="font-semibold text-foreground">{label}</p>
          {description ? <p className="text-sm text-muted">{description}</p> : null}
        </div>
      </div>
      <Switch
        checked={enabled}
        onCheckedChange={(checked) => setAccessibility({ [settingKey]: checked })}
        aria-label={label}
      />
    </div>
  );
}
