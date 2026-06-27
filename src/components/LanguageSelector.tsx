"use client";

import { Globe } from "lucide-react";
import { useAppStore } from "@/store/useAppStore";

const languages = ["English"];

export function LanguageSelector() {
  const { accessibility, setAccessibility } = useAppStore();
  const selectedLanguage = languages.includes(accessibility.language)
    ? accessibility.language
    : "English";

  return (
    <div className="relative">
      <label htmlFor="language-select" className="sr-only">
        Select language
      </label>
      <div className="flex items-center gap-2 rounded-xl border border-gray-200 bg-white px-3 py-2">
        <Globe className="h-4 w-4 text-primary" />
        <select
          id="language-select"
          value={selectedLanguage}
          onChange={(e) => setAccessibility({ language: e.target.value })}
          className="bg-transparent text-sm font-medium text-foreground focus:outline-none"
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
