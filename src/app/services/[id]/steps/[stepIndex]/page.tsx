"use client";

import { notFound } from "next/navigation";
import { use, useEffect, useMemo, useState } from "react";
import { AppShell } from "@/components/layout/AppShell";
import { StepGuideView } from "@/components/services/StepGuideView";
import { getServiceById } from "@/data/services";
import {
  getServiceStepGuide,
  getServiceStepGuideHref,
  getServiceStepGuides,
  getStepGuideOfficialLinks,
} from "@/data/service-step-guides";
import { useAppStore } from "@/store/useAppStore";

export default function ServiceStepGuidePage({
  params,
}: {
  params: Promise<{ id: string; stepIndex: string }>;
}) {
  const { id, stepIndex: stepIndexParam } = use(params);
  const stepIndex = Number.parseInt(stepIndexParam, 10);
  const service = getServiceById(id);
  const guide = Number.isNaN(stepIndex) ? undefined : getServiceStepGuide(id, stepIndex);
  const allGuides = getServiceStepGuides(id);

  const {
    checklist,
    toggleChecklistItem,
    ensureServiceChecklist,
    hasCompletedQuestions,
  } = useAppStore();
  const [localCompleted, setLocalCompleted] = useState<Record<string, boolean>>({});

  useEffect(() => {
    if (service) {
      ensureServiceChecklist(service.id);
    }
  }, [service, ensureServiceChecklist]);

  const checklistCompleted = useMemo(() => {
    const map: Record<string, boolean> = {};
    checklist.forEach((item) => {
      map[item.id] = item.completed;
    });
    return map;
  }, [checklist]);

  if (!service || !guide) {
    notFound();
  }

  const prevHref = stepIndex > 0 ? getServiceStepGuideHref(id, stepIndex - 1) : undefined;
  const nextHref =
    stepIndex < allGuides.length - 1 ? getServiceStepGuideHref(id, stepIndex + 1) : undefined;

  const toggleLocal = (taskId: string) => {
    setLocalCompleted((prev) => ({ ...prev, [taskId]: !prev[taskId] }));
  };

  return (
    <AppShell title={guide.title}>
      <StepGuideView
        guide={guide}
        stepNumber={stepIndex + 1}
        totalSteps={allGuides.length}
        checklistCompleted={checklistCompleted}
        onToggleChecklistItem={toggleChecklistItem}
        localCompleted={localCompleted}
        onToggleLocal={toggleLocal}
        officialLinks={getStepGuideOfficialLinks(guide.id)}
        serviceTitle={service.title}
        backHref={`/services/${id}`}
        prevHref={prevHref}
        nextHref={nextHref}
        continueServiceHref={`/services/${id}`}
        questionsHref="/questions"
        showPersonalizeRoadmap={!hasCompletedQuestions}
      />
    </AppShell>
  );
}
