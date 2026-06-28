import type { SavedRoadmapInstance, SavedRoadmapSummary } from "@/types";
import { getServiceFlow } from "@/lib/service-registry";
import { syncRoadmapFromChecklist } from "@/lib/checklist-sync";

export const SERVICE_DISPLAY_NAMES: Record<string, string> = {
  "start-business": "Start a Business",
  passport: "Passport",
  "national-service": "National Service",
  "ghana-card": "Ghana Card",
  "gra-tin": "GRA / Tax",
};

type RoadmapListItem = SavedRoadmapSummary & {
  serviceId: string;
  status: SavedRoadmapInstance["status"];
  isCurrent: boolean;
  updatedAt: string;
};

export function buildRoadmapInstance(
  serviceId: string,
  state: {
    checklist: SavedRoadmapInstance["checklist"];
    roadmap: SavedRoadmapInstance["roadmap"];
    answers: SavedRoadmapInstance["answers"];
    hasCompletedQuestions: boolean;
  },
  existing?: SavedRoadmapInstance
): SavedRoadmapInstance {
  const roadmap = syncRoadmapFromChecklist(state.checklist, state.roadmap, serviceId);
  const now = new Date().toISOString();

  return {
    serviceId,
    checklist: state.checklist,
    roadmap,
    answers: state.answers,
    hasCompletedQuestions: state.hasCompletedQuestions,
    status: existing?.status ?? "active",
    createdAt: existing?.createdAt ?? now,
    updatedAt: now,
  };
}

export function createInitialRoadmapInstance(serviceId: string): SavedRoadmapInstance {
  const flow = getServiceFlow(serviceId);
  const checklist = flow.roadmap.checklist.map((item) => ({ ...item, completed: false }));
  const roadmap = syncRoadmapFromChecklist(checklist, { ...flow.roadmap, progress: 0 }, serviceId);
  const now = new Date().toISOString();

  return {
    serviceId,
    checklist,
    roadmap,
    answers: {},
    hasCompletedQuestions: false,
    status: "active",
    createdAt: now,
    updatedAt: now,
  };
}

export function instanceToListItem(
  instance: SavedRoadmapInstance,
  currentServiceId: string | null
): RoadmapListItem {
  const flow = getServiceFlow(instance.serviceId);
  const { roadmap } = instance;

  return {
    id: instance.serviceId,
    serviceId: instance.serviceId,
    title: roadmap.title || flow.roadmapTitle.replace(/^Your /, ""),
    location: roadmap.location || "Ghana",
    progress: roadmap.progress,
    riskLevel: roadmap.riskLevel,
    nextStep: roadmap.mainNextStep,
    status: instance.status,
    isCurrent: instance.serviceId === currentServiceId,
    updatedAt: instance.updatedAt,
  };
}

export function sortRoadmapInstances(
  instances: Record<string, SavedRoadmapInstance>,
  currentServiceId: string | null
): RoadmapListItem[] {
  return Object.values(instances)
    .map((instance) => instanceToListItem(instance, currentServiceId))
    .sort((a, b) => {
      if (a.isCurrent !== b.isCurrent) return a.isCurrent ? -1 : 1;
      if (a.status !== b.status) return a.status === "active" ? -1 : 1;
      return new Date(b.updatedAt).getTime() - new Date(a.updatedAt).getTime();
    });
}

export function getRoadmapStats(items: RoadmapListItem[]) {
  const total = items.length;
  const averageProgress = total
    ? Math.round(items.reduce((sum, item) => sum + item.progress, 0) / total)
    : 0;
  const atRiskCount = items.filter((item) => item.riskLevel !== "low").length;
  const pausedCount = items.filter((item) => item.status === "paused").length;
  const activeCount = items.filter((item) => item.status === "active").length;

  return { total, averageProgress, atRiskCount, pausedCount, activeCount };
}

export function getRoadmapContinueHref(serviceId: string): string {
  return "/roadmap";
}

export function getRoadmapChecklistHref(serviceId: string): string {
  return "/checklist";
}

export type { RoadmapListItem };
