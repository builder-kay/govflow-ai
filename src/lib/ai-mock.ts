import type { DocumentAnalysis } from "@/types";
import { mockDocumentAnalysis } from "@/data/roadmap";
import { PASSPORT_PORTAL_URL } from "@/lib/passport-links";

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

type AnalyzeDocumentInput =
  | string
  | {
      fileName?: string;
      fileType?: string;
      fileSize?: number;
    };

function detectDocumentType(fileName: string, fileType: string): string {
  const lowerName = fileName.toLowerCase();
  if (fileType.includes("image/")) return "Scanned image document";
  if (lowerName.includes("passport")) return "Passport application document";
  if (lowerName.includes("ghana")) return "Ghana Card related document";
  if (lowerName.includes("fda")) return "FDA permit form";
  if (lowerName.endsWith(".pdf")) return "PDF government document";
  if (lowerName.endsWith(".doc") || lowerName.endsWith(".docx")) return "Word document form";
  return "Government service document";
}

export function analyzeDocument(input?: AnalyzeDocumentInput): DocumentAnalysis {
  const defaultName = "uploaded-document";
  const fileName = typeof input === "string" ? input : input?.fileName || defaultName;
  const fileType = typeof input === "string" ? "" : input?.fileType || "";
  const fileSize = typeof input === "string" ? undefined : input?.fileSize;
  const detectedType = detectDocumentType(fileName, fileType);

  return {
    ...mockDocumentAnalysis,
    documentType: detectedType,
    purpose:
      fileType.includes("image/")
        ? "This appears to be an image capture. Ensure all text is clear and fully visible before submission."
        : mockDocumentAnalysis.purpose,
    missingAreas: [
      ...mockDocumentAnalysis.missingAreas,
      ...(fileSize && fileSize > 8 * 1024 * 1024
        ? ["File is large; compress or crop where possible for faster upload and review."]
        : []),
    ],
    nextAction: `Review the analysis points, then continue with corrections for "${fileName}".`,
  };
}

export function matchesFoodBusinessQuery(query: string): boolean {
  const normalized = query.toLowerCase();
  return (
    (normalized.includes("food") || normalized.includes("delivery")) &&
    (normalized.includes("business") || normalized.includes("start")) &&
    (normalized.includes("cape coast") || normalized.includes("cape"))
  );
}

export function matchesPassportQuery(query: string): boolean {
  const normalized = query.toLowerCase();
  return normalized.includes("passport") || normalized.includes("akwantuo krataa");
}

export function matchesGhanaCardQuery(query: string): boolean {
  const normalized = query.toLowerCase();
  return (
    normalized.includes("ghana card") ||
    normalized.includes("national id") ||
    normalized.includes("nia") ||
    normalized.includes("ghana kaad") ||
    normalized.includes("kaad")
  );
}

export function matchesNationalServiceQuery(query: string): boolean {
  const normalized = query.toLowerCase();
  return (
    normalized.includes("national service") ||
    normalized.includes("nss") ||
    normalized.includes("posting") ||
    normalized.includes("posting check") ||
    normalized.includes("service person")
  );
}

export function matchesGraTaxQuery(query: string): boolean {
  const normalized = query.toLowerCase();
  return (
    normalized.includes("gra") ||
    normalized.includes("tax") ||
    normalized.includes("tin") ||
    normalized.includes("taxpayer")
  );
}

export function detectServiceFromQuery(query: string): string | null {
  if (matchesFoodBusinessQuery(query)) return "start-business";
  if (matchesPassportQuery(query)) return "passport";
  if (matchesNationalServiceQuery(query)) return "national-service";
  if (matchesGhanaCardQuery(query)) return "ghana-card";
  return null;
}

export function getPassportResponse(): ChatMessage {
  return {
    id: "assistant-passport",
    role: "assistant",
    content:
      "I can help you apply for a Ghana passport. You'll usually need a Ghana Card, birth certificate (for first-time applicants), and to apply online before booking a biometric appointment at a Passport Application Centre (PAC).",
    quickActions: [
      { label: "Start passport questions", href: "/questions" },
      { label: "Open checklist", href: "/checklist" },
      { label: "Official passport portal", href: PASSPORT_PORTAL_URL },
    ],
  };
}

export function getGhanaCardResponse(): ChatMessage {
  return {
    id: "assistant-ghana-card",
    role: "assistant",
    content:
      "I can guide your Ghana Card process step by step. We'll check your documents, where to go, and what to do if you're missing required details.",
    quickActions: [
      { label: "Start Ghana Card questions", href: "/questions" },
      { label: "Open Ghana Card checklist", href: "/checklist" },
      { label: "Get help in assistant", href: "/assistant?topic=ghana-card" },
    ],
  };
}

export function getNationalServiceResponse(): ChatMessage {
  return {
    id: "assistant-national-service",
    role: "assistant",
    content:
      "I can guide your National Service process step by step: school clearance, portal setup, posting checks, acceptance, and reporting.",
    quickActions: [
      { label: "Start National Service questions", href: "/questions" },
      { label: "Open NSS checklist", href: "/checklist" },
      { label: "Fix name/date mismatch", href: "/assistant?topic=national-service-mismatch" },
      { label: "Posting support", href: "/assistant?topic=national-service-posting" },
    ],
  };
}

export function getGraTaxResponse(): ChatMessage {
  return {
    id: "assistant-gra-tax",
    role: "assistant",
    content:
      "I can guide your full GRA/Tax process: get your tax number, prepare records, estimate taxes, understand filing, and avoid common penalties.",
    quickActions: [
      { label: "Start GRA/Tax questions", href: "/questions" },
      { label: "Open tax checklist", href: "/checklist" },
      { label: "Tax filing help", href: "/assistant?topic=gra-tax-filing" },
    ],
  };
}
