"use client";

import { AppShell } from "@/components/layout/AppShell";
import { AccessibilityToggle } from "@/components/AccessibilityToggle";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { useAppStore } from "@/store/useAppStore";
import { cn } from "@/lib/utils";
import { User, Trash2, FileText, Map } from "lucide-react";

const languages = ["English", "Twi", "Fante", "Ga", "Ewe"];
const explanationStyles = ["simple", "normal", "detailed"] as const;

export default function ProfilePage() {
  const { accessibility, setAccessibility, clearDemoData } = useAppStore();

  return (
    <AppShell title="Profile">
      <div className="mx-auto max-w-2xl space-y-8">
        <div className="flex items-center gap-4">
          <div className="flex h-16 w-16 items-center justify-center rounded-2xl bg-primary text-white">
            <User className="h-8 w-8" />
          </div>
          <div>
            <h1 className="text-2xl font-bold text-foreground">Profile & Settings</h1>
            <p className="text-muted">Customize GovFlow for your needs</p>
          </div>
        </div>

        <section>
          <h2 className="mb-4 text-lg font-bold">Language</h2>
          <div className="grid grid-cols-2 gap-2 sm:grid-cols-3">
            {languages.map((lang) => (
              <button
                key={lang}
                type="button"
                onClick={() => setAccessibility({ language: lang })}
                className={cn(
                  "rounded-xl border-2 px-4 py-3 text-sm font-medium transition-all",
                  accessibility.language === lang
                    ? "border-primary bg-soft-blue text-primary-dark"
                    : "border-gray-100 bg-white hover:border-primary/30"
                )}
              >
                {lang}
              </button>
            ))}
          </div>
        </section>

        <section>
          <h2 className="mb-4 text-lg font-bold">Explanation Style</h2>
          <div className="flex flex-wrap gap-2">
            {explanationStyles.map((style) => (
              <button
                key={style}
                type="button"
                onClick={() => setAccessibility({ explanationStyle: style })}
                className={cn(
                  "rounded-xl border-2 px-5 py-3 text-sm font-medium capitalize transition-all",
                  accessibility.explanationStyle === style
                    ? "border-primary bg-soft-blue text-primary-dark"
                    : "border-gray-100 bg-white hover:border-primary/30"
                )}
              >
                {style}
              </button>
            ))}
          </div>
        </section>

        <section>
          <h2 className="mb-4 text-lg font-bold">Accessibility</h2>
          <div className="space-y-3">
            <AccessibilityToggle label="Bigger text" settingKey="biggerText" />
            <AccessibilityToggle
              label="Voice reading"
              description="Read explanations aloud (demo)"
              settingKey="voiceReading"
            />
            <AccessibilityToggle label="High contrast mode" settingKey="highContrast" />
            <AccessibilityToggle label="Reduce animations" settingKey="reduceAnimations" />
          </div>
        </section>

        <section>
          <h2 className="mb-4 text-lg font-bold">Mode</h2>
          <div className="grid gap-4 sm:grid-cols-2">
            <button
              type="button"
              onClick={() => setAccessibility({ mode: "simple", biggerText: true })}
              className={cn(
                "rounded-2xl border-2 p-5 text-left transition-all",
                accessibility.mode === "simple"
                  ? "border-primary bg-soft-blue"
                  : "border-gray-100 bg-white"
              )}
            >
              <p className="font-bold text-foreground">Simple Mode</p>
              <p className="mt-2 text-sm text-muted">
                Best for first-time users and older adults. Uses bigger text, fewer cards, and
                simpler explanations.
              </p>
            </button>
            <button
              type="button"
              onClick={() => setAccessibility({ mode: "quick", biggerText: false })}
              className={cn(
                "rounded-2xl border-2 p-5 text-left transition-all",
                accessibility.mode === "quick"
                  ? "border-primary bg-soft-blue"
                  : "border-gray-100 bg-white"
              )}
            >
              <p className="font-bold text-foreground">Quick Mode</p>
              <p className="mt-2 text-sm text-muted">
                Best for users who want short answers, fast actions, and compact cards.
              </p>
            </button>
          </div>
        </section>

        <section>
          <h2 className="mb-4 text-lg font-bold">Data</h2>
          <div className="space-y-3">
            <Card>
              <CardContent className="flex items-center justify-between p-4">
                <div className="flex items-center gap-3">
                  <Map className="h-5 w-5 text-primary" />
                  <span className="font-medium">Saved roadmaps</span>
                </div>
                <span className="text-sm text-muted">3</span>
              </CardContent>
            </Card>
            <Card>
              <CardContent className="flex items-center justify-between p-4">
                <div className="flex items-center gap-3">
                  <FileText className="h-5 w-5 text-primary" />
                  <span className="font-medium">Saved documents</span>
                </div>
                <span className="text-sm text-muted">1</span>
              </CardContent>
            </Card>
            <Button variant="outline" onClick={clearDemoData} className="w-full">
              <Trash2 className="h-4 w-4" />
              Clear demo data
            </Button>
          </div>
        </section>

        <p className="text-xs leading-relaxed text-muted">
          GovFlow AI helps users understand and prepare for government services. It does not replace
          official government agencies, legal advice, or official application portals. Always confirm
          final requirements, fees, and timelines from the responsible agency.
        </p>
      </div>
    </AppShell>
  );
}
