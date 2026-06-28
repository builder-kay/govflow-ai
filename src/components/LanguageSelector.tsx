"use client";

import { Globe } from "lucide-react";
import { useAppStore } from "@/store/useAppStore";
import { cn } from "@/lib/utils";

const languages = ["English"];

interface LanguageSelectorProps {
  compact?: boolean;
  className?: string;
}

export function LanguageSelector({ compact = false, className }: LanguageSelectorProps) {
  const { accessibility, setAccessibility } = useAppStore();
  const selectedLanguage = languages.includes(accessibility.language)
    ? accessibility.language
    : "English";

  return (
    <div className={cn("relative", className)}>
      <label htmlFor="language-select" className="sr-only">
        Select language
      </label>
      <div
        className={cn(
          "flex items-center rounded-xl border border-gray-200 bg-white",
          compact ? "gap-1 px-2 py-1.5 sm:gap-2 sm:px-3 sm:py-2" : "gap-2 px-3 py-2"
        )}
      >
        <Globe className="h-4 w-4 shrink-0 text-primary" />
        <select
          id="language-select"
          value={selectedLanguage}
          onChange={(e) => setAccessibility({ language: e.target.value })}
          className={cn(
            "max-w-[5.5rem] bg-transparent text-sm font-medium text-foreground focus:outline-none sm:max-w-none",
            compact && "text-xs sm:text-sm"
          )}
        >
          {languages.map((lang) => (
            <option key={lang} value={lang}>
              {lang}
            </option>
          ))}
        </select>
      </div>
    </div>
  );
}
