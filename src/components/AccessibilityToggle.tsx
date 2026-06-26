"use client";

import { Switch } from "@/components/ui/switch";
import { useAppStore } from "@/store/useAppStore";

interface AccessibilityToggleProps {
  label: string;
  description?: string;
  settingKey: "biggerText" | "voiceReading" | "highContrast" | "reduceAnimations";
}

export function AccessibilityToggle({ label, description, settingKey }: AccessibilityToggleProps) {
  const { accessibility, setAccessibility } = useAppStore();

  return (
    <div className="flex items-center justify-between gap-4 rounded-xl border border-gray-100 bg-white p-4">
      <div>
        <p className="font-semibold text-foreground">{label}</p>
        {description && <p className="text-sm text-muted">{description}</p>}
      </div>
      <Switch
        checked={accessibility[settingKey]}
        onCheckedChange={(checked) => setAccessibility({ [settingKey]: checked })}
        aria-label={label}
      />
    </div>
  );
}
