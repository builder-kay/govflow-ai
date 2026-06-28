import type { ChecklistItem, Roadmap, RiskFactor, RiskLevel, StepStatus } from "@/types";
import { getServiceStepGuide } from "@/data/service-step-guides";

export function getChecklistProgress(checklist: ChecklistItem[]): number {
  if (checklist.length === 0) return 0;
  const completed = checklist.filter((i) => i.completed).length;
  return Math.round((completed / checklist.length) * 100);
}

const ROADMAP_STEP_CHECKLIST: Record<string, Record<string, number>> = {
  "start-business": {
    "step-1": 0,
    "step-2": 1,
    "step-3": 2,
    "step-4": 3,
    "step-5": 4,
    "step-6": 4,
  },
  passport: {
    "pp-step-1": 0,
    "pp-step-2": 1,
    "pp-step-3": 2,
    "pp-step-4": 3,
    "pp-step-5": 3,
    "pp-step-6": 4,
  },
  "ghana-card": {
    "gc-step-1": 0,
    "gc-step-2": 1,
    "gc-step-3": 2,
    "gc-step-4": 3,
  },
  "national-service": {
    "ns-step-1": 0,
    "ns-step-2": 0,
    "ns-step-3": 1,
    "ns-step-4": 2,
    "ns-step-5": 3,
    "ns-step-6": 4,
    "ns-step-7": 4,
  },
};

export function getChecklistIdsForRoadmapStep(
  serviceId: string | null | undefined,
  roadmapStepId: string
): string[] {
  if (!serviceId) return [];
  const guideIndex = ROADMAP_STEP_CHECKLIST[serviceId]?.[roadmapStepId];
  if (guideIndex === undefined) return [];
  return getServiceStepGuide(serviceId, guideIndex)?.checklistItemIds ?? [];
}

function isStepComplete(stepIds: string[], checklist: ChecklistItem[]): boolean {
  if (stepIds.length === 0) return false;
  return stepIds.every((id) => checklist.find((item) => item.id === id)?.completed);
}

function resolveStepStatus(
  stepIds: string[],
  checklist: ChecklistItem[],
  unlocked: boolean
): StepStatus {
  if (!unlocked) return "locked";
  if (stepIds.length === 0) return "not_started";

  const related = stepIds
    .map((id) => checklist.find((item) => item.id === id))
    .filter((item): item is ChecklistItem => Boolean(item));

  if (related.length === 0) return "not_started";

  const completedCount = related.filter((item) => item.completed).length;
  if (completedCount === related.length) return "completed";
  if (completedCount > 0) return "in_progress";
  return "not_started";
}

export function calculateRiskLevelFromChecklist(checklist: ChecklistItem[]): RiskLevel {
  const incompleteRequired = checklist.filter(
    (item) => item.priority === "required" && !item.completed
  ).length;
  const incompleteDepends = checklist.filter(
    (item) => item.priority === "depends" && !item.completed
  ).length;

  if (incompleteRequired >= 4) return "high";
  if (incompleteRequired >= 2) return "medium";
  if (incompleteRequired === 1 || incompleteDepends >= 3) return "medium";
  return "low";
}

export function getMainNextStepFromChecklist(checklist: ChecklistItem[]): string {
  const nextItem = checklist.find(
    (item) => !item.completed && (item.priority === "required" || item.priority === "depends")
  );
  return nextItem?.label ?? "Review your remaining checklist items";
}

export function syncRoadmapFromChecklist(
  checklist: ChecklistItem[],
  roadmap: Roadmap,
  serviceId: string | null | undefined
): Roadmap {
  const progress = getChecklistProgress(checklist);
  const riskLevel = calculateRiskLevelFromChecklist(checklist);
  const mainNextStep = getMainNextStepFromChecklist(checklist);

  let previousComplete = true;
  const steps = roadmap.steps.map((step) => {
    const stepIds = getChecklistIdsForRoadmapStep(serviceId, step.id);
    const status = resolveStepStatus(stepIds, checklist, previousComplete);
    if (stepIds.length > 0) {
      previousComplete = isStepComplete(stepIds, checklist);
    }
    return stepIds.length > 0 ? { ...step, status } : step;
  });

  return {
    ...roadmap,
    progress,
    riskLevel,
    mainNextStep,
    steps,
  };
}

export function getChecklistRiskFactors(checklist: ChecklistItem[]): RiskFactor[] {
  return checklist
    .filter((item) => !item.completed && item.priority === "required")
    .slice(0, 5)
    .map((item) => ({
      id: `checklist-${item.id}`,
      title: `${item.label} not completed`,
      description: item.whyItMatters,
    }));
}
