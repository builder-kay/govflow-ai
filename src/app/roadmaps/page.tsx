"use client";

import { AppShell } from "@/components/layout/AppShell";
import { RoadmapCard } from "@/components/RoadmapCard";
import { savedRoadmaps } from "@/data/roadmap";
import { useAppStore } from "@/store/useAppStore";
import { Map } from "lucide-react";

export default function RoadmapsPage() {
  const { roadmap } = useAppStore();

  const allRoadmaps = savedRoadmaps.map((r) =>
    r.id === "food-delivery-cape-coast"
      ? { ...r, progress: roadmap.progress || r.progress }
      : r
  );

  return (
    <AppShell title="My Roadmaps">
      <div className="mx-auto max-w-3xl">
        <div className="mb-6">
          <h1 className="mb-2 flex items-center gap-2 text-3xl font-bold text-foreground">
            <Map className="h-8 w-8 text-primary" />
            My Roadmaps
          </h1>
          <p className="text-muted">Your saved workflows and progress across government services.</p>
        </div>

        <div className="space-y-4">
          {allRoadmaps.map((saved) => (
            <RoadmapCard
              key={saved.id}
              title={saved.title}
              location={saved.location}
              progress={saved.progress}
              riskLevel={saved.riskLevel}
              nextStep={saved.nextStep}
              continueHref={saved.id === "food-delivery-cape-coast" ? "/roadmap" : "/services"}
              checklistHref={saved.id === "food-delivery-cape-coast" ? "/checklist" : "/documents"}
              riskHref="/risk"
              documentsHref="/documents"
              showDocuments={saved.id !== "food-delivery-cape-coast"}
            />
          ))}
        </div>
      </div>
    </AppShell>
  );
}
