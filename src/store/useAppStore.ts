"use client";

import { create } from "zustand";
import { persist } from "zustand/middleware";
import type {
  AccessibilitySettings,
  Roadmap,
  UserAnswers,
  ChecklistItem,
  SavedDocument,
  SavedRoadmapInstance,
} from "@/types";
import { getServiceFlow } from "@/lib/service-registry";
import { syncRoadmapFromChecklist } from "@/lib/checklist-sync";
import {
  buildRoadmapInstance,
  createInitialRoadmapInstance,
} from "@/lib/roadmap-instances";

interface AppState {
  userQuery: string;
  username: string;
  currentServiceId: string | null;
  answers: UserAnswers;
  roadmap: Roadmap;
  checklist: ChecklistItem[];
  roadmapInstances: Record<string, SavedRoadmapInstance>;
  documentUploaded: boolean;
  savedDocuments: SavedDocument[];
  hasCompletedQuestions: boolean;
  accessibility: AccessibilitySettings;

  setUserQuery: (query: string) => void;
  setUsername: (username: string) => void;
  setCurrentServiceId: (id: string | null) => void;
  activateService: (serviceId: string) => void;
  ensureServiceChecklist: (serviceId: string) => void;
  loadRoadmapInstance: (serviceId: string) => void;
  persistCurrentRoadmap: () => void;
  pauseRoadmap: (serviceId: string) => void;
  resumeRoadmap: (serviceId: string) => void;
  deleteRoadmap: (serviceId: string) => void;
  setAnswer: (key: keyof UserAnswers, value: string) => void;
  resetAnswers: () => void;
  setHasCompletedQuestions: (value: boolean) => void;
  toggleChecklistItem: (id: string) => void;
  setDocumentUploaded: (value: boolean) => void;
  addSavedDocument: (document: SavedDocument) => void;
  updateSavedDocument: (documentId: string, patch: Partial<SavedDocument>) => void;
  removeSavedDocument: (documentId: string) => void;
  updateRoadmapProgress: (progress: number) => void;
  setAccessibility: (settings: Partial<AccessibilitySettings>) => void;
}

const defaultAccessibility: AccessibilitySettings = {
  language: "English",
  explanationStyle: "simple",
  darkMode: false,
  biggerText: false,
  voiceReading: false,
  highContrast: false,
  reduceAnimations: false,
  mode: "simple",
};

const initialFlow = getServiceFlow("start-business");
const initialRoadmapInstance = createInitialRoadmapInstance("start-business");

function persistInstanceForService(
  instances: Record<string, SavedRoadmapInstance>,
  serviceId: string,
  state: Pick<AppState, "checklist" | "roadmap" | "answers" | "hasCompletedQuestions">
): Record<string, SavedRoadmapInstance> {
  return {
    ...instances,
    [serviceId]: buildRoadmapInstance(serviceId, state, instances[serviceId]),
  };
}

function applyInstanceToState(instance: SavedRoadmapInstance) {
  const roadmap = syncRoadmapFromChecklist(
    instance.checklist,
    instance.roadmap,
    instance.serviceId
  );

  return {
    currentServiceId: instance.serviceId,
    checklist: instance.checklist,
    roadmap,
    answers: instance.answers,
    hasCompletedQuestions: instance.hasCompletedQuestions,
  };
}

export const useAppStore = create<AppState>()(
  persist(
    (set, get) => ({
      userQuery: "",
      username: "",
      currentServiceId: "start-business",
      answers: {},
      roadmap: initialFlow.roadmap,
      checklist: initialFlow.roadmap.checklist,
      roadmapInstances: { "start-business": initialRoadmapInstance },
      documentUploaded: false,
      savedDocuments: [],
      hasCompletedQuestions: false,
      accessibility: defaultAccessibility,

      setUserQuery: (query) => set({ userQuery: query }),
      setUsername: (username) => set({ username: username.trim() }),
      setCurrentServiceId: (id) => set({ currentServiceId: id }),

      persistCurrentRoadmap: () =>
        set((state) => {
          const serviceId = state.currentServiceId;
          if (!serviceId) return state;
          return {
            roadmapInstances: persistInstanceForService(state.roadmapInstances, serviceId, state),
          };
        }),

      loadRoadmapInstance: (serviceId) =>
        set((state) => {
          let instances = { ...state.roadmapInstances };

          if (state.currentServiceId && state.currentServiceId !== serviceId) {
            instances = persistInstanceForService(instances, state.currentServiceId, state);
          }

          const existing = instances[serviceId];
          if (!existing) {
            const created = createInitialRoadmapInstance(serviceId);
            instances = { ...instances, [serviceId]: created };
            return {
              ...applyInstanceToState(created),
              roadmapInstances: instances,
            };
          }

          const resumed = {
            ...existing,
            status: "active" as const,
            updatedAt: new Date().toISOString(),
          };
          instances = { ...instances, [serviceId]: resumed };

          return {
            ...applyInstanceToState(resumed),
            roadmapInstances: instances,
          };
        }),

      pauseRoadmap: (serviceId) =>
        set((state) => {
          let instances = { ...state.roadmapInstances };

          if (state.currentServiceId === serviceId) {
            instances = persistInstanceForService(instances, serviceId, state);
          }

          const existing = instances[serviceId];
          if (!existing) return state;

          instances[serviceId] = {
            ...existing,
            status: "paused",
            updatedAt: new Date().toISOString(),
          };

          return { roadmapInstances: instances };
        }),

      resumeRoadmap: (serviceId) => {
        get().loadRoadmapInstance(serviceId);
      },

      deleteRoadmap: (serviceId) =>
        set((state) => {
          const instances = { ...state.roadmapInstances };
          delete instances[serviceId];

          if (state.currentServiceId !== serviceId) {
            return { roadmapInstances: instances };
          }

          const remainingIds = Object.keys(instances);
          if (remainingIds.length === 0) {
            const fresh = createInitialRoadmapInstance("start-business");
            return {
              ...applyInstanceToState(fresh),
              roadmapInstances: { "start-business": fresh },
            };
          }

          const nextId = remainingIds[0];
          const nextInstance = instances[nextId];
          return {
            ...applyInstanceToState(nextInstance),
            roadmapInstances: instances,
          };
        }),

      activateService: (serviceId) => {
        const flow = getServiceFlow(serviceId);
        const checklist = flow.roadmap.checklist.map((item) => ({ ...item, completed: false }));
        const roadmap = syncRoadmapFromChecklist(
          checklist,
          { ...flow.roadmap, progress: 0 },
          serviceId
        );
        const instance = buildRoadmapInstance(serviceId, {
          checklist,
          roadmap,
          answers: {},
          hasCompletedQuestions: false,
        });

        set((state) => ({
          currentServiceId: serviceId,
          roadmap,
          checklist,
          answers: {},
          hasCompletedQuestions: false,
          userQuery: "",
          roadmapInstances: {
            ...state.roadmapInstances,
            [serviceId]: instance,
          },
        }));
      },

      ensureServiceChecklist: (serviceId) =>
        set((state) => {
          let instances = { ...state.roadmapInstances };

          if (state.currentServiceId && state.currentServiceId !== serviceId) {
            instances = persistInstanceForService(instances, state.currentServiceId, state);
          }

          if (state.currentServiceId === serviceId) {
            const roadmap = syncRoadmapFromChecklist(state.checklist, state.roadmap, serviceId);
            instances = persistInstanceForService(instances, serviceId, { ...state, roadmap });
            return { roadmap, roadmapInstances: instances };
          }

          const existing = instances[serviceId];
          if (existing) {
            const roadmap = syncRoadmapFromChecklist(
              existing.checklist,
              existing.roadmap,
              serviceId
            );
            return {
              ...applyInstanceToState({ ...existing, roadmap }),
              roadmapInstances: {
                ...instances,
                [serviceId]: { ...existing, roadmap, updatedAt: new Date().toISOString() },
              },
            };
          }

          const created = createInitialRoadmapInstance(serviceId);
          return {
            ...applyInstanceToState(created),
            roadmapInstances: { ...instances, [serviceId]: created },
          };
        }),

      setAnswer: (key, value) =>
        set((state) => ({ answers: { ...state.answers, [key]: value } })),
      resetAnswers: () => set({ answers: {}, hasCompletedQuestions: false }),
      setHasCompletedQuestions: (value) =>
        set((state) => {
          const next = { hasCompletedQuestions: value };
          if (!state.currentServiceId) return next;
          const instances = persistInstanceForService(state.roadmapInstances, state.currentServiceId, {
            ...state,
            hasCompletedQuestions: value,
          });
          return { ...next, roadmapInstances: instances };
        }),
      toggleChecklistItem: (id) =>
        set((state) => {
          const checklist = state.checklist.map((item) =>
            item.id === id ? { ...item, completed: !item.completed } : item
          );
          const roadmap = syncRoadmapFromChecklist(
            checklist,
            state.roadmap,
            state.currentServiceId
          );
          const nextState = { checklist, roadmap };
          if (!state.currentServiceId) return nextState;

          return {
            ...nextState,
            roadmapInstances: persistInstanceForService(state.roadmapInstances, state.currentServiceId, {
              ...state,
              checklist,
              roadmap,
            }),
          };
        }),
      setDocumentUploaded: (value) => set({ documentUploaded: value }),
      addSavedDocument: (document) =>
        set((state) => ({
          savedDocuments: [document, ...state.savedDocuments.filter((d) => d.id !== document.id)],
          documentUploaded: true,
        })),
      updateSavedDocument: (documentId, patch) =>
        set((state) => ({
          savedDocuments: state.savedDocuments.map((document) =>
            document.id === documentId ? { ...document, ...patch } : document
          ),
        })),
      removeSavedDocument: (documentId) =>
        set((state) => {
          const remaining = state.savedDocuments.filter((document) => document.id !== documentId);
          return {
            savedDocuments: remaining,
            documentUploaded: remaining.length > 0,
          };
        }),
      updateRoadmapProgress: (progress) =>
        set((state) => {
          const roadmap = { ...state.roadmap, progress };
          if (!state.currentServiceId) return { roadmap };

          return {
            roadmap,
            roadmapInstances: persistInstanceForService(state.roadmapInstances, state.currentServiceId, {
              ...state,
              roadmap,
            }),
          };
        }),
      setAccessibility: (settings) =>
        set((state) => ({
          accessibility: { ...state.accessibility, ...settings },
        })),
    }),
    {
      name: "govflow-storage",
      partialize: (state) => ({
        userQuery: state.userQuery,
        username: state.username,
        answers: state.answers,
        checklist: state.checklist,
        roadmap: state.roadmap,
        roadmapInstances: state.roadmapInstances,
        documentUploaded: state.documentUploaded,
        savedDocuments: state.savedDocuments,
        hasCompletedQuestions: state.hasCompletedQuestions,
        accessibility: state.accessibility,
        currentServiceId: state.currentServiceId,
      }),
      onRehydrateStorage: () => (state) => {
        if (!state) return;

        state.roadmap = syncRoadmapFromChecklist(
          state.checklist,
          state.roadmap,
          state.currentServiceId
        );

        if (!state.roadmapInstances || Object.keys(state.roadmapInstances).length === 0) {
          const serviceId = state.currentServiceId || "start-business";
          state.roadmapInstances = {
            [serviceId]: buildRoadmapInstance(serviceId, state),
          };
        } else {
          const serviceId = state.currentServiceId;
          if (serviceId && state.roadmapInstances[serviceId]) {
            state.roadmapInstances[serviceId] = buildRoadmapInstance(
              serviceId,
              state,
              state.roadmapInstances[serviceId]
            );
          }
        }
      },
    }
  )
);

export { getChecklistProgress } from "@/lib/checklist-sync";
