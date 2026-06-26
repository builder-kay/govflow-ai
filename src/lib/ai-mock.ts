import type { DocumentAnalysis } from "@/types";
import { mockDocumentAnalysis } from "@/data/roadmap";

export interface ChatMessage {
  id: string;
  role: "user" | "assistant";
  content: string;
  quickActions?: { label: string; href: string }[];
}

export function getFoodBusinessResponse(): ChatMessage {
  return {
    id: "assistant-1",
    role: "assistant",
    content:
      "Great. I can help you prepare a roadmap. For a food delivery business in Cape Coast, you may need business registration, GRA/tax setup, FDA food hygiene guidance, and a local assembly operating permit. I'll ask a few questions so I can build the right checklist for you.",
    quickActions: [
      { label: "Start questions", href: "/questions" },
      { label: "Build basic roadmap", href: "/roadmap" },
      { label: "Explain in simple English", href: "/roadmap" },
    ],
  };
}

export function analyzeDocument(_fileName?: string): DocumentAnalysis {
  return mockDocumentAnalysis;
}

export function matchesFoodBusinessQuery(query: string): boolean {
  const normalized = query.toLowerCase();
  return (
    (normalized.includes("food") || normalized.includes("delivery")) &&
    (normalized.includes("business") || normalized.includes("start")) &&
    (normalized.includes("cape coast") || normalized.includes("cape"))
  );
}
