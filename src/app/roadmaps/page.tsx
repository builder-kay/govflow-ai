"use client";

import { AppShell } from "@/components/layout/AppShell";
import { ActionButton } from "@/components/ActionButton";
import { ProgressBar } from "@/components/ui/progress";
import { RiskBadge } from "@/components/StatusBadge";
import { savedRoadmaps } from "@/data/roadmap";
import { useAppStore } from "@/store/useAppStore";
import { BarChart3, Clock3, Map, ShieldAlert, Sparkles } from "lucide-react";

export default function RoadmapsPage() {
  const { roadmap, currentServiceId } = useAppStore();

  const allRoadmaps = savedRoadmaps.map((r) =>
    r.id === "start-business"
      ? { ...r, progress: roadmap.progress || r.progress, title: roadmap.title || r.title }
      : r
  );
  const totalRoadmaps = allRoadmaps.length;
  const averageProgress = Math.round(
    allRoadmaps.reduce((sum, current) => sum + current.progress, 0) / Math.max(totalRoadmaps, 1)
  );
  const atRiskCount = allRoadmaps.filter((item) => item.riskLevel !== "low").length;
  const activeRoadmapTitle =
    currentServiceId === "passport"
      ? "Passport"
      : currentServiceId === "ghana-card"
        ? "Ghana Card"
        : currentServiceId === "start-business"
          ? roadmap.title || "Business Startup"
          : "Business Startup";

  return (
    <AppShell title="My Roadmaps">
      <div className="mx-auto max-w-5xl space-y-6">
        <div className="overflow-hidden rounded-3xl border border-primary/10 bg-gradient-to-br from-white via-white to-soft-blue/40">
          <div className="p-6 md:p-8">
            <div className="flex flex-wrap items-center justify-between gap-4">
              <div>
                <p className="mb-2 inline-flex items-center gap-2 rounded-full bg-primary/10 px-3 py-1 text-xs font-semibold text-primary-dark">
                  <Sparkles className="h-3.5 w-3.5" />
                  Smart progress dashboard
                </p>
                <h1 className="mb-2 flex items-center gap-2 text-3xl font-bold text-foreground">
                  <Map className="h-8 w-8 text-primary" />
                  My Roadmaps
                </h1>
                <p className="text-muted">
                  Clean overview of your workflows, risk status, and next actions.
                </p>
              </div>
              <div className="rounded-2xl border border-primary/10 bg-white px-4 py-3 shadow-sm">
                <p className="text-xs text-muted">Currently active</p>
                <p className="font-semibold text-foreground">{activeRoadmapTitle}</p>
              </div>
            </div>

            <div className="mt-6 grid gap-3 sm:grid-cols-3">
              <div className="rounded-2xl border border-gray-100 bg-white p-4 shadow-sm">
                <p className="text-xs text-muted">Total roadmaps</p>
                <p className="mt-1 flex items-center gap-2 text-2xl font-bold text-foreground">
                  <BarChart3 className="h-5 w-5 text-primary" />
                  {totalRoadmaps}
                </p>
              </div>
              <div className="rounded-2xl border border-gray-100 bg-white p-4 shadow-sm">
                <p className="text-xs text-muted">Average completion</p>
                <p className="mt-1 text-2xl font-bold text-foreground">{averageProgress}%</p>
              </div>
              <div className="rounded-2xl border border-gray-100 bg-white p-4 shadow-sm">
                <p className="text-xs text-muted">Need attention</p>
                <p className="mt-1 flex items-center gap-2 text-2xl font-bold text-foreground">
                  <ShieldAlert className="h-5 w-5 text-warning" />
                  {atRiskCount}
                </p>
              </div>
            </div>
          </div>
        </div>

        <div className="grid gap-4 md:grid-cols-2">
          {allRoadmaps.map((saved) => (
            <div
              key={saved.id}
              className="rounded-3xl border border-gray-100 bg-white p-5 shadow-sm transition hover:-translate-y-0.5 hover:shadow-md"
            >
              <div className="mb-4 flex items-start justify-between gap-3">
                <div>
                  <h2 className="text-xl font-bold text-foreground">{saved.title}</h2>
                  <p className="mt-1 text-sm text-muted">{saved.location}</p>
                </div>
                <RiskBadge level={saved.riskLevel} />
              </div>

              <div className="mb-4 rounded-2xl border border-gray-100 bg-background/70 p-3">
                <p className="mb-2 text-xs font-medium text-muted">Completion</p>
                <ProgressBar value={saved.progress} showLabel />
              </div>

              <div className="mb-5 rounded-2xl bg-soft-blue/40 p-4">
                <p className="mb-1 flex items-center gap-2 text-xs font-medium text-muted">
                  <Clock3 className="h-3.5 w-3.5 text-primary" />
                  Next step
                </p>
                <p className="font-semibold text-foreground">{saved.nextStep}</p>
              </div>

              <div className="flex flex-wrap gap-2">
                <ActionButton
                  href={saved.id === "start-business" ? "/roadmap" : "/services"}
                  size="sm"
                >
                  Continue
                </ActionButton>
                <ActionButton
                  href={saved.id === "start-business" ? "/checklist" : "/documents"}
                  size="sm"
                  variant="outline"
                >
                  {saved.id === "start-business" ? "Checklist" : "Documents"}
                </ActionButton>
                <ActionButton href="/risk" size="sm" variant="ghost">
                  Risk check
                </ActionButton>
              </div>
            </div>
          ))}
        </div>
      </div>
    </AppShell>
  );
}
