"use client";

import { create } from "zustand";
import { persist } from "zustand/middleware";
import type {
  AccessibilitySettings,
  Roadmap,
  UserAnswers,
  ChecklistItem,
} from "@/types";
import { foodDeliveryRoadmap } from "@/data/roadmap";

interface AppState {
  userQuery: string;
  currentServiceId: string | null;
  answers: UserAnswers;
  roadmap: Roadmap;
  checklist: ChecklistItem[];
  documentUploaded: boolean;
  hasCompletedQuestions: boolean;
  accessibility: AccessibilitySettings;

  setUserQuery: (query: string) => void;
  setCurrentServiceId: (id: string | null) => void;
  setAnswer: (key: keyof UserAnswers, value: string) => void;
  resetAnswers: () => void;
  setHasCompletedQuestions: (value: boolean) => void;
  toggleChecklistItem: (id: string) => void;
  setDocumentUploaded: (value: boolean) => void;
  updateRoadmapProgress: (progress: number) => void;
  setAccessibility: (settings: Partial<AccessibilitySettings>) => void;
  clearDemoData: () => void;
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

export const useAppStore = create<AppState>()(
  persist(
    (set, get) => ({
      userQuery: "",
      currentServiceId: "start-business",
      answers: {},
      roadmap: foodDeliveryRoadmap,
      checklist: foodDeliveryRoadmap.checklist,
      documentUploaded: false,
      hasCompletedQuestions: false,
      accessibility: defaultAccessibility,

      setUserQuery: (query) => set({ userQuery: query }),
      setCurrentServiceId: (id) => set({ currentServiceId: id }),
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
      updateRoadmapProgress: (progress) =>
        set((state) => ({
          roadmap: { ...state.roadmap, progress },
        })),
      setAccessibility: (settings) =>
        set((state) => ({
          accessibility: { ...state.accessibility, ...settings },
        })),
      clearDemoData: () =>
        set({
          userQuery: "",
          answers: {},
          checklist: foodDeliveryRoadmap.checklist.map((i) => ({
            ...i,
            completed: false,
          })),
          roadmap: { ...foodDeliveryRoadmap, progress: 0 },
          documentUploaded: false,
          hasCompletedQuestions: false,
        }),
    }),
    {
      name: "govflow-storage",
      partialize: (state) => ({
        userQuery: state.userQuery,
        answers: state.answers,
        checklist: state.checklist,
        roadmap: state.roadmap,
        documentUploaded: state.documentUploaded,
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
