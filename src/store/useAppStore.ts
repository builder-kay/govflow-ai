"use client";

import { create } from "zustand";
import { persist } from "zustand/middleware";
import type {
  AccessibilitySettings,
  Roadmap,
  UserAnswers,
  ChecklistItem,
  SavedDocument,
} from "@/types";
import { getServiceFlow } from "@/lib/service-registry";

interface AppState {
  userQuery: string;
  username: string;
  currentServiceId: string | null;
  answers: UserAnswers;
  roadmap: Roadmap;
  checklist: ChecklistItem[];
  documentUploaded: boolean;
  savedDocuments: SavedDocument[];
  hasCompletedQuestions: boolean;
  accessibility: AccessibilitySettings;

  setUserQuery: (query: string) => void;
  setUsername: (username: string) => void;
  setCurrentServiceId: (id: string | null) => void;
  activateService: (serviceId: string) => void;
  setAnswer: (key: keyof UserAnswers, value: string) => void;
  resetAnswers: () => void;
  setHasCompletedQuestions: (value: boolean) => void;
  toggleChecklistItem: (id: string) => void;
  setDocumentUploaded: (value: boolean) => void;
  addSavedDocument: (document: SavedDocument) => void;
  removeSavedDocument: (documentId: string) => void;
  updateRoadmapProgress: (progress: number) => void;
  setAccessibility: (settings: Partial<AccessibilitySettings>) => void;
}

const defaultAccessibility: AccessibilitySettings = {
  language: "English",
  explanationStyle: "simple",
  biggerText: false,
  voiceReading: false,
  highContrast: false,
  reduceAnimations: false,
  mode: "simple",
};

const initialFlow = getServiceFlow("start-business");

export const useAppStore = create<AppState>()(
  persist(
    (set, get) => ({
      userQuery: "",
      username: "",
      currentServiceId: "start-business",
      answers: {},
      roadmap: initialFlow.roadmap,
      checklist: initialFlow.roadmap.checklist,
      documentUploaded: false,
      savedDocuments: [],
      hasCompletedQuestions: false,
      accessibility: defaultAccessibility,

      setUserQuery: (query) => set({ userQuery: query }),
      setUsername: (username) => set({ username: username.trim() }),
      setCurrentServiceId: (id) => set({ currentServiceId: id }),
      activateService: (serviceId) => {
        const flow = getServiceFlow(serviceId);
        set({
          currentServiceId: serviceId,
          roadmap: { ...flow.roadmap, progress: 0 },
          checklist: flow.roadmap.checklist.map((item) => ({ ...item, completed: false })),
          answers: {},
          hasCompletedQuestions: false,
          userQuery: "",
        });
      },
      setAnswer: (key, value) =>
        set((state) => ({ answers: { ...state.answers, [key]: value } })),
      resetAnswers: () => set({ answers: {}, hasCompletedQuestions: false }),
      setHasCompletedQuestions: (value) => set({ hasCompletedQuestions: value }),
      toggleChecklistItem: (id) =>
        set((state) => {
          const checklist = state.checklist.map((item) =>
            item.id === id ? { ...item, completed: !item.completed } : item
          );
          const completed = checklist.filter((i) => i.completed).length;
          const progress = Math.round((completed / checklist.length) * 100);
          return {
            checklist,
            roadmap: { ...state.roadmap, progress },
          };
        }),
      setDocumentUploaded: (value) => set({ documentUploaded: value }),
      addSavedDocument: (document) =>
        set((state) => ({
          savedDocuments: [document, ...state.savedDocuments.filter((d) => d.id !== document.id)],
          documentUploaded: true,
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
        set((state) => ({
          roadmap: { ...state.roadmap, progress },
        })),
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
        documentUploaded: state.documentUploaded,
        savedDocuments: state.savedDocuments,
        hasCompletedQuestions: state.hasCompletedQuestions,
        accessibility: state.accessibility,
        currentServiceId: state.currentServiceId,
      }),
    }
  )
);

export function getChecklistProgress(checklist: ChecklistItem[]): number {
  if (checklist.length === 0) return 0;
  const completed = checklist.filter((i) => i.completed).length;
  return Math.round((completed / checklist.length) * 100);
}
